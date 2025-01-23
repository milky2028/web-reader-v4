import { readFileStream } from './readFileStream';

export async function readJSONFile<T = unknown>(path: string): Promise<T | undefined> {
	try {
		const file = await readFileStream(path);
		if (file) {
			const text = await file.text();
			return JSON.parse(text) as T;
		}

		return undefined;
	} catch {
		return undefined;
	}
}
