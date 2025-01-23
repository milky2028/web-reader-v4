import { getPathHandle } from './getPathHandle';

export async function readFileStream(path: string): Promise<File | undefined> {
	try {
		// even though getPathHandle doesn't throw, getFile still can so we wrap in a try/catch and await
		const handle = await getPathHandle(path);
		return await handle?.getFile();
	} catch {
		return undefined;
	}
}
