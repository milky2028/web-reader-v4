import { getParentAndChildPaths } from './getParentAndChildPaths';
import { getPathHandle } from './getPathHandle';

type DeletePathOptions = { recursive?: boolean };

export async function deletePath(
	path: string,
	{ recursive }: DeletePathOptions = { recursive: true }
): Promise<boolean> {
	try {
		const { parentPath, childPath } = getParentAndChildPaths(path);
		if (!parentPath || !childPath) {
			throw new Error(`Parent or child path not found for path: ${path}`);
		}

		const handle = await getPathHandle(parentPath, { kind: 'directory' });
		if (!handle) {
			throw new Error(`Path handle not found for deletion: ${path}`);
		}

		await handle.removeEntry(childPath, { recursive });
		return true;
	} catch (error) {
		return false;
	}
}
