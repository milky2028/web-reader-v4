import { getParentAndChildPaths } from './getParentAndChildPaths';
import { writeFileStream } from './writeFileStream';

export async function writeJSONFile<T = unknown>(
	path: string,
	data: T
): Promise<FileSystemFileHandle | undefined> {
	try {
		const { childPath } = getParentAndChildPaths(path);
		if (childPath) {
			const file = new File([JSON.stringify(data)], childPath, { type: 'application/json' });
			return await writeFileStream(path, file);
		}

		return undefined;
	} catch {
		return undefined;
	}
}
