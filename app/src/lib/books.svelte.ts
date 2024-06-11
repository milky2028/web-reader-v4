import { writeJSONFile } from './file-streams/writeJSONFile';

type Page = {
	name: string;
	extracted: boolean;
	syncedToCloud: boolean;
};

type Book = {
	cover: string;
	fullySyncedToCloud: string;
	lastReadPage: number;
	fullyExtracted: boolean;
	pages: Map<string, Page>;
};

export const books = $state(new Map<string, Book>());
export const updateBook = (name: string, book: Book) => books.set(name, book);

$effect(() => {
	writeJSONFile(`/books.json`, books.entries());
});
