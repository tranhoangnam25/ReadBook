import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Giả sử bạn có hàm updateProfile trong authService
import { updateProfile, getCurrentUser } from '../services/authService';

interface EditProfileProps {
    onClose: () => void;
}

const EditProfilePage: React.FC<EditProfileProps> = ({ onClose }) => {
    // 1. Khai báo State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        // Có thể thêm bio, phone, avatarUrl...
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true); // Trạng thái đợi lấy dữ liệu cũ
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // 2. Lấy dữ liệu người dùng hiện tại khi mở modal
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Giả sử service này trả về thông tin user hiện tại
                const user = await getCurrentUser();
                setFormData({
                    fullName: user.fullName || user.username,
                    email: user.email,
                });
            } catch (err) {
                setError("Không thể tải thông tin người dùng");
            } finally {
                setFetching(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await updateProfile(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose(); // Đóng modal sau khi thành công 1.5s
            }, 1500);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Cập nhật thất bại");
            } else {
                setError("Đã xảy ra lỗi không xác định");
            }
        } finally {
            setLoading(false);
        }
    };

    // Xử lý phím Esc
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (fetching) return null; // Hoặc một loading spinner

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-hidden"
    onClick={onClose}
    >
    <main
        className="relative z-30 w-full max-w-md"
    onClick={(e) => e.stopPropagation()}
>
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800">
    <div className="px-8 pt-8 pb-6">
    <div className="text-center mb-8 relative">
    <button
        onClick={onClose}
    className="absolute -top-2 -right-2 text-slate-400 hover:text-primary transition-colors"
    >
    <span className="material-symbols-outlined">close</span>
        </button>

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 mb-4">
    <span className="material-symbols-outlined">person_edit</span>
        </div>
        <h2 className="text-2xl font-bold text-primary dark:text-slate-100">Edit Profile</h2>

    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        {success && <p className="text-green-500 text-xs mt-2">Cập nhật thành công!</p>}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
        <input
            name="fullName"
            value={formData.fullName}
            className="w-full px-4 py-3 rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 outline-none transition-all text-sm focus:ring-2 focus:ring-accent/50"
            type="text"
            onChange={handleChange}
            required
            />
            </div>
            <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
        <input
            name="email"
            value={formData.email}
            className="w-full px-4 py-3 rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 outline-none transition-all text-sm focus:ring-2 focus:ring-accent/50"
            type="email"
            onChange={handleChange}
            required
            />
            </div>

            <div className="flex gap-3 pt-2">
        <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-400 rounded transition-all"
                >
                Cancel
                </button>
                <button
            disabled={loading}
            className="flex-[2] py-3.5 bg-accent hover:bg-opacity-90 text-white font-bold rounded shadow-lg transition-all flex items-center justify-center gap-2"
            type="submit"
                >
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            {!loading && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
                </div>
                </form>
                </div>
                </div>
                </main>
                </div>
            );
            };

            export default EditProfilePage;