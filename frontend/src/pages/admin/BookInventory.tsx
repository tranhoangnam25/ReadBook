import React, { useCallback, useMemo, useState } from 'react';
import { Search, Bell, Settings, Plus, SlidersHorizontal, Edit, WalletCards, Eye, BookOpen, TrendingUp, AlertTriangle } from 'lucide-react';

import Sidebar from '../../components/common/Sidebar';
import api from '../../services/api';
import { uploadFileToR2 } from '../../services/uploadService';
import type { BookResponse } from '../../types';
import { toBookPayload, toCreateBookPayload, toEditForm, validateBookForm } from './bookInventory/bookFormUtils';
import BookFormFields from './bookInventory/BookFormFields';
import FeedbackMessage from './bookInventory/FeedbackMessage';
import { useBookInventoryData } from './bookInventory/useBookInventoryData';
import {
    ALL_CATEGORIES,
    emptyCreateForm,
    emptyEditForm,
    pageSize,
    statuses,
    uploadEntries,
    type BookFileField,
    type BookFiles,
    type CreateBookForm,
    type EditBookForm,
    type FeedbackScope,
    type FormMode,
} from './bookInventory/types';

export default function BookInventory(): React.JSX.Element {
    const [status, setStatus] = useState(statuses[0]);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<Record<FeedbackScope, { error: string; success: string }>>({
        page: { error: '', success: '' },
        create: { error: '', success: '' },
        edit: { error: '', success: '' },
        price: { error: '', success: '' },
        preview: { error: '', success: '' },
    });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<BookResponse | null>(null);
    const [pricingBook, setPricingBook] = useState<BookResponse | null>(null);
    const [previewBook, setPreviewBook] = useState<BookResponse | null>(null);
    const [priceValue, setPriceValue] = useState('');
    const [previewValue, setPreviewValue] = useState('');
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [createFiles, setCreateFiles] = useState<BookFiles>({});
    const [editFiles, setEditFiles] = useState<BookFiles>({});
    const [createForm, setCreateForm] = useState<CreateBookForm>(emptyCreateForm);
    const [editForm, setEditForm] = useState<EditBookForm>(emptyEditForm);

    const setFeedbackMessage = useCallback((scope: FeedbackScope, type: 'error' | 'success', message: string) => {
        setFeedback((current) => ({
            ...current,
            [scope]: {
                error: type === 'error' ? message : '',
                success: type === 'success' ? message : '',
            },
        }));
    }, []);

    const clearFeedback = useCallback((scope: FeedbackScope) => {
        setFeedback((current) => ({
            ...current,
            [scope]: { error: '', success: '' },
        }));
    }, []);

    const showPageError = useCallback(
        (message: string) => setFeedbackMessage('page', 'error', message),
        [setFeedbackMessage],
    );

    const clearPageFeedback = useCallback(() => clearFeedback('page'), [clearFeedback]);

    const {
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
    } = useBookInventoryData(showPageError, clearPageFeedback);

    const renderFeedback = (scope: FeedbackScope) => <FeedbackMessage feedback={feedback} scope={scope} />;

    const filteredBooks = useMemo(() => {
        if (status === statuses[0]) return books;

        return books.filter((book) => (book.previewPercentage > 0 ? 'In Stock' : 'Archived') === status);
    }, [books, status]);

    const previewEnabledCount = filteredBooks.filter((book) => book.previewPercentage > 0).length;
    const needsPriceUpdateCount = filteredBooks.filter((book) => Number(book.price) <= 0).length;

    const openCreateModal = () => {
        setCreateForm({
            ...emptyCreateForm,
            authorId: authors[0]?.id ? String(authors[0].id) : '',
            categoryId: categoryOptions[0]?.id ? String(categoryOptions[0].id) : '',
        });
        setCreateFiles({});
        clearFeedback('create');
        setIsCreateOpen(true);
    };

    const closeCreateModal = () => {
        if (saving) return;
        setIsCreateOpen(false);
    };

    const updateCreateForm = (field: keyof CreateBookForm, value: string) => {
        setCreateForm((current) => ({ ...current, [field]: value }));
    };

    const openEditModal = (book: BookResponse) => {
        setEditingBook(book);
        setEditFiles({});
        clearFeedback('edit');
        setEditForm(toEditForm(book));
    };

    const closeEditModal = () => {
        if (saving) return;
        setEditingBook(null);
    };

    const openPriceModal = (book: BookResponse) => {
        setPricingBook(book);
        setPriceValue(String(book.price ?? ''));
        clearFeedback('price');
    };

    const closePriceModal = () => {
        if (saving) return;
        setPricingBook(null);
    };

    const openPreviewModal = (book: BookResponse) => {
        setPreviewBook(book);
        setPreviewValue(String(book.previewPercentage ?? ''));
        clearFeedback('preview');
    };

    const closePreviewModal = () => {
        if (saving) return;
        setPreviewBook(null);
    };

    const updateEditForm = (field: keyof EditBookForm, value: string) => {
        setEditForm((current) => ({ ...current, [field]: value }));
    };

    const handleFileSelect = (
        file: File | undefined,
        formType: FormMode,
        field: BookFileField,
    ) => {
        if (!file) return;

        clearFeedback(formType);

        if (formType === 'create') {
            setCreateFiles((current) => ({ ...current, [field]: file }));
            updateCreateForm(field, '');
        } else {
            setEditFiles((current) => ({ ...current, [field]: file }));
            updateEditForm(field, '');
        }
    };

    const uploadPendingFiles = async (
        formType: FormMode,
        files: BookFiles,
    ) => {
        const result: Partial<Record<BookFileField, string>> = {};

        for (const [field, uploadType] of uploadEntries) {
            const file = files[field];
            if (!file) continue;

            const uploadKey = `${formType}-${field}`;
            setUploadingField(uploadKey);
            const uploadedFile = await uploadFileToR2(file, uploadType);
            result[field] = uploadedFile.url;
        }

        setUploadingField(null);
        return result;
    };

    const buildUpdatePayload = (book: BookResponse, price: number, previewPercentage = book.previewPercentage) => ({
        title: book.title,
        price,
        previewPercentage,
        description: book.description || '',
        coverImage: book.coverImage || '',
        fileUrl: book.fileUrl || '',
        publishYear: book.publishYear,
    });

    const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationError = validateBookForm(createForm);
        if (validationError) {
            setFeedbackMessage('create', 'error', validationError);
            return;
        }

        if (!createForm.authorId || !createForm.categoryId) {
            setFeedbackMessage('create', 'error', 'Vui lòng chọn tác giả và thể loại.');
            return;
        }

        try {
            setSaving(true);
            clearFeedback('create');

            const uploadedFiles = await uploadPendingFiles('create', createFiles);

            await api.post('/books', toCreateBookPayload(createForm, uploadedFiles));

            setFeedbackMessage('page', 'success', 'Thêm sách mới thành công.');
            setCreateFiles({});
            setIsCreateOpen(false);
            await fetchBooks();
        } catch (err) {
            console.error('Create book failed:', err);
            setFeedbackMessage('create', 'error', 'Không thêm được sách mới hoặc upload file thất bại. Kiểm tra backend hoặc dữ liệu nhập.');
        } finally {
            setUploadingField(null);
            setSaving(false);
        }
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingBook) return;

        const validationError = validateBookForm(editForm);
        if (validationError) {
            setFeedbackMessage('edit', 'error', validationError);
            return;
        }

        try {
            setSaving(true);
            clearFeedback('edit');

            const uploadedFiles = await uploadPendingFiles('edit', editFiles);

            await api.put(`/books/${editingBook.id}`, {
                ...toBookPayload(editForm, uploadedFiles),
            });

            setFeedbackMessage('page', 'success', 'Cập nhật sách thành công.');
            setEditFiles({});
            setEditingBook(null);
            await fetchBooks();
        } catch (err) {
            console.error('Update book failed:', err);
            setFeedbackMessage('edit', 'error', 'Không cập nhật được sách hoặc upload file thất bại. Kiểm tra backend hoặc dữ liệu nhập.');
        } finally {
            setUploadingField(null);
            setSaving(false);
        }
    };

    const handlePriceSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!pricingBook) return;

        const nextPrice = Number(priceValue);

        if (Number.isNaN(nextPrice) || nextPrice < 0) {
            setFeedbackMessage('price', 'error', 'Giá sách không hợp lệ.');
            return;
        }

        try {
            setSaving(true);
            clearFeedback('price');

            await api.put(`/books/${pricingBook.id}`, buildUpdatePayload(pricingBook, nextPrice));

            setFeedbackMessage('page', 'success', `Cập nhật giá "${pricingBook.title}" thành công.`);
            setPricingBook(null);
            await fetchBooks();
        } catch (err) {
            console.error('Update price failed:', err);
            setFeedbackMessage('price', 'error', 'Không cập nhật được giá sách. Kiểm tra backend hoặc dữ liệu nhập.');
        } finally {
            setSaving(false);
        }
    };

    const handlePreviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!previewBook) return;

        const nextPreview = Number(previewValue);

        if (Number.isNaN(nextPreview) || nextPreview < 0 || nextPreview > 100) {
            setFeedbackMessage('preview', 'error', 'Phần trăm đọc thử phải từ 0 đến 100.');
            return;
        }

        try {
            setSaving(true);
            clearFeedback('preview');

            await api.put(`/books/${previewBook.id}`, buildUpdatePayload(previewBook, previewBook.price, nextPreview));

            setFeedbackMessage('page', 'success', `Cập nhật đọc thử "${previewBook.title}" thành công.`);
            setPreviewBook(null);
            await fetchBooks();
        } catch (err) {
            console.error('Update preview failed:', err);
            setFeedbackMessage('preview', 'error', 'Không cập nhật được nội dung đọc thử. Kiểm tra backend hoặc dữ liệu nhập.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
            <Sidebar />

            <main className="flex-1 ml-64 flex min-w-0 flex-col">
                <header className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Quản lý kho sách</h1>
                            <p className="text-slate-500 text-sm">
                                Quản lý thư viện số, giá cả và bản xem trước của bạn.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                                <Bell className="h-5 w-5" />
                            </button>
                            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                                <Settings className="h-5 w-5" />
                            </button>
                            <button
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all"
                                onClick={openCreateModal}
                            >
                                <Plus className="h-5 w-5" />
                                <span>Thêm sách mới</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <input
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm outline-none"
                                placeholder="Tìm kiếm theo tên sách, tác giả..."
                                type="text"
                                value={keyword}
                                onChange={(event) => {
                                    setKeyword(event.target.value);
                                    setPage(0);
                                }}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                className="bg-slate-100 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm px-4 py-2 outline-none"
                                value={category}
                                onChange={(event) => {
                                    setCategory(event.target.value);
                                    setPage(0);
                                }}
                            >
                                <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
                                {categoryOptions.map((item) => (
                                    <option key={item.id} value={item.name}>{item.name}</option>
                                ))}
                            </select>

                            <select
                                className="bg-slate-100 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-sm px-4 py-2 outline-none"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                            >
                                {statuses.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>

                            <button
                                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
                                onClick={() => window.alert('Bộ lọc nâng cao sẽ được bổ sung sau.')}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                <span>Thêm bộ lọc</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="p-8 flex-1 overflow-auto">
                    <div className="mb-4 space-y-3">
                        {renderFeedback('page')}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Ảnh bìa
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Tên sách & Tác giả
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Thể loại
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Giá
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {loading && (
                                        <tr>
                                            <td className="px-6 py-12 text-center text-slate-500" colSpan={5}>
                                                Đang tải danh sách sách...
                                            </td>
                                        </tr>
                                    )}

                                    {!loading && filteredBooks.map((book) => (
                                        <tr key={book.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-12 h-16 bg-slate-200 rounded overflow-hidden shadow-sm">
                                                    {book.coverImage ? (
                                                        <img
                                                            alt={`Ảnh bìa ${book.title}`}
                                                            className="w-full h-full object-cover"
                                                            src={book.coverImage}
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                            <BookOpen className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{book.title}</span>
                                                    <span className="text-sm text-slate-500">{book.authorName || 'Chưa có tác giả'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                                                    {book.category || 'Chưa có thể loại'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium">{book.price.toLocaleString('vi-VN')} ₫</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="p-2 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                                                        title="Chỉnh sửa chi tiết"
                                                        onClick={() => openEditModal(book)}
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                                                        title="Cập nhật giá"
                                                        onClick={() => openPriceModal(book)}
                                                    >
                                                        <WalletCards className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                                                        title="Quản lý nội dung đọc thử"
                                                        onClick={() => openPreviewModal(book)}
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {!loading && filteredBooks.length === 0 && (
                                        <tr>
                                            <td className="px-6 py-12 text-center text-slate-500" colSpan={5}>
                                                Không tìm thấy sách phù hợp.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
                            <span className="text-sm text-slate-500">
                                Hiển thị {filteredBooks.length ? page * pageSize + 1 : 0} đến {page * pageSize + filteredBooks.length} trong số {totalElements} kết quả
                            </span>
                            <div className="flex gap-1">
                                <button
                                    className="px-3 py-1 border border-slate-200 rounded disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                                    disabled={page === 0}
                                    onClick={() => setPage((current) => Math.max(current - 1, 0))}
                                >
                                    Trước
                                </button>
                                <button className="px-3 py-1 bg-primary text-white rounded">{page + 1}</button>
                                <button
                                    className="px-3 py-1 border border-slate-200 rounded disabled:text-slate-400 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage((current) => Math.min(current + 1, totalPages - 1))}
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="px-8 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Tổng số sách</p>
                            <p className="text-xl font-bold">{totalElements.toLocaleString('vi-VN')} Cuốn</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Có đọc thử trang này</p>
                            <p className="text-xl font-bold">{previewEnabledCount.toLocaleString('vi-VN')} Cuốn</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Cần cập nhật giá trang này</p>
                            <p className="text-xl font-bold">{needsPriceUpdateCount.toLocaleString('vi-VN')} Mục</p>
                        </div>
                    </div>
                </footer>
            </main>

            {isCreateOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
                    onClick={closeCreateModal}
                >
                    <div
                        className="w-full max-w-3xl rounded-2xl bg-white shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">Thêm sách mới</h2>
                            <p className="text-sm text-slate-500">Chọn tác giả, thể loại và nhập thông tin sách.</p>
                        </div>

                        <form className="space-y-4 px-6 py-5" onSubmit={handleCreateSubmit}>
                            {renderFeedback('create')}

                            <BookFormFields
                                authors={authors}
                                categories={categoryOptions}
                                files={createFiles}
                                form={createForm}
                                mode="create"
                                uploadingField={uploadingField}
                                onChange={updateCreateForm}
                                onFileSelect={handleFileSelect}
                            />

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    type="button"
                                    onClick={closeCreateModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    type="submit"
                                >
                                    {saving ? 'Đang lưu...' : 'Thêm sách'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {editingBook && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
                    onClick={closeEditModal}
                >
                    <div
                        className="w-full max-w-3xl rounded-2xl bg-white shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">Chỉnh sửa sách</h2>
                            <p className="text-sm text-slate-500">Cập nhật thông tin sách trong database.</p>
                        </div>

                        <form className="space-y-4 px-6 py-5" onSubmit={handleEditSubmit}>
                            {renderFeedback('edit')}

                            <BookFormFields
                                files={editFiles}
                                form={editForm}
                                mode="edit"
                                uploadingField={uploadingField}
                                onChange={(field, value) => updateEditForm(field as keyof EditBookForm, value)}
                                onFileSelect={handleFileSelect}
                            />

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    type="button"
                                    onClick={closeEditModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    type="submit"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {previewBook && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
                    onClick={closePreviewModal}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">Quản lý nội dung đọc thử</h2>
                            <p className="text-sm text-slate-500">{previewBook.title}</p>
                        </div>

                        <form className="space-y-4 px-6 py-5" onSubmit={handlePreviewSubmit}>
                            {renderFeedback('preview')}

                            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                Phần trăm đọc thử
                                <input
                                    className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    max="100"
                                    min="0"
                                    type="number"
                                    value={previewValue}
                                    onChange={(event) => setPreviewValue(event.target.value)}
                                />
                            </label>

                            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                Đọc thử hiện tại: {previewBook.previewPercentage}%
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    type="button"
                                    onClick={closePreviewModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    type="submit"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu đọc thử'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {pricingBook && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
                    onClick={closePriceModal}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">Cập nhật giá</h2>
                            <p className="text-sm text-slate-500">{pricingBook.title}</p>
                        </div>

                        <form className="space-y-4 px-6 py-5" onSubmit={handlePriceSubmit}>
                            {renderFeedback('price')}

                            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                Giá mới
                                <input
                                    className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    min="0"
                                    type="number"
                                    value={priceValue}
                                    onChange={(event) => setPriceValue(event.target.value)}
                                />
                            </label>

                            <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                Giá hiện tại: {pricingBook.price.toLocaleString('vi-VN')} ₫
                            </div>

                            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    type="button"
                                    onClick={closePriceModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="rounded-lg bg-primary px-5 py-2 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={saving}
                                    type="submit"
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu giá'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
