import { useCallback, useEffect, useState } from 'react';

import api from '../../../services/api';
import type { BookResponse } from '../../../types';
import { ALL_CATEGORIES, pageSize, type AuthorOption, type BookPage, type CategoryOption } from './types';

export const useBookInventoryData = (onError: (message: string) => void, clearPageFeedback: () => void) => {
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [authors, setAuthors] = useState<AuthorOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(ALL_CATEGORIES);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            clearPageFeedback();

            const response = await api.get<BookPage>('/books', {
                params: {
                    page,
                    size: pageSize,
                    ...(keyword.trim() && { keyword: keyword.trim() }),
                    ...(category !== ALL_CATEGORIES && { category }),
                },
            });

            setBooks(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
            setTotalElements(response.data.totalElements || 0);
        } catch (err) {
            console.error('Fetch books failed:', err);
            onError('Không tải được danh sách sách từ database. Kiểm tra backend hoặc kết nối API.');
        } finally {
            setLoading(false);
        }
    }, [category, clearPageFeedback, keyword, onError, page]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    useEffect(() => {
        const fetchLookupData = async () => {
            try {
                const [authorsResponse, categoriesResponse] = await Promise.all([
                    api.get<AuthorOption[]>('/authors'),
                    api.get<CategoryOption[]>('/categories'),
                ]);

                setAuthors(authorsResponse.data || []);
                setCategoryOptions(categoriesResponse.data || []);
            } catch (err) {
                console.error('Fetch lookup data failed:', err);
                onError('Không tải được danh sách tác giả/thể loại.');
            }
        };

        fetchLookupData();
    }, [onError]);

    return {
        authors,
        books,
        category,
        categoryOptions,
        fetchBooks,
        keyword,
        loading,
        page,
        setCategory,
        setKeyword,
        setPage,
        totalElements,
        totalPages,
    };
};
