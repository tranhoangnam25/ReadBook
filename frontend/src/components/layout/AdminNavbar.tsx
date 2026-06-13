import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-50 w-full h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div 
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2 text-primary cursor-pointer"
                >
                    <span className="material-symbols-outlined text-2xl font-bold">auto_stories</span>
                    <h1 className="text-lg font-black tracking-tighter uppercase">Sunset Admin</h1>
                </div>
                
                <div className="hidden md:flex items-center gap-4 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="material-symbols-outlined text-slate-400 text-sm">shield_person</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hệ thống quản trị</span>
                </div>
            </div>

            {/* Global Admin Search */}
            <div className="flex-1 max-w-xl px-8 hidden lg:block">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        search
                    </span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                        placeholder="Tìm kiếm nhanh hệ thống..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button 
                        onClick={() => navigate("/")}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                        title="Quay về trang chủ"
                    >
                        <span className="material-symbols-outlined">home</span>
                    </button>
                </div>

                <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 hover:bg-slate-50 p-1 pr-2 rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                            <img
                                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                className="w-full h-full object-cover"
                                alt="avatar"
                            />
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-none">
                            <span className="text-xs font-bold text-slate-900">{user.username || 'Admin'}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Administrator</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-[60]">
                            <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài khoản</p>
                                <p className="text-xs font-bold text-slate-700 truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={() => { navigate(`/update`); setIsDropdownOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">person</span>
                                Hồ sơ cá nhân
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">logout</span>
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
