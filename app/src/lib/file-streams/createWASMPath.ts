const WASM_ROOT = '/opfs';

export function createWASMPath(path: string): `${typeof WASM_ROOT}${typeof path}` {
	return `${WASM_ROOT}${path}`;
}
