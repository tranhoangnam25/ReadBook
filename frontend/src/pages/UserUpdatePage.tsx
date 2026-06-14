import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateProfile } from '../services/authService';
import { uploadFileToR2 } from '../services/uploadService';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        avatarUrl: ''
    });

    const [loading, setLoading] = useState(false); 
    const [fetching, setFetching] = useState(true); 
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ content: '', type: '' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = await getCurrentUser();
                setFormData({
                    username: user.username || '',
                    phone: user.phone || '',
                    email: user.email || '',
                    avatarUrl: user.avatarUrl || ''
                });
            } catch (err: any) {
                console.error(err);
                setMessage({ content: 'Không thể tải thông tin người dùng!', type: 'error' });
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (message.content) setMessage({ content: '', type: '' });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage({ content: '', type: '' });

        try {
            const response = await uploadFileToR2(file, 'avatar');
            setFormData(prev => ({ ...prev, avatarUrl: response.url }));
            setMessage({ content: 'Tải ảnh lên thành công!', type: 'success' });
        } catch (err: any) {
            console.error(err);
            setMessage({ content: 'Lỗi khi tải ảnh lên!', type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ content: '', type: '' });

        try {
            await updateProfile(formData);
            setMessage({ content: 'Cập nhật hồ sơ thành công!', type: 'success' });
            setTimeout(() => {
                window.location.reload(); 
            }, 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
            setMessage({ content: errorMsg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2c3e50]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

                {}
                <div className="bg-[#2c3e50] p-8 text-center">
                    <div className="relative inline-block group cursor-pointer" onClick={handleAvatarClick}>
                        <img
                            src={formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`}
                            alt="avatar"
                            className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-sm object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white">photo_camera</span>
                        </div>
                        {uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <h2 className="text-white text-2xl font-bold mt-4">{formData.username}</h2>
                    <p className="text-gray-300 text-sm">Thành viên của Sunset Books</p>
                </div>

                {}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                Tên người dùng
                            </label>
                            <input
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]/10 outline-none transition-all"
                                placeholder="Nhập tên của bạn"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                Email liên hệ
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]/10 outline-none transition-all"
                                placeholder="example@gmail.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                Số điện thoại
                            </label>
                            <input
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]/10 outline-none transition-all"
                                placeholder="090..."
                            />
                        </div>

                        {}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#2c3e50] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:bg-[#1a252f] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </form>

                    {}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <button
                            onClick={() => navigate('/change-password')}
                            className="text-[#b57a7a] font-semibold text-sm hover:text-[#945d5d] transition-colors"
                        >
                            Bạn muốn thay đổi mật khẩu?
                        </button>
                    </div>

                    {}
                    {message.content && (
                        <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold animate-fade-in ${
                            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                        }`}>
                            {message.content}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;