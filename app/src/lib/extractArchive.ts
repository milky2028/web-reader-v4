import { createWASMPath } from './file-streams/createWASMPath';

type ExtractArchiveParams = {
	wasm: Awaited<typeof import('$lib/wasm').wasm>;
	inputArchivePath: string;
	outputExtractionPath: string;
	extractData: boolean;
	onEntry?: (buffer: any, name: string, size: number) => void;
};

export function extractArchive({
	wasm,
	inputArchivePath,
	outputExtractionPath,
	extractData,
	onEntry
}: ExtractArchiveParams) {
	return new Promise<void>((resolve, reject) => {
		wasm.extract(
			createWASMPath(inputArchivePath),
			createWASMPath(outputExtractionPath),
			extractData,
			() => resolve(),
			() => reject(),
			onEntry ? onEntry : () => {}
		);
	});
}
