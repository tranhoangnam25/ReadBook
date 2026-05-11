import React, { useState, useEffect } from 'react';
import { register } from '../services/authService';
import axios from 'axios';

interface RegisterProps {
    onClose: () => void;
    onOpenLogin: () => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ onClose, onOpenLogin }) => {


    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);
        try {
            await register({
                username: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            alert("Đăng ký thành công!");
            onClose();
            onOpenLogin();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Đăng ký thất bại");
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
                            {}
                            <button
                                onClick={onClose}
                                className="absolute -top-2 -right-2 text-slate-400 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <h2 className="text-2xl font-bold text-primary dark:text-slate-100">Create Your Account</h2>
                            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                                <input
                                    name="fullName"
                                    className="w-full px-4 py-3 rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 outline-none transition-all text-sm focus:ring-2 focus:ring-accent/50"
                                    placeholder="Jane Doe"
                                    type="text"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Confirm</label>
                                    <input
                                        name="confirmPassword"
                                        className="w-full px-4 py-3 rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 outline-none transition-all text-sm focus:ring-2 focus:ring-accent/50"
                                        placeholder="••••••••"
                                        type="password"
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full py-3.5 bg-accent hover:bg-opacity-90 text-white font-bold rounded shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                                type="submit"
                            >
                                <span>{loading ? 'Processing...' : 'Get Started'}</span>

                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Already have an account?{' '}
                                <button
                                    onClick={() => {
                                        onClose();
                                        onOpenLogin();
                                    }}
                                    className="text-accent font-bold hover:underline transition-all"
                                >
                                    Login here
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;