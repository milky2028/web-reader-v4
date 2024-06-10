/** ***********************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 ************************************************************************* */
/// <reference lib="WebWorker" />;
import { deletePath } from './deletePath';
import { getPathHandle } from './getPathHandle';
import type {
	WorkerWriteFailureResponseEvent,
	WorkerWriteParamsEvent,
	WorkerWriteSuccessResponseEvent
} from './writeFileStream';

self.addEventListener(
	'message',
	async ({ data: { id, path, file } }: MessageEvent<WorkerWriteParamsEvent>) => {
		try {
			const handle = await getPathHandle(path, { create: true }); // Safari doesn't allow FileSystemFileHandles to be cloned, so we have to re-fetch the handle
			if (!handle) {
				const payload: WorkerWriteFailureResponseEvent = {
					id,
					status: 'failure',
					error: `Unable to create file handle for path: ${path}`
				};
				self.postMessage(payload);
				return;
			}

			const syncHandle = await handle.createSyncAccessHandle();
			let position = 0;

			const syncWriter = new WritableStream<Uint8Array>({
				write(chunk) {
					syncHandle.write(chunk, { at: position });
					position += chunk.byteLength;
				},
				async close() {
					// older browser versions have this API as async
					await syncHandle.close();
				}
			});

			if (typeof file === 'string') {
				const response = await fetch(file);
				if (!response.ok || !response.body) {
					throw new Error(`Failed to fetch file from url: ${file}`);
				}

				await response.body.pipeTo(syncWriter);

				const payload: WorkerWriteSuccessResponseEvent = { id, status: 'success' };
				self.postMessage(payload);
				return;
			}

			await file.stream().pipeTo(syncWriter);

			const payload: WorkerWriteSuccessResponseEvent = { id, status: 'success' };
			self.postMessage(payload);
		} catch (e) {
			deletePath(path);
			const payload: WorkerWriteFailureResponseEvent = {
				id,
				status: 'failure',
				error: e instanceof Error ? e.message : 'unknown'
			};
			self.postMessage(payload);
		}
	}
);
