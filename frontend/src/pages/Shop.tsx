import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import type { BookResponse } from "../types";
import BookCard from "../components/common/BookCard";
export default function ShopPage() {
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    
    const [category, setCategory] = useState<string>("");
    const [year, setYear] = useState<number | "">("");
    const [format, setFormat] = useState<string>("");
    const [publisher, setPublisher] = useState<string>("");

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    
    useEffect(() => {
        const kw = searchParams.get("keyword") || "";
        setKeyword(kw);
        setPage(0);
    }, [searchParams]);

    
    const fetchBooks = async (overridePage?: number) => {
      try {
        const p = overridePage !== undefined ? overridePage : page;

        const res = await api.get("/books", {
          params: {
            page: p,
            size: 10,
            ...(keyword.trim() !== "" && { keyword }),
            ...(category && { category }),
            
            
            
          }
        });

        const data = res.data;

        setBooks(data.content || []);
        setTotalPages(data.totalPages || 1);

      } catch (err) {
        console.error("Lỗi load books:", err);
      }
    };

    
    useEffect(() => {
        fetchBooks();
    }, [page, category, year, format, publisher, keyword]);

    
    const handleCategoryChange = (g: string) => {
        setCategory(category === g ? "" : g);
        setPage(0);
    };

    const handleFormatChange = (f: string) => {
        setFormat(format === f ? "" : f);
        setPage(0);
    };

    const handleYearChange = (y: string) => {
        setYear(y ? Number(y) : "");
        setPage(0);
    };

    const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") setPage(0);
    };
    const clearFilters = () => {
        setCategory("");
        setYear("");
        setFormat("");
        setPublisher("");
        setPage(0);
    };

    const handleBookClick = (id: number) => {
    navigate(`/book-detail/${id}`);
};

    return (
        <div className="bg-[#F5F3EF] min-h-screen">

            

            <div className="max-w-[1400px] mx-auto flex gap-8 px-8 py-6">

                {}
                <aside className="w-64 text-sm">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-semibold text-[#2C3E50]">Filters</h3>
                        <button onClick={clearFilters} className="text-[#D4A5A5] text-xs">
                            Clear all
                        </button>
                    </div>

                    {}
                    <div className="mb-6">
                        <h4 className="text-xs text-gray-400 mb-2 tracking-wide">GENRE</h4>
                        {["Thiếu Nhi","Văn học Việt Nam","Văn học nước ngoài","Kỹ năng sống","Lịch sử - Địa lý"].map((g) => (
                            <div key={g} className="mb-2">
                                <label className="flex gap-2">
                                    <input
                                        type="checkbox"
                                        checked={category === g}
                                        onChange={() => handleCategoryChange(g)}
                                    />
                                    {g}
                                </label>
                            </div>
                        ))}
                    </div>

                    {}
                    <div className="mb-6">
                        <h4 className="text-xs text-gray-400 mb-2">FORMAT</h4>
                        <div className="flex flex-wrap gap-2">
                            {["HARDCOVER","PAPERBACK","EBOOK","AUDIOBOOK"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => handleFormatChange(f)}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        format===f
                                            ? "bg-[#2C3E50] text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="mb-6">
                        <h4 className="text-xs text-gray-400 mb-2">
                            PUBLICATION YEAR
                        </h4>
                        <select
                            value={year}
                            onChange={(e)=>handleYearChange(e.target.value)}
                            className="w-full border px-3 py-2 text-sm rounded-md bg-white"
                        >
                            <option value="">All years</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                        </select>
                    </div>

                    {}
                    <div className="mb-6">
                        <h4 className="text-xs text-gray-400 mb-2">PUBLISHER</h4>
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={handleSearchKey}
                            className="flex-1 bg-[#ECEAE6] px-4 py-2 rounded-md text-sm outline-none"
                            placeholder="Publisher..."
                        />
                    </div>
                </aside>

                {}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[#2C3E50]">
                            Marketplace
                        </h2>
                    </div>

                    {}
                    {books.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                            {books.map((b) => (
                                <div
                                    key={b.id}
                                    onClick={() => handleBookClick(b.id)}
                                    className="cursor-pointer"
                                >
                                    <BookCard {...b} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No books found.
                        </div>
                    )}

                    {}
                    <div className="flex justify-center gap-2 mt-12">
                        <button
                            onClick={()=>setPage(p=>Math.max(p-1,0))}
                            className="w-10 h-10 border rounded-md"
                        >
                            &lt;
                        </button>

                        <span className="px-4 py-2">
                            {page+1} / {totalPages}
                        </span>

                        <button
                            onClick={()=>setPage(p=>Math.min(p+1,totalPages-1))}
                            className="w-10 h-10 border rounded-md"
                        >
                            &gt;
                        </button>
                    </div>
                </main>
            </div>
        </div>
    )
}
