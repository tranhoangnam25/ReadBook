import UploadDropzone from './UploadDropzone';
import type {
    AuthorOption,
    BookFileField,
    BookFiles,
    CategoryOption,
    CreateBookForm,
    EditBookForm,
    FormMode,
} from './types';

interface BookFormFieldsProps {
    mode: FormMode;
    form: CreateBookForm | EditBookForm;
    files: BookFiles;
    uploadingField: string | null;
    authors?: AuthorOption[];
    categories?: CategoryOption[];
    onChange: (field: keyof CreateBookForm, value: string) => void;
    onFileSelect: (file: File | undefined, formType: FormMode, field: BookFileField) => void;
}

const inputClass = 'rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

const inputFields: Array<{ field: keyof EditBookForm; label: string; type?: 'number'; min?: string; max?: string }> = [
    { field: 'title', label: 'Tên sách' },
    { field: 'price', label: 'Giá', type: 'number', min: '0' },
];

const metaFields: Array<{ field: keyof EditBookForm; label: string; min: string; max?: string }> = [
    { field: 'previewPercentage', label: 'Phần trăm đọc thử', min: '0', max: '100' },
    { field: 'publishYear', label: 'Năm xuất bản', min: '1000' },
];

export default function BookFormFields({
    mode,
    form,
    files,
    uploadingField,
    authors = [],
    categories = [],
    onChange,
    onFileSelect,
}: BookFormFieldsProps) {
    const isCreate = mode === 'create';
    const createForm = form as CreateBookForm;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputFields.map(({ field, label, type, min, max }) => (
                <label key={field} className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    {label}
                    <input
                        className={inputClass}
                        max={max}
                        min={min}
                        type={type}
                        value={form[field]}
                        onChange={(event) => onChange(field, event.target.value)}
                    />
                </label>
            ))}

            {isCreate && (
                <>
                    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                        Tác giả
                        <select
                            className={inputClass}
                            value={createForm.authorId}
                            onChange={(event) => onChange('authorId', event.target.value)}
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
                            className={inputClass}
                            value={createForm.categoryId}
                            onChange={(event) => onChange('categoryId', event.target.value)}
                        >
                            <option value="">Chọn thể loại</option>
                            {categories.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </label>
                </>
            )}

            {metaFields.map(({ field, label, min, max }) => (
                <label key={field} className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    {label}
                    <input
                        className={inputClass}
                        max={max}
                        min={min}
                        type="number"
                        value={form[field]}
                        onChange={(event) => onChange(field, event.target.value)}
                    />
                </label>
            ))}

            <UploadDropzone label="Ảnh bìa" uploadType="cover" formType={mode} field="coverImage" value={form.coverImage} files={files} uploadingField={uploadingField} onFileSelect={onFileSelect} />

            <UploadDropzone label="File sách EPUB" uploadType="book" formType={mode} field="fileUrl" value={form.fileUrl} files={files} uploadingField={uploadingField} onFileSelect={onFileSelect} />

            <label className="md:col-span-2 flex flex-col gap-1 text-sm font-medium text-slate-700">
                Mô tả
                <textarea
                    className="min-h-28 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    value={form.description}
                    onChange={(event) => onChange('description', event.target.value)}
                />
            </label>
        </div>
    );
}
