import type { allocateFileStreaming } from './file-streams/allocateFileStreaming';

type ReadArchiveEntriesParams = {
	file: Awaited<ReturnType<typeof allocateFileStreaming>>;
	wasm: Awaited<typeof import('$lib/wasm').wasm>;
	extractData?: boolean;
};

function isImage(path: string) {
	return path.endsWith('.jpg') || path.endsWith('.png');
}

export function* readArchiveEntries({ file, wasm, extractData = false }: ReadArchiveEntriesParams) {
	const {
		open_archive,
		close_archive,
		get_next_entry,
		get_entry_name,
		entry_is_file,
		get_buffer,
		read_entry_data,
		get_entry_size,
		free_buffer,
		END_OF_FILE,
		ENTRY_ERROR
	} = wasm;

	const archivePtr = open_archive(file.ptr, file.size);
	if (archivePtr === ENTRY_ERROR) {
		throw new Error('Unable to open archive.');
	}

	for (;;) {
		const entryPtr = get_next_entry(archivePtr);
		if (entryPtr === END_OF_FILE || entryPtr === ENTRY_ERROR) {
			close_archive(archivePtr);
			file.free();
			return;
		}

		const path = get_entry_name(entryPtr).toLowerCase();
		const isFile = entry_is_file(entryPtr);

		if (isFile && !path.startsWith('__macosx') && isImage(path)) {
			const fileName = path.split('/').pop() ?? '';
			if (extractData) {
				const size = get_entry_size(entryPtr);
				const entryData = read_entry_data(archivePtr, entryPtr);
				const buffer = get_buffer(entryData, size);
				const file = new File([buffer], fileName, { type: 'image/jpg' });
				free_buffer(entryData);

				yield { fileName, file };
			} else {
				yield { fileName };
			}
		}
	}
}
