<script lang="ts">
	import { allocateFileStreaming } from '$lib/allocateFileStreaming';
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
		const totalUploadSize = files.reduce((acc, curr) => acc + curr.size, 0);

		const { quota = 0 } = await navigator.storage.estimate();
		if (totalUploadSize > ONE_GIBIBYTE * 10) {
			await navigator.storage.persist();
		}

		if (totalUploadSize > quota) {
			throw new Error('Insufficient disk space to upload file.');
		}

		const wasm = await import('$lib/wasm').then(({ wasm }) => wasm);
		const extractions = files.map(async (file) => {
			const bookName = file.name.slice(0, file.name.length - 4);
			const allocatedFile = await allocateFileStreaming(file);

			for (const entry of readArchiveEntries({ file: allocatedFile, wasm, extractData: true })) {
				console.log(entry.file);
			}

			allocatedFile.free();
			return bookName;
		});

		await Promise.all(extractions);
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
