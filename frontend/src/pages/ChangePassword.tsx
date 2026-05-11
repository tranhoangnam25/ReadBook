import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../services/authService';

const ChangePasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        currentPassword: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' }); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
        if (status.message) setStatus({ message: '', type: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        
        if (!data.currentPassword) {
            setStatus({ message: 'Vui lòng nhập mật khẩu hiện tại', type: 'error' });
            return;
        }
        if (data.password !== data.confirmPassword) {
            setStatus({ message: 'Mật khẩu mới không khớp', type: 'error' });
            return;
        }
        if (data.password.length < 6) {
            setStatus({ message: 'Mật khẩu mới phải từ 6 ký tự trở lên', type: 'error' });
            return;
        }

        setLoading(true);
        setStatus({ message: '', type: '' }); 

        try {
            await changePassword({
                currentPassword: data.currentPassword,
                password: data.password
            });

            setStatus({ message: 'Đổi mật khẩu thành công! 🎉', type: 'success' });
            setData({ currentPassword: '', password: '', confirmPassword: '' });

            setTimeout(() => navigate('/profile'), 1000);

        } catch (err: any) {
            console.error("Full Error:", err);

            
            const serverError = err.response?.data;
            let finalMessage = "Mật khẩu hiện tại không chính xác!";

            
            if (typeof serverError === 'string') {
                finalMessage = serverError;
            }
            
            else if (serverError && typeof serverError === 'object') {
                
                finalMessage = serverError.message || serverError.password || "Dữ liệu không hợp lệ!";
            }

            
            setStatus({
                message: finalMessage,
                type: 'error'
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">

                {}
                <button
                    onClick={() => navigate('/profile')}
                    className="mb-6 flex items-center text-sm text-gray-500 hover:text-[#2c3e50] transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại hồ sơ
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#162839] font-serif">Đổi Mật Khẩu</h2>
                    <p className="text-sm text-gray-400 mt-2">Đảm bảo tài khoản của bạn luôn an toàn</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            name="currentPassword"
                            type="password"
                            value={data.currentPassword}
                            placeholder="••••••••"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#b57a7a] focus:ring-2 focus:ring-[#b57a7a]/10 outline-none transition-all"
                        />
                    </div>

                    <hr className="border-gray-50" />

                    {}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            Mật khẩu mới
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={data.password}
                            placeholder="••••••••"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]/10 outline-none transition-all"
                        />
                    </div>

                    {}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={data.confirmPassword}
                            placeholder="••••••••"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]/10 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-[#b57a7a] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#a16666] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                    </button>
                </form>

                {}
                {status.message && (
                    <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold animate-pulse ${
                        status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}>
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordPage;