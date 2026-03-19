import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu User để TypeScript không báo đỏ
interface User {
  username: string;
  email: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // 1. Lấy thông tin user từ localStorage khi trang load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Nếu không có user (chưa login) mà vào trang này thì đuổi về trang chủ khách
      navigate('/');
    }
  }, [navigate]);

  // 2. Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Quay về trang chủ
    window.location.reload(); // Refresh để xóa sạch trạng thái cũ
  };

  return (
      <div className="min-h-screen bg-[#f5f2eb] text-[#243447] font-sans">

        {/* HEADER / NAVBAR */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-4 bg-white/80 backdrop-blur-md border-b">
          <div className="flex items-center gap-10">
            <h1 className="text-xl font-bold flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              📖 Lumina Books
            </h1>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <a className="hover:text-[#e78f8f] transition-colors cursor-pointer">Feed</a>
              <a className="hover:text-[#e78f8f] transition-colors cursor-pointer">Library</a>
              <a className="hover:text-[#e78f8f] transition-colors cursor-pointer">Collections</a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* SEARCH BAR */}
            <div className="hidden sm:flex items-center bg-gray-100 px-4 py-2 rounded-lg w-[300px] border border-transparent focus-within:border-[#e78f8f] transition-all">
              <span className="material-symbols-outlined text-gray-400 text-sm">search</span>
              <input
                  className="bg-transparent outline-none ml-2 w-full text-sm"
                  placeholder="Find books, authors..."
              />
            </div>

            {/* USER PROFILE & LOGOUT */}
            <div className="group relative flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-semibold hidden lg:block">{user?.username}</span>
              <img
                  src={`https://ui-avatars.com/api/?name=${user?.username}&background=e78f8f&color=fff`}
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                  alt="avatar"
              />
              {/* Dropdown Menu khi di chuột vào avatar */}
              <div className="absolute right-0 top-10 w-40 bg-white shadow-xl rounded-xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">settings</span> Settings
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">logout</span> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

          {/* WELCOME SECTION */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome, <span className="text-[#e78f8f]">{user?.username || 'Reader'}</span>.
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Pick up exactly where you left off.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* LEFT COLUMN: Activity & History */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between text-[10px] text-gray-400 font-black tracking-widest mb-6">
                  <span>CURRENTLY READING</span>
                  <span className="flex items-center gap-1 text-[#e78f8f]">
                  <span className="w-1.5 h-1.5 bg-[#e78f8f] rounded-full animate-pulse"></span>
                  ACTIVE NOW
                </span>
                </div>

                <div className="relative group overflow-hidden rounded-2xl mb-6">
                  <img src="https://picsum.photos/id/24/600/800" className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>

                <h2 className="text-2xl font-bold mb-1">The Silent Echo</h2>
                <p className="text-gray-500 mb-6 font-medium">Eleanor Vance</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>64% Completed</span>
                    <span className="text-[#e78f8f]">128 / 200 pages</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#e78f8f] h-full rounded-full transition-all duration-1000" style={{ width: '64%' }}></div>
                  </div>
                </div>

                <button className="w-full mt-8 bg-[#2e4156] hover:bg-[#1a2a3a] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]">
                  Continue Reading
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Recommendations */}
            <div className="lg:col-span-7">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-bold">Recommended</h2>
                  <p className="text-[#e78f8f] font-semibold text-sm">Based on your interests</p>
                </div>
                <button className="text-sm font-bold text-gray-400 hover:text-[#e78f8f] transition-colors">Customize Feed</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Book Card Component (Tượng trưng) */}
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 hover:-translate-y-1 transition-all duration-300">
                      <img src={`https://picsum.photos/id/${item + 10}/300/400`} className="rounded-xl mb-4 w-full aspect-[3/4] object-cover shadow-sm" />
                      <span className="text-[10px] font-black text-[#e78f8f] tracking-widest uppercase">Trending</span>
                      <h3 className="font-bold text-lg mt-1">Book Title {item}</h3>
                      <p className="text-sm text-gray-500">Author Name</p>
                    </div>
                ))}

                {/* Discover Card */}
                <div className="bg-[#2e4156] text-white p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl shadow-blue-900/20">
                  <span className="material-symbols-outlined text-4xl mb-4 text-[#e78f8f]">explore</span>
                  <h3 className="text-xl font-bold mb-4 leading-snug">Explore more titles in Fiction</h3>
                  <button className="bg-[#e78f8f] hover:bg-[#d67e7e] px-6 py-2.5 rounded-xl font-bold transition-colors">
                    Browse Genres
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}