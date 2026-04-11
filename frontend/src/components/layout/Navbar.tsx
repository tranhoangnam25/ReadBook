import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
    onOpenRegister: () => void;
    onOpenLogin: () => void;
    isLoggedIn: boolean; // Thêm prop này để kiểm tra trạng thái
}

export default function Navbar({ onOpenRegister, onOpenLogin, isLoggedIn }: NavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Lấy thông tin user từ localStorage (giả sử bạn đã lưu khi login thành công)
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Reload lại trang để đưa App.tsx về trạng thái chưa đăng nhập (isLoggedIn = false)
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 backdrop-blur-md px-6 lg:px-20 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
                {/* LOGO & NAV LINKS */}
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-3xl">auto_stories</span>
                        <h1 className="text-xl font-bold tracking-tight">Sunset Books</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium hover:text-accent transition-colors" href="/">Explore</a>
                        <a className="text-sm font-medium hover:text-accent transition-colors" href="#">My Library</a>
                        <a className="text-sm font-medium hover:text-accent transition-colors" href="/shop">Shop</a>
                    </nav>
                </div>

                {/* SEARCH & ACTIONS */}
                <div className="flex flex-1 items-center justify-end gap-6">
                    <div className="relative hidden lg:flex items-center gap-2 w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-xl">search</span>
                        <input
                            className="w-full rounded-lg border-none bg-primary/5 py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-accent"
                            placeholder="Search titles..."
                            type="text"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {!isLoggedIn ? (
                            // CHƯA ĐĂNG NHẬP: Hiện Login/Sign Up
                            <>
                                <button
                                    onClick={onOpenLogin}
                                    className="px-4 py-2 text-sm font-semibold hover:text-accent transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={onOpenRegister}
                                    className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            // ĐÃ ĐĂNG NHẬP: Hiện Tên và Ảnh đại diện (Dropdown)
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 p-1 rounded-full hover:bg-primary/5 transition-all"
                                >
                                    <span className="text-sm font-bold text-[#2C3E50] hidden sm:block">
                                        {user.username || 'Reader'}
                                    </span>
                                    <div className="w-10 h-10 rounded-full border-2 border-accent overflow-hidden shadow-sm">
                                        <img
                                            src={user.avatarUrl || "https://picsum.photos/100"}
                                            alt="User profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>

                                {/* DROPDOWN MENU */}
                                {isDropdownOpen && (
                                    <>
                                        {/* Overlay để bấm ra ngoài thì đóng menu */}
                                        <div
                                            className="fixed inset-0 z-[-1]"
                                            onClick={() => setIsDropdownOpen(false)}
                                        ></div>

                                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-primary/5 py-2 z-50 animate-in fade-in zoom-in duration-150">
                                            <button
                                                onClick={() => { navigate(`/users/me/update/${user.id}`); setIsDropdownOpen(false); }}
                                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#2C3E50] hover:bg-primary/5 flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-lg">person_edit</span>
                                                Sửa hồ sơ
                                            </button>
                                            <div className="h-[1px] bg-primary/5 my-1 mx-2"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-lg">logout</span>
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}