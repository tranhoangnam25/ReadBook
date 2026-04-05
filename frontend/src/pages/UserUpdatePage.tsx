import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import để sử dụng axios.isAxiosError
import {updateProfile, getCurrentUser} from '../services/authService';

const ProfileSettings: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        currentPassword: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            try {
                const user = await getCurrentUser();
                if (isMounted) {
                    setFormData(prev => ({
                        ...prev,
                        username: user.username || '',
                        phone: user.phone || ''
                    }));
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                if (isMounted) setFetching(false);
            }
        };
        loadData().catch(err => console.error(err));
        return () => { isMounted = false; };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    interface UserUpdatePayload {
        username: string;
        phone?: string;
        password?: string;
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // 1. Kiểm tra logic mật khẩu ở Client
        if (formData.password) {
            if (formData.password.length < 8) {
                setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 8 ký tự!' });
                setLoading(false);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
                setLoading(false);
                return;
            }
        }

        try {
            // 2. Chuẩn bị payload khớp với UserUpdateRequest (Java)
            const payload: UserUpdatePayload = {
                username: formData.username,
                phone: formData.phone
            };

            // Chỉ thêm field password nếu có giá trị
            if (formData.password && formData.password.trim() !== "") {
                payload.password = formData.password;
            }

            // 3. CHỈ GỌI MỘT API DUY NHẤT (vì Controller xử lý cả 3 trong 1)
            await updateProfile(payload);

            setMessage({ type: 'success', text: 'Cập nhật Profile thành công!' });

            // Reset các ô nhập mật khẩu
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                password: '',
                confirmPassword: ''
            }));
        } catch (err: unknown) {
            let errorText = 'Cập nhật thất bại';
            if (axios.isAxiosError(err)) {
                // Hiển thị message lỗi chính xác từ Backend (ví dụ: "Mật khẩu phải ít nhất 8 ký tự")
                errorText = err.response?.data?.message || err.response?.data || errorText;
            }
            setMessage({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-20 text-center italic serif-text">Loading Atelier...</div>;

    return (
        <div className="bg-[#fcf9f2] min-h-screen text-[#1c1c18] font-['Inter']">


            <div className="flex max-w-screen-2xl mx-auto relative">
                <aside className="fixed left-0 top-24 h-[calc(100vh-6rem)] hidden lg:flex flex-col p-8 bg-[#f6f3ec] w-72">
                    <div className="mb-10">
                        <h2 className="text-lg text-[#162839] font-['Noto_Serif']">Your Curated Collection</h2>
                        <p className="text-xs text-[#162839]/50 uppercase tracking-widest mt-1">Manage your literary sanctuary</p>
                    </div>
                    <nav className="flex flex-col gap-4">
                        <a className="text-sm uppercase tracking-widest text-[#162839] font-semibold border-l-4 border-[#162839] pl-4 flex items-center gap-3" href="#profile">
                            <span className="material-symbols-outlined text-[20px]">person</span> Profile Information
                        </a>
                        <a className="text-sm uppercase tracking-widest text-[#162839]/50 pl-5 hover:text-[#162839] flex items-center gap-3 py-2 rounded-r-lg" href="#security">
                            <span className="material-symbols-outlined text-[20px]">security</span> Security
                        </a>
                    </nav>
                </aside>

                <main className="flex-1 lg:ml-72 p-8 lg:p-16">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-12">
                            <span className="text-[#7b5455] text-sm tracking-[0.2em] uppercase mb-2 block">Personal Atelier</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-[#162839] tracking-tight font-['Noto_Serif']">Profile Information</h2>
                        </header>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div className="md:col-span-4">
                                <div className="bg-[#f6f3ec] p-8 rounded-xl flex flex-col items-center text-center">
                                    <div className="relative group cursor-pointer w-40 h-40 rounded-full overflow-hidden mb-6 bg-[#e5e2db]">
                                        <img className="w-full h-full object-cover" src="https://via.placeholder.com/150" alt="Avatar" />
                                        <div className="absolute inset-0 bg-[#162839]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-1 font-['Noto_Serif']">{formData.username}</h3>
                                    <p className="text-[#43474c] text-sm mb-6">Premium Reader</p>
                                    <button type="button" className="px-6 py-2 border border-[#c4c6cd] text-[#162839] rounded-full font-medium hover:bg-[#e5e2db] text-sm transition-colors">
                                        Change Image
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-8 flex flex-col gap-12">
                                <section>
                                    <h3 className="text-2xl font-semibold mb-8 text-[#162839] font-['Noto_Serif']">Identity Details</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="group">
                                            <label className="block text-xs uppercase tracking-widest text-[#43474c] mb-2 ml-1">Full Name</label>
                                            <input
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                // Tối ưu: focus:ring-accent thay vì mã màu Hex
                                                className="w-full bg-[#f6f3ec] border-none rounded-xl px-5 py-4 text-[#1c1c18] focus:ring-accent outline-none transition-all"
                                                type="text"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                            <div className="group">
                                                <label className="block text-xs uppercase tracking-widest text-[#43474c] mb-2 ml-1">Phone Number</label>
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#f6f3ec] border-none rounded-xl px-5 py-4 outline-none"
                                                    type="tel"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="p-8 bg-[#f6f3ec] rounded-xl">
                                    <h3 className="text-2xl font-semibold mb-8 text-[#162839] font-['Noto_Serif']">Change Password</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <input
                                            name="currentPassword"
                                            placeholder="Current Password (Required to change password)"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            required={!!formData.password} // Bắt buộc nhập nếu định đổi mật khẩu
                                            className={`w-full border-none rounded-xl px-5 py-4 outline-none ${
                                                formData.password ? 'bg-accent/5 ring-1 ring-accent/20' : 'bg-[#e5e2db]/50'
                                            }`}
                                            type="password"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <input
                                                name="password"
                                                placeholder="New Password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full bg-[#e5e2db]/50 border-none rounded-xl px-5 py-4 outline-none"
                                                type="password"
                                            />
                                            <input
                                                name="confirmPassword"
                                                placeholder="Confirm New Password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full bg-[#e5e2db]/50 border-none rounded-xl px-5 py-4 outline-none"
                                                type="password"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {message.text && (
                                    <p className={`text-sm font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                                        {message.text}
                                    </p>
                                )}
                                <div className="flex flex-col md:flex-row items-center justify-end gap-6 pt-8 border-t border-[#f6f3ec]">
                                    <button type="button" className="text-[#43474c] font-medium hover:text-[#162839] px-6 py-2">Discard Changes</button>
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="bg-[#2c3e50] text-white px-10 py-4 rounded-xl font-semibold shadow-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Updating...' : 'Update Curator Profile'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfileSettings;