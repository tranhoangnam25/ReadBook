import { useEffect, useState } from "react";
import type { User, Reading, HistoryItem, Book } from "../types";

// 🔥 BASE URL BACKEND
const BASE_URL = "http://localhost:8080";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchUser();
    fetchReading();
    fetchHistory();
    fetchRecommend();
  }, []);

  // 👤 USER
  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/me`);
      if (!res.ok) throw new Error("User API lỗi");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("fetchUser:", err);
    }
  };

  // 📖 CURRENT READING
  const fetchReading = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/users/me/reading`);
      if (!res.ok) throw new Error("Reading API lỗi");
      const data = await res.json();
      setReading(data);
    } catch (err) {
      console.error("fetchReading:", err);
    }
  };

  // 📜 HISTORY
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

  // 📚 RECOMMEND
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

  // 🔍 SEARCH
  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      try {
        const res = await fetch(
          `${BASE_URL}/api/books/search?keyword=${keyword}`
        );
        if (!res.ok) throw new Error("Search API lỗi");
        const data = await res.json();
        setBooks(data || []);
      } catch (err) {
        console.error("search:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#243447]">

      {/* HEADER */}
      <header className="flex items-center justify-between px-10 py-4 bg-white border-b">

        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold">📖 Lumina Books</h1>

          <nav className="flex gap-6 text-sm font-medium">
            <a>Feed</a>
            <a>Library</a>
            <a>Collections</a>
          </nav>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg w-[300px]">
            🔍
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-transparent outline-none ml-2 w-full text-sm"
              placeholder="Find books..."
            />
          </div>
        </div>

        {/* USER */}
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://i.pravatar.cc/100"}
            className="w-9 h-9 rounded-full"
          />
        </div>

      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-10 py-10">

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Welcome back,{" "}
            <span className="text-[#e78f8f]">
              {user?.username || "Reader"}
            </span>.
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-10">

          {/* LEFT */}
          <div className="col-span-5 space-y-8">

            {/* CURRENTLY READING */}
            {reading ? (
              <div className="bg-white p-6 rounded-2xl shadow">
                <img src={reading.coverUrl} className="rounded-xl mb-4" />
                <h2 className="text-xl font-bold">{reading.title}</h2>
                <p className="text-gray-500 mb-4">{reading.author}</p>

                <div className="flex justify-between text-sm mb-2">
                  <span>{reading.progress}% Completed</span>
                  <span>
                    {reading.currentPage} / {reading.totalPages}
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded mb-4">
                  <div
                    className="bg-[#e78f8f] h-2 rounded"
                    style={{ width: `${reading.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p>Không có sách đang đọc</p>
            )}

            {/* HISTORY */}
            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="text-xs text-gray-400 font-bold mb-4">
                READING HISTORY
              </h3>

              {history.length > 0 ? (
                history.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <img
                      src="https://picsum.photos/50/70"
                      className="rounded"
                    />
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.finishedAt}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Chưa có lịch sử đọc</p>
              )}
            </div>

          </div>

          {/* RIGHT */}
          <div className="col-span-7">

            <h2 className="text-2xl font-bold mb-6">
              Recommended <span className="text-[#e78f8f]">For You</span>
            </h2>

            <div className="grid grid-cols-2 gap-6">

              {books.length > 0 ? (
                books.map((book) => (
                  <div key={book.id} className="bg-white p-4 rounded-xl shadow">
                    <img
                      src={book.coverUrl || "https://picsum.photos/220/300"}
                      className="rounded-lg mb-3"
                    />
                    <h3 className="font-bold">{book.title}</h3>
                    <p className="text-sm text-gray-500">
                      {book.author}
                    </p>
                  </div>
                ))
              ) : (
                <p>Không có sách</p>
              )}

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
