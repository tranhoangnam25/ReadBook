import React, { useEffect, useState } from "react";
import type { User, Reading, HistoryItem, BookResponse } from "../types";
import api from "../services/api";
import BookCard from "../components/common/BookCard";

export default function HomePageUser() {
  const [user, setUser] = useState<User | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // Ưu tiên lấy user từ localStorage để hiển thị ngay lập tức (tránh giật trang)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchUser();
    fetchReading();
    fetchHistory();
    fetchRecommend();
  }, []);

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const res = await api.get("/users/me", { params: { id: userId } });
      setUser(res.data);
      console.log("userId =", userId);
    } catch (err) {
      console.error("fetchUser:", err);
    }
  };

  const fetchReading = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await api.get("/users/me/reading", { params: { id: userId } });
      setReading(res.data);
      console.log("userId =", userId);
    } catch (err) {
      console.error("fetchReading:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await api.get("/users/me/history", { params: { userId } });
      setHistory(res.data || []);
      console.log("userId =", userId);
    } catch (err) {
      console.error("fetchHistory:", err);
    }
  };

  const fetchRecommend = async () => {
    try {
      const res = await api.get("/books/recommends");
      setBooks(res.data || []);
    } catch (err) {
      console.error("fetchRecommend:", err);
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      try {
        const res = await api.get("/books/search", { params: { keyword } });
        setBooks(res.data || []);
      } catch (err) {
        console.error("search:", err);
      }
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-10 py-10">
      {/* Search Bar */}
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

      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Welcome back, <span className="text-[#e78f8f]">{user?.username || "Reader"}</span>.
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Left Column: Reading & History */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          {/* Current Reading */}
          {reading ? (
            <div className="bg-white p-6 rounded-2xl shadow">
              <img 
                // Lấy ảnh từ DB (coverImage hoặc coverUrl)
                src={reading.coverImage || reading.coverUrl || "https://via.placeholder.com/200x300"} 
                alt={reading.title} 
                className="rounded-xl mb-4 w-full h-80 object-cover" 
              />
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
            <div className="bg-white p-10 rounded-2xl shadow text-gray-400 italic text-center">
              Bạn chưa có cuốn sách nào đang đọc
            </div>
          )}

          {/* Reading History */}
          <div className="bg-gray-100 p-6 rounded-2xl">
            <h3 className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-widest">Reading History</h3>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img 
                      src={item.coverImage || "https://via.placeholder.com/50x70"} 
                      alt="History book" 
                      className="rounded w-12 h-16 object-cover" 
                    />
                    <div>
                      <p className="text-sm font-semibold line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.finishedAt}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Chưa có lịch sử đọc</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-2xl font-bold mb-6">
            Recommended <span className="text-[#e78f8f]">For You</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {books.length > 0 ? (
              books.map((book) => (
                <BookCard key={book.id || book.id} {...book} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 py-10">
                Không tìm thấy sách phù hợp
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
