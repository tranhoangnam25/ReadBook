import React, { useEffect, useMemo, useState } from 'react';
import { Search, Bell, Settings, Plus, SlidersHorizontal, Edit, WalletCards, Eye, BookOpen, TrendingUp, AlertTriangle, UploadCloud } from 'lucide-react';

import Sidebar from '../../components/common/Sidebar';
import api from '../../services/api';
import { uploadFileToR2, type UploadType } from '../../services/uploadService';
import type { BookResponse } from '../../types';

interface BookPage {
    content: BookResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

interface EditBookForm {
    title: string;
    price: string;
    previewPercentage: string;
    description: string;
    coverImage: string;
    fileUrl: string;
    publishYear: string;
}

interface AuthorOption {
    id: number;
    name: string;
}

interface CategoryOption {
    id: number;
    name: string;
}

interface CreateBookForm extends EditBookForm {
    authorId: string;
    categoryId: string;
}

const emptyCreateForm: CreateBookForm = {
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

const ALL_CATEGORIES = 'Tất cả thể loại';
const statuses = ['Trạng thái kho', 'In Stock', 'Waitlist', 'Archived'];
type FeedbackScope = 'page' | 'create' | 'edit' | 'price' | 'preview';

export default function BookInventory(): React.JSX.Element {
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [authors, setAuthors] = useState<AuthorOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(ALL_CATEGORIES);
    const [status, setStatus] = useState(statuses[0]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
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
    const [createForm, setCreateForm] = useState<CreateBookForm>(emptyCreateForm);
    const [editForm, setEditForm] = useState<EditBookForm>({
        title: '',
        price: '',
        previewPercentage: '',
        description: '',
        coverImage: '',
        fileUrl: '',
        publishYear: '',
    });

    const pageSize = 10;

    const setFeedbackMessage = (scope: FeedbackScope, type: 'error' | 'success', message: string) => {
        setFeedback((current) => ({
            ...current,
            [scope]: {
                error: type === 'error' ? message : '',
                success: type === 'success' ? message : '',
            },
        }));
    };

    const clearFeedback = (scope: FeedbackScope) => {
        setFeedback((current) => ({
            ...current,
            [scope]: { error: '', success: '' },
        }));
    };

    const renderFeedback = (scope: FeedbackScope) => (
        <>
            {feedback[scope].error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {feedback[scope].error}
                </div>
            )}

            {feedback[scope].success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {feedback[scope].success}
                </div>
            )}
        </>
    );

    const fetchBooks = async () => {
        try {
            setLoading(true);
            clearFeedback('page');

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
            setFeedbackMessage('page', 'error', 'Không tải được danh sách sách từ database. Kiểm tra backend hoặc kết nối API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [category, keyword, page]);

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
                setFeedbackMessage('page', 'error', 'Không tải được danh sách tác giả/thể loại.');
            }
        };

        fetchLookupData();
    }, []);

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
        clearFeedback('edit');
        setEditForm({
            title: book.title || '',
            price: String(book.price ?? ''),
            previewPercentage: String(book.previewPercentage ?? ''),
            description: book.description || '',
            coverImage: book.coverImage || '',
            fileUrl: book.fileUrl || '',
            publishYear: String(book.publishYear ?? ''),
        });
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

    const handleFileUpload = async (
        file: File | undefined,
        uploadType: UploadType,
        formType: 'create' | 'edit',
        field: 'coverImage' | 'fileUrl',
    ) => {
        if (!file) return;

        const uploadKey = `${formType}-${field}`;
        const scope: FeedbackScope = formType;

        try {
            setUploadingField(uploadKey);
            clearFeedback(scope);

            const uploadedFile = await uploadFileToR2(file, uploadType);

            if (formType === 'create') {
                updateCreateForm(field, uploadedFile.url);
            } else {
                updateEditForm(field, uploadedFile.url);
            }

            setFeedbackMessage(scope, 'success', `Upload ${file.name} thành công.`);
        } catch (err) {
            console.error('Upload file failed:', err);
            setFeedbackMessage(scope, 'error', uploadType === 'cover' ? 'Không upload được ảnh bìa lên R2.' : 'Không upload được file EPUB lên R2.');
        } finally {
            setUploadingField(null);
        }
    };

    const renderUploadDropzone = (
        label: string,
        uploadType: UploadType,
        formType: 'create' | 'edit',
        field: 'coverImage' | 'fileUrl',
        value: string,
    ) => {
        const uploadKey = `${formType}-${field}`;
        const isUploading = uploadingField === uploadKey;
        const accept = uploadType === 'cover' ? 'image/jpeg,image/png,image/webp,image/gif' : '.epub,application/epub+zip';

        return (
            <div className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
                <span>{label}</span>
                <label
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition-colors hover:border-primary hover:bg-primary/5"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                        event.preventDefault();
                        void handleFileUpload(event.dataTransfer.files[0], uploadType, formType, field);
                    }}
                >
                    <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
                    <span className="font-semibold text-slate-700">
                        {isUploading ? 'Đang upload...' : 'Kéo-thả file vào đây hoặc bấm để chọn'}
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                        {uploadType === 'cover' ? 'JPG, PNG, WEBP, GIF' : 'EPUB'}
                    </span>
                    <input
                        accept={accept}
                        className="hidden"
                        disabled={isUploading}
                        type="file"
                        onChange={(event) => void handleFileUpload(event.target.files?.[0], uploadType, formType, field)}
                    />
                </label>
                <input
                    className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="URL sau khi upload sẽ tự điền tại đây"
                    value={value}
                    onChange={(event) => (formType === 'create' ? updateCreateForm(field, event.target.value) : updateEditForm(field, event.target.value))}
                />
            </div>
        );
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

    const validateBookForm = (form: CreateBookForm | EditBookForm) => {
        const price = Number(form.price);
        const previewPercentage = Number(form.previewPercentage);
        const publishYear = Number(form.publishYear);

        if (!form.title.trim()) return 'Tên sách không được để trống.';
        if (Number.isNaN(price) || price < 0) return 'Giá sách không hợp lệ.';
        if (Number.isNaN(previewPercentage) || previewPercentage < 0 || previewPercentage > 100) return 'Phần trăm đọc thử phải từ 0 đến 100.';
        if (Number.isNaN(publishYear) || publishYear < 1000) return 'Năm xuất bản không hợp lệ.';

        return '';
    };

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

            await api.post('/books', {
                title: createForm.title.trim(),
                price: Number(createForm.price),
                previewPercentage: Number(createForm.previewPercentage),
                description: createForm.description.trim(),
                coverImage: createForm.coverImage.trim(),
                fileUrl: createForm.fileUrl.trim(),
                publishYear: Number(createForm.publishYear),
                authorId: Number(createForm.authorId),
                categoryId: Number(createForm.categoryId),
            });

            setFeedbackMessage('page', 'success', 'Thêm sách mới thành công.');
            setIsCreateOpen(false);
            await fetchBooks();
        } catch (err) {
            console.error('Create book failed:', err);
            setFeedbackMessage('create', 'error', 'Không thêm được sách mới. Kiểm tra backend hoặc dữ liệu nhập.');
        } finally {
            setSaving(false);
        }
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingBook) return;

        const price = Number(editForm.price);
        const previewPercentage = Number(editForm.previewPercentage);
        const publishYear = Number(editForm.publishYear);

        if (!editForm.title.trim()) {
            setFeedbackMessage('edit', 'error', 'Tên sách không được để trống.');
            return;
        }

        if (Number.isNaN(price) || price < 0) {
            setFeedbackMessage('edit', 'error', 'Giá sách không hợp lệ.');
            return;
        }

        if (Number.isNaN(previewPercentage) || previewPercentage < 0 || previewPercentage > 100) {
            setFeedbackMessage('edit', 'error', 'Phần trăm đọc thử phải từ 0 đến 100.');
            return;
        }

        if (Number.isNaN(publishYear) || publishYear < 1000) {
            setFeedbackMessage('edit', 'error', 'Năm xuất bản không hợp lệ.');
            return;
        }

        try {
            setSaving(true);
            clearFeedback('edit');

            await api.put(`/books/${editingBook.id}`, {
                title: editForm.title.trim(),
                price,
                previewPercentage,
                description: editForm.description.trim(),
                coverImage: editForm.coverImage.trim(),
                fileUrl: editForm.fileUrl.trim(),
                publishYear,
            });

            setFeedbackMessage('page', 'success', 'Cập nhật sách thành công.');
            setEditingBook(null);
            await fetchBooks();
        } catch (err) {
            console.error('Update book failed:', err);
            setFeedbackMessage('edit', 'error', 'Không cập nhật được sách. Kiểm tra backend hoặc dữ liệu nhập.');
        } finally {
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">Thêm sách mới</h2>
                            <p className="text-sm text-slate-500">Chọn tác giả, thể loại và nhập thông tin sách.</p>
                        </div>

                        <form className="space-y-4 px-6 py-5" onSubmit={handleCreateSubmit}>
                            {renderFeedback('create')}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Tên sách
                                    <input
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={createForm.title}
                                        onChange={(event) => updateCreateForm('title', event.target.value)}
                                    />
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Giá
                                    <input
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        min="0"
                                        type="number"
                                        value={createForm.price}
                                        onChange={(event) => updateCreateForm('price', event.target.value)}
                                    />
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Tác giả
                                    <select
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={createForm.authorId}
                                        onChange={(event) => updateCreateForm('authorId', event.target.value)}
                                    >
                                        <option value="">Chọn tác giả</option>
                                        {authors.map((author) => (
                                            <option key={author.id} value={author.id}>{author.name}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Thể loại
                                    <select
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={createForm.categoryId}
                                        onChange={(event) => updateCreateForm('categoryId', event.target.value)}
                                    >
                                        <option value="">Chọn thể loại</option>
                                        {categoryOptions.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Phần trăm đọc thử
                                    <input
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        max="100"
                                        min="0"
                                        type="number"
                                        value={createForm.previewPercentage}
                                        onChange={(event) => updateCreateForm('previewPercentage', event.target.value)}
                                    />
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Năm xuất bản
                                    <input
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        min="1000"
                                        type="number"
                                        value={createForm.publishYear}
                                        onChange={(event) => updateCreateForm('publishYear', event.target.value)}
                                    />
                                </label>

                                {renderUploadDropzone('Ảnh bìa', 'cover', 'create', 'coverImage', createForm.coverImage)}

                                {renderUploadDropzone('File sách EPUB', 'book', 'create', 'fileUrl', createForm.fileUrl)}

                                <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Mô tả
                                    <textarea
                                        className="min-h-28 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={createForm.description}
                                        onChange={(event) => updateCreateForm('description', event.target.value)}
                                    />
                                </label>
                            </div>

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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h2 className="text-lg font-bold text-slate-900">Chỉnh sửa sách</h2>
                            <p className="text-sm text-slate-500">Cập nhật thông tin sách trong database.</p>
                        </div>

                        <form className="space-y-4 px-6 py-5" onSubmit={handleEditSubmit}>
                            {renderFeedback('edit')}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Tên sách
                                    <input
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={editForm.title}
                                        onChange={(event) => updateEditForm('title', event.target.value)}
                                    />
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Giá
                                    <input
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        min="0"
                                        type="number"
                                        value={editForm.price}
                                        onChange={(event) => updateEditForm('price', event.target.value)}
                                    />
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Phần trăm đọc thử
                                    <input
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        max="100"
                                        min="0"
                                        type="number"
                                        value={editForm.previewPercentage}
                                        onChange={(event) => updateEditForm('previewPercentage', event.target.value)}
                                    />
                                </label>

                                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Năm xuất bản
                                    <input
                                        className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        min="1000"
                                        type="number"
                                        value={editForm.publishYear}
                                        onChange={(event) => updateEditForm('publishYear', event.target.value)}
                                    />
                                </label>

                                {renderUploadDropzone('Ảnh bìa', 'cover', 'edit', 'coverImage', editForm.coverImage)}

                                {renderUploadDropzone('File sách EPUB', 'book', 'edit', 'fileUrl', editForm.fileUrl)}

                                <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-700">
                                    Mô tả
                                    <textarea
                                        className="min-h-28 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        value={editForm.description}
                                        onChange={(event) => updateEditForm('description', event.target.value)}
                                    />
                                </label>
                            </div>

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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
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
