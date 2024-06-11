import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { storage } from './storage';
import sharp from 'sharp';

function isImage(type: string | undefined) {
	return type?.startsWith('image/');
}

export const resizeImage = onObjectFinalized({ memory: '2GiB', cpu: 4 }, async (event) => {
	if (isImage(event.data.contentType)) {
		const { bucket, name: path, contentType } = event.data;
		const file = storage.bucket(bucket).file(path);
		const [buffer] = await file.download();
		const optimizedBuffer = await sharp(buffer).jpeg({ mozjpeg: true, quality: 75 }).toBuffer();
		await storage
			.bucket(event.data.bucket)
			.file(path)
			.save(optimizedBuffer, { metadata: { contentType } });
	}
});
