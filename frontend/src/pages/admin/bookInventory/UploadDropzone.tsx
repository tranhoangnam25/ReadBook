import { UploadCloud } from 'lucide-react';

import type { UploadType } from '../../../services/uploadService';
import type { BookFileField, BookFiles, FormMode } from './types';

interface UploadDropzoneProps {
    label: string;
    uploadType: UploadType;
    formType: FormMode;
    field: BookFileField;
    value: string;
    files: BookFiles;
    uploadingField: string | null;
    onFileSelect: (file: File | undefined, formType: FormMode, field: BookFileField) => void;
}

export default function UploadDropzone({
    label,
    uploadType,
    formType,
    field,
    value,
    files,
    uploadingField,
    onFileSelect,
}: UploadDropzoneProps) {
    const uploadKey = `${formType}-${field}`;
    const isUploading = uploadingField === uploadKey;
    const selectedFile = files[field];
    const accept = uploadType === 'cover' ? 'image/jpeg,image/png,image/webp,image/gif' : '.epub,application/epub+zip';
    const helperText = selectedFile ? `Đã chọn: ${selectedFile.name}` : uploadType === 'cover' ? 'JPG, PNG, WEBP, GIF' : 'EPUB';

    return (
        <div className="md:col-span-2 flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span>{label}</span>
            <label
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition-colors hover:border-primary hover:bg-primary/5"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();
                    onFileSelect(event.dataTransfer.files[0], formType, field);
                }}
            >
                <UploadCloud className="mb-2 h-8 w-8 text-slate-400" />
                <span className="font-semibold text-slate-700">
                    {isUploading ? 'Đang upload...' : 'Kéo-thả file vào đây hoặc bấm để chọn'}
                </span>
                <span className="mt-1 text-xs text-slate-500">{helperText}</span>
                <input
                    accept={accept}
                    className="hidden"
                    disabled={isUploading}
                    type="file"
                    onChange={(event) => onFileSelect(event.target.files?.[0], formType, field)}
                />
            </label>

            {formType === 'edit' && value && !selectedFile && (
                <p className="truncate rounded-lg bg-slate-50 px-3 py-2 text-xs font-normal text-slate-500">
                    File hiện tại: {value}
                </p>
            )}
        </div>
    );
}
