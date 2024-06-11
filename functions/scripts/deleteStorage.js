const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('./cert.json');

const app = initializeApp({
	credential: cert(serviceAccount),
	storageBucket: 'gs://web-reader-ae90f.appspot.com'
});

const bucket = getStorage(app).bucket();
bucket.deleteFiles({ prefix: 'P1rHmhJ80KOevyB3EmxkyyEzUGj1' });
bucket.deleteFiles({ prefix: '9JSEgkf1lAULxvE8xShxILYt4n62' });
