import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
    onOpenRegister: () => void;
    onOpenLogin: () => void;
    isLoggedIn: boolean;
}

export default function Navbar({ onOpenRegister, onOpenLogin, isLoggedIn }: NavbarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // SEARCH REALTIME
    useEffect(() => {
        const delay = setTimeout(() => {
            if (window.location.pathname.startsWith("/shop")) {
                navigate(`/shop?keyword=${encodeURIComponent(keyword)}`);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [keyword]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = "/";
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 backdrop-blur-md px-6 lg:px-20 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">

                {/* LOGO */}
                <div className="flex items-center gap-12">
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-primary cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-3xl">auto_stories</span>
                        <h1 className="text-xl font-bold tracking-tight">Sunset Books</h1>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a onClick={() => navigate("/")} className="text-sm font-medium hover:text-accent cursor-pointer">Explore</a>
                        <a className="text-sm font-medium hover:text-accent cursor-pointer">My Library</a>
                        <a onClick={() => navigate("/shop")} className="text-sm font-medium hover:text-accent cursor-pointer">Shop</a>
                    </nav>
                </div>

                {/* SEARCH */}
                <div className="flex flex-1 items-center justify-end gap-6">
                    <div className="relative hidden lg:flex items-center gap-2 w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-xl">
                            search
                        </span>

                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full rounded-lg border-none bg-primary/5 py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-accent"
                            placeholder="Search title, author..."
                        />
                    </div>

                    {/* ACTION */}
                    <div className="flex items-center gap-3">
                        {!isLoggedIn ? (
                            <>
                                <button onClick={onOpenLogin} className="px-4 py-2 text-sm font-semibold">
                                    Login
                                </button>
                                <button
                                    onClick={onOpenRegister}
                                    className="bg-accent text-white px-4 py-2 rounded-lg font-semibold"
                                >
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-sm font-bold hidden sm:block">
                                        {user.username || 'Reader'}
                                    </span>

                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <img
                                            src={user.avatarUrl || "https://picsum.photos/100"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg py-2">
                                        <button
                                            onClick={() => navigate(`/users/me/profile`)}
                                            className="w-full text-left px-4 py-2 text-sm"
                                        >
                                            Sửa hồ sơ
                                        </button>
                                        <button
                                            onClick={() => navigate(`/users/me/change-password`)}
                                             className="w-full text-left px-4 py-2 text-sm"
                                        >
                                            Đổi mật khẩu
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-500"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}