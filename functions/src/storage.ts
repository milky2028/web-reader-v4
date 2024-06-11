import { getStorage } from 'firebase-admin/storage';
import { app } from './app';

export const storage = getStorage(app);
