import type { UploadType } from '../../../services/uploadService';
import type { BookResponse } from '../../../types';

export interface BookPage {
    content: BookResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export interface EditBookForm {
    title: string;
    price: string;
    previewPercentage: string;
    description: string;
    coverImage: string;
    fileUrl: string;
    publishYear: string;
}

export interface CreateBookForm extends EditBookForm {
    authorId: string;
    categoryId: string;
}

export interface AuthorOption {
    id: number;
    name: string;
}

export interface CategoryOption {
    id: number;
    name: string;
}

export type BookFileField = 'coverImage' | 'fileUrl';
export type FormMode = 'create' | 'edit';
export type BookFiles = Partial<Record<BookFileField, File>>;
export type FeedbackScope = 'page' | 'create' | 'edit' | 'price' | 'preview';

export const ALL_CATEGORIES = 'Tất cả thể loại';
export const statuses = ['Trạng thái kho', 'In Stock', 'Waitlist', 'Archived'];
export const pageSize = 10;
export const uploadEntries: Array<[BookFileField, UploadType]> = [
    ['coverImage', 'cover'],
    ['fileUrl', 'book'],
];

export const emptyCreateForm: CreateBookForm = {
    title: '',
    price: '0',
    previewPercentage: '0',
    description: '',
    coverImage: '',
    fileUrl: '',
    publishYear: String(new Date().getFullYear()),
    authorId: '',
    categoryId: '',
};

export const emptyEditForm: EditBookForm = {
    title: '',
    price: '',
    previewPercentage: '',
    description: '',
    coverImage: '',
    fileUrl: '',
    publishYear: '',
};
