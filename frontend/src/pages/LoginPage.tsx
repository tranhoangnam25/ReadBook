import React, { useState, useEffect } from 'react';
import { login } from '../services/authService';
import axios from 'axios';

interface LoginProps {
    onClose: () => void;
    onOpenRegister: () => void;
    onLoginSuccess: () => void;
}

// 1. Đổi tên thành LoginPage
const LoginPage: React.FC<LoginProps> = ({ onClose, onOpenRegister,onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login({
                email: formData.email,
                password: formData.password
            });

            if (response) {
                // 1. Lưu Token
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }

                // 2. Lưu đối tượng user (để hiển thị tên/ảnh đại diện)
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));

                    // 3. QUAN TRỌNG: Lưu userId riêng biệt để hàm updateProfile sử dụng
                    // Giả sử backend trả về id trong response.user.id
                    if (response.user.id) {
                        localStorage.setItem('userId', response.user.id.toString());
                    }
                }
            }

            alert("Đăng nhập thành công!");

            onLoginSuccess();
            onClose();

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Email hoặc mật khẩu không đúng");
            } else {
                setError("Đã xảy ra lỗi không xác định");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        /* Dùng z-[100] để chắc chắn đè lên mọi thứ */
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-hidden"
            onClick={onClose}
        >
            <main
                className="relative z-[110] w-full max-w-md animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800">
                    <div className="px-8 pt-8 pb-6">
                        <div className="text-center mb-8 relative">
                            <button
                                onClick={onClose}
                                className="absolute -top-2 -right-2 text-slate-400 hover:text-primary transition-colors p-2"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                {/* Đổi icon thành lock cho đúng chất Login */}
                                <span className="material-symbols-outlined">lock</span>
                            </div>
                            <h2 className="text-2xl font-bold text-primary dark:text-slate-100">Welcome Back!</h2>
                            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                                <input
                                    name="email"
                                    className="w-full px-4 py-3 rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 outline-none transition-all text-sm focus:ring-2 focus:ring-accent/50"
                                    placeholder="jane@example.com"
                                    type="email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Password</label>
                                <input
                                    name="password"
                                    className="w-full px-4 py-3 rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 outline-none transition-all text-sm focus:ring-2 focus:ring-accent/50"
                                    placeholder="••••••••"
                                    type="password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                disabled={loading}
                                className="w-full py-3.5 bg-accent hover:bg-opacity-90 text-white font-bold rounded shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                                type="submit"
                            >
                                <span>{loading ? 'Logging in...' : 'Sign In'}</span>
                                <span className="material-symbols-outlined text-sm">login</span>
                            </button>
                        </form>

                        <div className="mt-6 text-center border-t border-slate-100 dark:border-zinc-800 pt-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => {
                                        onClose();
                                        onOpenRegister();
                                    }}
                                    className="text-accent font-bold hover:underline transition-all"
                                >
                                    Sign Up for free
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage; // Export đúng tên