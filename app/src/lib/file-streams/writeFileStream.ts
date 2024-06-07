import { deletePath } from './deletePath';
import { getPathHandle } from './getPathHandle';

export type WorkerWriteParamsEvent = { id: string; path: string; file: File | string };

export type WorkerWriteFailureResponseEvent = { id: string; status: 'failure'; error: string };
export type WorkerWriteSuccessResponseEvent = { id: string; status: 'success' };
export type WorkerWriteResponseEvent =
	| WorkerWriteFailureResponseEvent
	| WorkerWriteSuccessResponseEvent;

const INACTIVE_WORKER_TIMEOUT = 5_000;

let worker: Worker | undefined;
let timer = 0;

/** Reduces memory pressure by writing a file or fetch response stream as it's pulled. */
export async function writeFileStream(
	path: string,
	file: File | string
): Promise<FileSystemFileHandle | undefined> {
	try {
		const handle = await getPathHandle(path, { create: true });
		if (!handle) {
			throw new Error(`Unable to create path: ${path}`);
		}

		if ('createWritable' in handle && typeof handle.createWritable === 'function') {
			const writer = await handle.createWritable();
			if (typeof file === 'string') {
				const response = await fetch(file);
				if (!response.ok || !response.body) {
					throw new Error(`Failed to fetch file from url: ${file}`);
				}

				await response.body.pipeTo(writer);
				return handle;
			}

			await file.stream().pipeTo(writer);
			return handle;
		}

		// Safari does not support createWritable, so the file must be written from a Worker
		return await new Promise<FileSystemFileHandle | undefined>((resolve) => {
			const id = crypto.randomUUID();
			if (!worker) {
				worker = new Worker(new URL('./writeFileStream.worker', import.meta.url), {
					type: 'module'
				});
			}

			worker.addEventListener(
				'message',
				({ data: response }: MessageEvent<WorkerWriteResponseEvent>) => {
					if (response.id === id) {
						if (response.status === 'success') {
							resolve(handle);
						} else {
							resolve(undefined);
						}

						// kill worker after a period of inactivity to free up memory
						timer = window.setTimeout(() => worker?.terminate(), INACTIVE_WORKER_TIMEOUT);
					}
				}
			);

			clearTimeout(timer);
			const payload: WorkerWriteParamsEvent = { id, path, file };
			worker.postMessage(payload);
		});
	} catch (error) {
		deletePath(path);
		return undefined;
	}
}
