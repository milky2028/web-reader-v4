export function getParentAndChildPaths(path: string): {
	parentPath: string | undefined;
	childPath: string | undefined;
} {
	try {
		if (path.startsWith('./') || !path.startsWith('/') || path.includes('//')) {
			throw new Error(`Invalid path: ${path}`);
		}

		const segments = path.split('/').filter(Boolean);
		if (path === '/' || segments.length === 1) {
			return { parentPath: '/', childPath: segments[0] };
		}

		return { parentPath: `/${segments.slice(0, -1).join('/')}`, childPath: segments.pop() };
	} catch (error) {
		return { parentPath: undefined, childPath: undefined };
	}
}
