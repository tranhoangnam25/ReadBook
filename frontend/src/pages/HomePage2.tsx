import { useEffect, useState } from "react";
import type { User, Reading, HistoryItem, Book } from "../types";
export default function HomePage2() {
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

  const fetchUser = async () => {
    const res = await fetch("/api/users/me");
    const data = await res.json();
    setUser(data);
  };

  const fetchReading = async () => {
    const res = await fetch("/api/users/me/reading");
    const data = await res.json();
    setReading(data);
  };

  const fetchHistory = async () => {
    const res = await fetch("/api/users/me/history");
    const data = await res.json();
    setHistory(data);
  };

  const fetchRecommend = async () => {
    const res = await fetch("/api/books/recommends");
    const data = await res.json();
    setBooks(data);
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const res = await fetch(`/api/books/search?keyword=${keyword}`);
      const data = await res.json();
      setBooks(data);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#243447]">

      {}
      <header className="flex items-center justify-between px-10 py-4 bg-white border-b">

        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold">📖 Lumina Books</h1>

          <nav className="flex gap-6 text-sm font-medium">
            <a>Feed</a>
            <a>Library</a>
            <a>Collections</a>
          </nav>
        </div>

        {}
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

        {}
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100"
            className="w-9 h-9 rounded-full"
          />
        </div>

      </header>

      {}
      <main className="max-w-7xl mx-auto px-10 py-10">

        {}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Welcome back,{" "}
            <span className="text-[#e78f8f]">
              {user?.username || "Reader"}
            </span>.
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-10">

          {}
          <div className="col-span-5 space-y-8">

            {}
            {reading && (
              <div className="bg-white p-6 rounded-2xl shadow">

                <div className="flex justify-between text-xs text-gray-400 font-bold mb-4">
                  <span>CURRENTLY READING</span>
                </div>

                <img
                  src={reading.coverUrl}
                  className="rounded-xl mb-4"
                />

                <h2 className="text-xl font-bold">
                  {reading.title}
                </h2>

                <p className="text-gray-500 mb-4">
                  {reading.author}
                </p>

                <div className="flex justify-between text-sm mb-2">
                  <span>{reading.progress}% Completed</span>
                  <span className="text-[#e78f8f]">
                    {reading.currentPage} / {reading.totalPages}
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded mb-4">
                  <div
                    className="bg-[#e78f8f] h-2 rounded"
                    style={{ width: `${reading.progress}%` }}
                  ></div>
                </div>

              </div>
            )}

            {}
            <div className="bg-gray-100 p-6 rounded-2xl">
              <h3 className="text-xs text-gray-400 font-bold mb-4">
                READING HISTORY
              </h3>

              {history.map((item, i) => (
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
              ))}
            </div>

          </div>

          {}
          <div className="col-span-7">

            <h2 className="text-2xl font-bold mb-6">
              Recommended <span className="text-[#e78f8f]">For You</span>
            </h2>

            <div className="grid grid-cols-2 gap-6">

              {books.map((book) => (
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
              ))}

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
