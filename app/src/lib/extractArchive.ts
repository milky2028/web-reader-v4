import { createWASMPath } from './file-streams/createWASMPath';

type ExtractArchiveParams = {
	wasm: Awaited<typeof import('$lib/wasm').wasm>;
	inputArchivePath: string;
	outputExtractionPath: string;
	extractData: boolean;
	onEntry?: (entry: { name: string; size: number }) => void;
};

type ExctractionData = {
	type: 'failure' | 'completion' | 'entry';
	name: string;
	size: number;
};

declare global {
	interface WindowEventMap {
		[jobId: string]: CustomEvent<ExctractionData>;
	}
}

export function extractArchive({
	wasm,
	inputArchivePath,
	outputExtractionPath,
	extractData,
	onEntry
}: ExtractArchiveParams) {
	return new Promise<void>((resolve, reject) => {
		const jobId = crypto.randomUUID();
		const onEvent = ({ detail: { type, name, size } }: CustomEvent<ExctractionData>) => {
			if (type === 'completion') {
				resolve();
			}

			if (type === 'failure') {
				reject();
			}

			if (type === 'entry') {
				onEntry?.({ name, size });
			}
		};

		window.addEventListener(jobId, onEvent);
		wasm.extract(
			jobId,
			createWASMPath(inputArchivePath),
			createWASMPath(outputExtractionPath),
			extractData
		);
	});
}
