const pageBase = {
	name: '',
	extracted: false,
	syncedToCloud: false
};

const bookBase = {
	name: '',
	cover: '',
	lastExtractedPage: 0,
	lastPageSyncedToCloud: 0,
	lastReadPage: 0,
	pages: new Map<string, Page>()
};

export type Book = typeof bookBase;
export type Page = typeof pageBase;

export const books = $state(new Map<string, Book>());
export const updateBook = (name: string, book: Partial<Book>) =>
	books.set(name, { ...bookBase, ...book });

export const updatePage = (bookName: string, pageName: string, page: Partial<Page>) =>
	books.get(bookName)?.pages.set(pageName, { ...pageBase, ...page });
