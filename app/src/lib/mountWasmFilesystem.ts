export function mountWasmFilesystem(wasm: Awaited<typeof import('$lib/wasm').wasm>) {
	return new Promise<void>((resolve) => {
		const jobId = crypto.randomUUID();
		window.addEventListener(jobId, () => resolve(), { once: true });
		wasm.mount_filesystem(jobId);
	});
}
