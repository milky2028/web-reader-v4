import { onRequest } from 'firebase-functions/v2/https';
import { db } from './db';
import { auth } from './auth';

export const getBooks = onRequest(async (req, res) => {
	const { authorization } = req.headers;
	if (!authorization) {
		res.status(500).send('Unauthorized request.');
		return;
	}

	try {
		const token = await auth.verifyIdToken(authorization);
		const docs = await db
			.collection('books')
			.where('userId', '==', token.uid)
			.orderBy('name')
			.get();

		const books = docs.docs.map((doc) => {
			const data = doc.data();
			delete data.userId;
			return data;
		});

		res.status(200).send(books);
	} catch (e) {
		if (e instanceof Error) {
			res.status(500).send(e.message);
		} else {
			res.status(500).send(e);
		}
	}
});
