import type { BookResponse } from '../../../types';
import type { BookFileField, CreateBookForm, EditBookForm } from './types';

export const toEditForm = (book: BookResponse): EditBookForm => ({
    title: book.title || '',
    price: String(book.price ?? ''),
    previewPercentage: String(book.previewPercentage ?? ''),
    description: book.description || '',
    coverImage: book.coverImage || '',
    fileUrl: book.fileUrl || '',
    publishYear: String(book.publishYear ?? ''),
});

export const toBookPayload = (form: EditBookForm, urls: Partial<Record<BookFileField, string>> = {}) => ({
    title: form.title.trim(),
    price: Number(form.price),
    previewPercentage: Number(form.previewPercentage),
    description: form.description.trim(),
    coverImage: (urls.coverImage ?? form.coverImage).trim(),
    fileUrl: (urls.fileUrl ?? form.fileUrl).trim(),
    publishYear: Number(form.publishYear),
});

export const toCreateBookPayload = (form: CreateBookForm, urls: Partial<Record<BookFileField, string>> = {}) => ({
    ...toBookPayload(form, urls),
    authorId: Number(form.authorId),
    categoryId: Number(form.categoryId),
});

export const validateBookForm = (form: CreateBookForm | EditBookForm) => {
    const { price, previewPercentage, publishYear, title } = toBookPayload(form);

    if (!title) return 'Tên sách không được để trống.';
    if (Number.isNaN(price) || price < 0) return 'Giá sách không hợp lệ.';
    if (Number.isNaN(previewPercentage) || previewPercentage < 0 || previewPercentage > 100) return 'Phần trăm đọc thử phải từ 0 đến 100.';
    if (Number.isNaN(publishYear) || publishYear < 1000) return 'Năm xuất bản không hợp lệ.';

    return '';
};
