import React, { useEffect, useState } from "react";

// ===== TYPE =====
//Sửa thành cái bookResponse trong types/index.ts
type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  rating: number;
  image: string;
};
//import BookCard.tsx
// ===== BOOK CARD =====
function BookCard({ book }: { book: Book }) {
  return (
    <div className="group cursor-pointer">
      <div className="rounded-xl overflow-hidden bg-[#EAE7E2] h-[260px] flex items-center justify-center">
        <img
          src={book.image || "https://picsum.photos/200/300"}
          alt={book.title}
          className="h-full w-full object-cover group-hover:scale-105 transition"
        />
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-semibold text-[#2C3E50]">
          {book.title}
        </h4>
        <p className="text-xs text-gray-400">{book.author}</p>

        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-[#D4A5A5]">
            ★ {book.rating || 0}
          </span>
          <span className="text-sm font-semibold text-[#2C3E50]">
            ${book.price || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function ShopPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

  // 🚀 LOAD DATA
  useEffect(() => {
    fetchBooks();
  }, [page]);
  // Gọi trong file bookService rồi gọi hàm
  // ===== CALL API =====
  const fetchBooks = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/books?keyword=${keyword}&page=${page}&size=10`
      );
      const data = await res.json();

      // vì backend trả Page → lấy content
      setBooks(data.content || []);
    } catch (err) {
      console.error("Lỗi load books:", err);
    }
  };

  // ===== SEARCH =====
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setPage(0);
      fetchBooks();
    }
  };

  return (
    <div className="bg-[#F5F3EF] min-h-screen">

      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 border-b bg-[#F5F3EF]">
        <div className="flex items-center gap-8">
          <h1 className="font-bold text-[#2C3E50]">📖 Lumina Books</h1>

          <nav className="flex gap-6 text-sm text-gray-600">
            <a>Explore</a>
            <a>My Library</a>
            <a className="text-[#D4A5A5] border-b-2 border-[#D4A5A5] pb-1">
              Shop
            </a>
          </nav>
        </div>

        {/* 🔍 SEARCH */}
        <div className="flex items-center gap-3 w-[520px]">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearch}
            className="flex-1 bg-[#ECEAE6] px-4 py-2 rounded-md text-sm outline-none"
            placeholder="Search title OR author..."
          />
          <button
            onClick={fetchBooks}
            className="border px-3 py-1.5 text-sm rounded-md"
          >
            Search
          </button>
          <button className="text-sm">Login</button>
          <button className="bg-[#2C3E50] text-white px-4 py-1.5 rounded-md text-sm">
            Sign Up
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex gap-8 px-8 py-6">

        {/* ===== SIDEBAR (GIỮ NGUYÊN) ===== */}
        <aside className="w-64 text-sm">

          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-[#2C3E50]">Filters</h3>
            <button className="text-[#D4A5A5] text-xs">Clear all</button>
          </div>

          <div className="mb-6">
            <h4 className="text-xs text-gray-400 mb-2 tracking-wide">GENRE</h4>
            {["Fiction", "Non-Fiction", "Mystery", "Sci-Fi"].map((g, i) => (
              <div key={i} className="mb-2">
                <label className="flex gap-2">
                  <input type="checkbox" className="accent-[#D4A5A5]" />
                  {g}
                </label>
              </div>
            ))}
          </div>
          {/* FORMAT */}
          <div className="mb-6">
            <h4 className="text-xs text-gray-400 mb-2">FORMAT</h4>

            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 rounded-full bg-gray-200 text-xs">
                Hardcover
              </button>
              <button className="px-3 py-1 rounded-full bg-[#2C3E50] text-white text-xs">
                Paperback
              </button>
              <button className="px-3 py-1 rounded-full bg-gray-200 text-xs">
                E-book
              </button>
              <button className="px-3 py-1 rounded-full bg-gray-200 text-xs">
                Audiobook
              </button>
            </div>
          </div>

          {/* 📅 PUBLICATION YEAR */}
          <div className="mb-6">
            <h4 className="text-xs text-gray-400 mb-2">PUBLICATION YEAR</h4>

            <select className="w-full border px-3 py-2 text-sm rounded-md bg-white">
              <option>All years</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>

          {/* 🏢 PUBLISHER */}
          <div className="mb-6">
            <h4 className="text-xs text-gray-400 mb-2">PUBLISHER</h4>

            <input
              placeholder="Search publishers..."
              className="w-full border px-3 py-2 text-sm mb-3 rounded-md"
            />

            {[
              "Penguin Random House",
              "HarperCollins",
              "Simon & Schuster",
              "Hachette Book Group",
            ].map((p, i) => (
              <label key={i} className="flex items-center gap-2 mb-2 text-sm">
                <input type="checkbox" />
                {p}
              </label>
            ))}
          </div>

        </aside>

        {/* ===== MAIN ===== */}
        <main className="flex-1">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#2C3E50]">
              Marketplace
            </h2>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {books.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              className="w-10 h-10 border rounded-md"
            >
              &lt;
            </button>

            <span className="px-4 py-2">{page + 1}</span>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-10 h-10 border rounded-md"
            >
              &gt;
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}