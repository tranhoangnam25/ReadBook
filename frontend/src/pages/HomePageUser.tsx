/* cspell:disable */
import React, { useEffect, useState } from "react";
import type { User, Reading, HistoryItem, Book } from "../types";

const BASE_URL = "http://localhost:8080";

export default function HomePageUser() {
  // State chính
  const [user, setUser] = useState<User | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState("");

  // Tự động load dữ liệu khi vào trang
  useEffect(() => {
    // Lấy user từ localStorage trước để hiện tên nhanh
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Sau đó gọi API để cập nhật dữ liệu mới nhất
    fetchUser();
    fetchReading();
    fetchHistory();
    fetchRecommend();
  }, []);

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const res = await fetch(`${BASE_URL}/api/users/me?id=${userId}`);
      if (!res.ok) throw new Error("User API lỗi");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("fetchUser:", err);
    }
  };

  const fetchReading = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`${BASE_URL}/api/users/me/reading?id=${userId || 1}`);
      if (!res.ok) throw new Error("Reading API lỗi");
      const data = await res.json();
      setReading(data);
    } catch (err) {
      console.error("fetchReading:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/me/history`);
      if (!res.ok) throw new Error("History API lỗi");
      const data = await res.json();
      setHistory(data || []);
    } catch (err) {
      console.error("fetchHistory:", err);
    }
  };

  const fetchRecommend = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/books/recommends`);
      if (!res.ok) throw new Error("Recommend API lỗi");
      const data = await res.json();
      setBooks(data || []);
    } catch (err) {
      console.error("fetchRecommend:", err);
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      try {
        const res = await fetch(`${BASE_URL}/api/books/search?keyword=${keyword}`);
        if (!res.ok) throw new Error("Search API lỗi");
        const data = await res.json();
        setBooks(data || []);
      } catch (err) {
        console.error("search:", err);
      }
    }
  };

  return (
      <main className="max-w-7xl mx-auto px-10 py-10">
        {/* Ô tìm kiếm để sử dụng setKeyword và handleSearch (hết lỗi Unused) */}
        <div className="mb-8">
          <input
              type="text"
              placeholder="Search your library..."
              className="w-full p-4 rounded-xl bg-gray-100 outline-none focus:ring-2 ring-[#e78f8f]"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
          />
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Welcome back,{" "}
            <span className="text-[#e78f8f]">
            {user?.username || "Reader"}
          </span>.
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-5 space-y-8">
            {reading ? (
                <div className="bg-white p-6 rounded-2xl shadow">
                  <img src={reading.coverUrl} alt={reading.title} className="rounded-xl mb-4 w-full object-cover" />
                  <h2 className="text-xl font-bold">{reading.title}</h2>
                  <p className="text-gray-500 mb-4">{reading.author}</p>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{reading.progress}% Completed</span>
                    <span>{reading.currentPage} / {reading.totalPages}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded mb-4">
                    <div className="bg-[#e78f8f] h-2 rounded" style={{ width: `${reading.progress}%` }} />
                  </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-2xl shadow text-gray-400 italic">Không có sách đang đọc</div>
            )}

            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-widest">Reading History</h3>
              {history.length > 0 ? (
                  history.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 mb-3">
                        <img src="https://picsum.photos/50/70" alt="History book" className="rounded" />
                        <div>
                          <p className="text-sm font-semibold">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.finishedAt}</p>
                        </div>
                      </div>
                  ))
              ) : (
                  <p className="text-sm text-gray-400">Chưa có lịch sử đọc</p>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <h2 className="text-2xl font-bold mb-6">Recommended <span className="text-[#e78f8f]">For You</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {books.map((book) => (
                  <div key={book.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow">
                    <img src={book.coverUrl || "https://picsum.photos/220/300"} alt={book.title} className="rounded-lg mb-3 w-full h-64 object-cover" />
                    <h3 className="font-bold truncate">{book.title}</h3>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </main>
  );
}