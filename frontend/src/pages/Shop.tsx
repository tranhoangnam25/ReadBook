import React from "react";

// ===== TYPE =====
type Book = {
  title: string;
  author: string;
  price: number;
  rating: number;
  image: string;
};

// ===== DATA =====
const books: Book[] = [
  {
    title: "The Silent Echo",
    author: "Eleanor Vance",
    price: 12.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
  },
  {
    title: "Midnight in Venice",
    author: "Julian Barnes",
    price: 15.5,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    title: "Beyond the Horizon",
    author: "Sarah Jenkins",
    price: 10.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    title: "The Last Alchemist",
    author: "Marcus Thorne",
    price: 14.0,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
];

// ===== BOOK CARD =====
function BookCard({ book }: { book: Book }) {
  return (
    <div className="group cursor-pointer">
      <div className="rounded-xl overflow-hidden bg-[#EAE7E2] h-[260px] flex items-center justify-center">
        <img
          src={book.image}
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
          <span className="text-xs text-[#D4A5A5]">★ {book.rating}</span>
          <span className="text-sm font-semibold text-[#2C3E50]">
            ${book.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function ShopPage() {
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

        <div className="flex items-center gap-3 w-[520px]">
          <input
            className="flex-1 bg-[#ECEAE6] px-4 py-2 rounded-md text-sm outline-none"
            placeholder="Search titles, authors, ISBN..."
          />
          <button className="border px-3 py-1.5 text-sm rounded-md">
            Advanced Search
          </button>
          <button className="text-sm">Login</button>
          <button className="bg-[#2C3E50] text-white px-4 py-1.5 rounded-md text-sm">
            Sign Up
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex gap-8 px-8 py-6">

        <aside className="w-64 text-sm">

  {/* FILTER HEADER */}
  <div className="flex justify-between mb-4">
    <h3 className="font-semibold text-[#2C3E50]">Filters</h3>
    <button className="text-[#D4A5A5] text-xs">Clear all</button>
  </div>

  {/* GENRE */}
  <div className="mb-6">
    <h4 className="text-xs text-gray-400 mb-2 tracking-wide">GENRE</h4>

    {[
      ["Fiction", 1240],
      ["Non-Fiction", 850],
      ["Mystery & Thriller", 430],
      ["Sci-Fi & Fantasy", 210],
    ].map(([g, c], i) => (
      <div key={i} className="flex justify-between mb-2">
        <label className="flex gap-2">
          <input
            type="checkbox"
            defaultChecked={i === 0}
            className="accent-[#D4A5A5]"
          />
          {g}
        </label>
        <span className="text-gray-400 text-xs">{c}</span>
      </div>
    ))}
  </div>

  {/* PRICE RANGE */}
  <div className="mb-6">
    <h4 className="text-xs text-gray-400 mb-2">PRICE RANGE</h4>

    <input type="range" className="w-full accent-[#D4A5A5]" />

    <div className="flex gap-2 mt-2">
      <input className="w-1/2 border px-2 py-1 text-xs" value="$ 0" readOnly />
      <input className="w-1/2 border px-2 py-1 text-xs" value="$ 50" readOnly />
    </div>
  </div>

  {/* ⭐ AVERAGE RATING */}
  <div className="mb-6">
    <h4 className="text-xs text-gray-400 mb-2">AVERAGE RATING</h4>

    <label className="flex items-center gap-2 text-sm">
      <input type="radio" name="rating" />
      <span className="text-[#D4A5A5]">★★★★★</span>
      <span className="text-gray-400 text-xs">& Up</span>
    </label>
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

        {/* MAIN */}
        <main className="flex-1">

          {/* TITLE */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#2C3E50]">
                Marketplace
              </h2>
              <p className="text-xs text-gray-400">
                Showing 1,240 titles in Fiction
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="border px-2 py-1 text-sm rounded-md">
                <option>Most Popular</option>
              </select>

              <div className="flex gap-1">
                <button className="border p-2 rounded-md">▦</button>
                <button className="border p-2 rounded-md">≡</button>
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {books.map((b, i) => (
              <BookCard key={i} book={b} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 mt-12">
            <button className="w-10 h-10 border rounded-md">&lt;</button>
            <button className="w-10 h-10 bg-[#2C3E50] text-white rounded-md">
              1
            </button>
            <button className="w-10 h-10 border rounded-md">2</button>
            <button className="w-10 h-10 border rounded-md">3</button>
            <span className="px-2">...</span>
            <button className="w-10 h-10 border rounded-md">12</button>
            <button className="w-10 h-10 border rounded-md">&gt;</button>
          </div>

        </main>
      </div>

    </div>
  );
}
