let mounted = false;

export function mountWasmFilesystem(wasm: Awaited<typeof import('$lib/wasm').wasm>) {
	return new Promise<void>((resolve) => {
		if (!mounted) {
			const jobId = crypto.randomUUID();
			window.addEventListener(
				jobId,
				() => {
					resolve();
					mounted = true;
				},
				{ once: true }
			);
			wasm.mount_filesystem(jobId);
		}

		resolve();
	});
}
