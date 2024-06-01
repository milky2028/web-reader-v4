import { onRequest } from 'firebase-functions/v2/https';
import { getStorage } from 'firebase-admin/storage';
import { auth } from './auth';
import { app } from './app';
import { type Request } from 'express';

export const getPage = onRequest(async (req: Request, res) => {
	const { book, cover } = req.query;
	const { authorization } = req.headers;
	if (!book || !cover || !authorization) {
		res
			.status(500)
			.send(`Missing request parameters. Book: ${book}, Cover: ${cover}, Auth: ${authorization}`);
		return;
	}

	try {
		const decodedToken = await auth.verifyIdToken(authorization);
		const bucket = getStorage(app).bucket();
		const [file] = await bucket.file(`${decodedToken.uid}/${book}/${cover}`).download();
		const responseHeaders = {
			'Content-Type': 'image/jpeg',
			'Cache-Control': 'public, max-age=31536000, s-maxage=31536000'
		};

		res.status(200).header(responseHeaders).send(file);
	} catch (e) {
		if (e instanceof Error) {
			res.status(500).send(e.message);
		} else {
			res.status(500).send(e);
		}
	}
});
