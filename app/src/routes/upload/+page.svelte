<script lang="ts">
	import { extractArchive } from '$lib/extractArchive';
	import { allocateFileStreaming } from '$lib/file-streams/allocateFileStreaming';
	import { getPathHandle } from '$lib/file-streams/getPathHandle';
	import { writeFileStream } from '$lib/file-streams/writeFileStream';
	import { mountWasmFilesystem } from '$lib/mountWasmFilesystem';
	import { readArchiveEntries } from '$lib/readArchiveEntries';

	const acceptedFileTypes = [
		// zip
		'.cbz',
		'.zip',
		'application/zip',
		'application/x-zip-compressed',
		'multipart/x-zip',
		// rar
		'.cbr',
		'application/vnd.rar',
		'application/x-rar-compressed',
		// both
		'application/octet-stream'
	];

	async function collectEntries({
		wasm,
		inputArchivePath,
		outputExtractionPath
	}: {
		wasm: Awaited<typeof import('$lib/wasm').wasm>;
		inputArchivePath: string;
		outputExtractionPath: string;
	}) {
		const entries: string[] = [];
		await extractArchive({
			wasm,
			inputArchivePath,
			outputExtractionPath,
			extractData: false,
			onEntry: (entryName) => entries.push(entryName)
		});
		return entries.sort();
	}

	function onDragover(event: DragEvent) {
		event.preventDefault();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'copy';
		}
	}

	function getFiles(event: DragEvent | (Event & { currentTarget: HTMLInputElement })) {
		const files =
			event instanceof DragEvent ? event.dataTransfer?.files : event.currentTarget.files;
		return Array.from(files ?? []).filter((file) => file.name.match(/.cbr|.cbz|.rar|.zip$/));
	}

	const ONE_GIBIBYTE = 1024 * 1024 * 1024;
	async function upload(files: File[]) {
		const filesTooBig = files.some((file) => file.size > 2 * ONE_GIBIBYTE);
		if (filesTooBig) {
			throw new Error('Cannot upload files larger than 2GB.');
		}

		const totalUploadSize = files.reduce((acc, curr) => acc + curr.size, 0);
		const { quota = 0, usage = 0 } = await navigator.storage.estimate();
		if (totalUploadSize + usage > quota) {
			await navigator.storage.persist();
		}

		if (totalUploadSize + usage > quota) {
			throw new Error('Insufficient disk space to upload file.');
		}

		const module = await import('$lib/wasm').then(({ wasm }) => wasm);
		await mountWasmFilesystem(module);

		const extractions = files.map(async (file) => {
			const bookName = file.name.substring(0, file.name.length - 4);
			const inputArchivePath = `/archives/${bookName}`;
			const archiveHandle = await writeFileStream(inputArchivePath, file);
			if (!archiveHandle) {
				throw new Error(`Unable to write archive to path: ${inputArchivePath}`);
			}

			const outputExtractionPath = `/books/${bookName}/`;
			const extractionPath = await getPathHandle(outputExtractionPath, {
				kind: 'directory',
				create: true
			});

			if (!extractionPath) {
				throw new Error(`Unable to create extraction path: ${outputExtractionPath}`);
			}

			const [coverName] = await collectEntries({
				wasm: module,
				inputArchivePath,
				outputExtractionPath
			});

			const start = performance.now();
			await extractArchive({
				wasm: module,
				inputArchivePath,
				outputExtractionPath,
				extractData: true,
				onEntry: (entry) => {
					console.log('Entry extracted', entry);
					if (entry === coverName) {
						console.log('Cover found', performance.now() - start);
					}
				}
			});
			console.log('Book extracted', performance.now() - start);
		});

		await Promise.all(extractions);

		// const extractions = files.map(async (file) => {
		// 	const bookName = file.name.slice(0, file.name.length - 4);
		// 	const allocatedFile = await allocateFileStreaming(file);

		// 	for (const entry of readArchiveEntries({
		// 		file: allocatedFile,
		// 		wasm: module,
		// 		extractData: true
		// 	})) {
		// 		console.log(entry.file);
		// 	}

		// 	return bookName;
		// });

		// await Promise.all(extractions);
	}
</script>

<style>
	.container {
		display: grid;
		place-items: center;
		height: 90%;
	}

	.drop-zone {
		height: 40vh;
		width: 40vw;
		border-radius: 2rem;
		border-width: 1px;
		border-style: dashed;
		border-color: black;
		display: grid;
		grid-template-areas: 'main';
		place-items: center;

		@media (prefers-color-scheme: dark) {
			border-color: white;
		}
	}

	.drag-message-container {
		grid-area: main;

		h2 {
			font-weight: 100;
			font-size: 1rem;
		}
	}

	input {
		cursor: pointer;
		grid-area: main;
		height: 100%;
		width: 100%;
		opacity: 0;
	}
</style>

<div class="container">
	<div role="button" tabindex="0" class="drop-zone" on:dragover={onDragover}>
		<div class="drag-message-container"><h2>Drag and drop or click to upload a book</h2></div>
		<input
			type="file"
			accept={acceptedFileTypes.join()}
			multiple
			on:change={(event) => upload(getFiles(event))}
		/>
	</div>
</div>
