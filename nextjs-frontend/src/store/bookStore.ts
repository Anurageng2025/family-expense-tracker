import { create } from 'zustand';
import api from '@/services/api';

interface Book {
  id: string;
  name: string;
  isDefault: boolean;
  familyId: string;
}

interface BookState {
  books: Book[];
  currentBookId: string | null;
  isLoading: boolean;
  fetchBooks: () => Promise<void>;
  setCurrentBookId: (id: string) => void;
  createBook: (name: string) => Promise<Book>;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  currentBookId: null,
  isLoading: false,

  fetchBooks: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/books');
      const books = response.data.data;
      set({ books });
      
      // If no current book selected, pick the default one or the first one
      if (!get().currentBookId && books.length > 0) {
        const defaultBook = books.find((b: Book) => b.isDefault) || books[0];
        set({ currentBookId: defaultBook.id });
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentBookId', defaultBook.id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentBookId: (id) => {
    set({ currentBookId: id });
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentBookId', id);
    }
  },

  createBook: async (name) => {
    try {
      const response = await api.post('/books', { name });
      const newBook = response.data.data;
      set((state) => ({ books: [...state.books, newBook] }));
      return newBook;
    } catch (error) {
      console.error('Failed to create book:', error);
      throw error;
    }
  },
}));

// Initialize from localStorage if on client
if (typeof window !== 'undefined') {
  const savedId = localStorage.getItem('currentBookId');
  if (savedId) {
    useBookStore.getState().setCurrentBookId(savedId);
  }
}
