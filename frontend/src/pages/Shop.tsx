import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import type { BookResponse } from "../types";

const StarRating = ({ rating }: { rating: number }) => {
    const stars = Math.round(rating || 0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= stars ? "text-yellow-400" : "text-gray-300"}>
                    ★
                </span>
            ))}
            <span className="ml-1 text-xs text-gray-400">({rating.toFixed(1)})</span>
        </div>
    );
};
export default function ShopPage() {
    type FlashSaleBook = BookResponse & {
    discountPercentage?: number;
    salePrice?: number;
};


const [books, setBooks] = useState<FlashSaleBook[]>([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [hasActiveSale, setHasActiveSale] = useState(false);

const [countdown, setCountdown] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00"
});

const [saleEndTime, setSaleEndTime] = useState<Date | null>(null);
    
    const [category, setCategory] = useState<string>("");
    const [year, setYear] = useState<number | "">("");
    const [format, setFormat] = useState<string>("");
    const [publisher, setPublisher] = useState<string>("");

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const checkFlashSaleStatus = async () => {
    try {
        const res = await api.get("/sales/admin");
        const salesList = res.data.content;

        if (Array.isArray(salesList)) {
            const now = new Date().getTime();

            const activeSale = salesList.find((s: any) => {
                const start = new Date(s.startDate).getTime();
                const end = new Date(s.endDate).getTime();

                return (
                    s.status === "active" &&
                    now >= start &&
                    now <= end
                );
            });

            if (activeSale) {
                setHasActiveSale(true);
                setSaleEndTime(new Date(activeSale.endDate));
            } else {
                setHasActiveSale(false);
            }
        }
    } catch (err) {
        console.error("Lỗi Flash Sale:", err);
    }
};

    
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

        const bookList: BookResponse[] = data.content || [];



const extendedBooks: FlashSaleBook[] = await Promise.all(
    bookList.map(async (book) => {
        try {
            const discountRes = await api.get(
                `/sales/check-discount/${book.id}`
            );

            const discount = Number(discountRes.data || 0);

            if (discount > 0) {
                return {
                    ...book,
                    discountPercentage: discount,
                    salePrice: Math.round(
                        book.price * (100 - discount) / 100
                    )
                };
            }

            return {
                ...book,
                discountPercentage: 0,
                salePrice: book.price
            };

        } catch {
            return {
                ...book,
                discountPercentage: 0,
                salePrice: book.price
            };
        }
    })
);

setBooks(extendedBooks);
        setTotalPages(data.totalPages || 1);

      } catch (err) {
        console.error("Lỗi load books:", err);
      }
    };

    
    useEffect(() => {
    if (!hasActiveSale || !saleEndTime) return;

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = saleEndTime.getTime();

        const distance = end - now;

        if (distance <= 0) {
            clearInterval(timer);

            setHasActiveSale(false);

            setCountdown({
                hours: "00",
                minutes: "00",
                seconds: "00"
            });

            return;
        }

        const hrs = Math.floor(distance / (1000 * 60 * 60));

        const mins = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
        );

        const secs = Math.floor(
            (distance % (1000 * 60)) / 1000
        );

        setCountdown({
            hours: String(hrs).padStart(2, "0"),
            minutes: String(mins).padStart(2, "0"),
            seconds: String(secs).padStart(2, "0")
        });
    }, 1000);

    return () => clearInterval(timer);
}, [hasActiveSale, saleEndTime]);

useEffect(() => {
    fetchBooks();
    checkFlashSaleStatus();
}, [page, category, year, format, publisher, keyword]);
    
    const handleCategoryChange = (g: string) => {
        setCategory(category === g ? "" : g);
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

            {hasActiveSale && (
    <div
        onClick={() => navigate("/sale")}
        className="bg-gradient-to-r from-[#FF5722] to-[#EE4D2D] text-white shadow-md cursor-pointer hover:opacity-95 transition-all"
    >
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-extrabold italic tracking-wider text-yellow-300 drop-shadow-md animate-pulse">
                    ⚡ FLASH SALE
                </h1>

                <div className="flex items-center gap-2 text-sm font-semibold bg-black/20 px-3 py-1.5 rounded-full">
                    <span className="hidden md:inline">
                        KẾT THÚC TRONG
                    </span>

                    <div className="flex gap-1 text-base">
                        <span className="bg-black text-white px-2 rounded font-mono">
                            {countdown.hours}
                        </span>
                        :
                        <span className="bg-black text-white px-2 rounded font-mono">
                            {countdown.minutes}
                        </span>
                        :
                        <span className="bg-black text-white px-2 rounded font-mono">
                            {countdown.seconds}
                        </span>
                    </div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm font-medium">
                <span>
                    Xem ngay hàng ngàn đầu sách đang giảm giá sốc
                </span>

                <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-lg">
                    →
                </span>
            </div>
        </div>
    </div>
)}

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
    className="cursor-pointer group"
>
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">

        <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">

            <img
                src={
                    b.coverImage ||
                    "https://via.placeholder.com/300x450"
                }
                alt={b.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {b.discountPercentage! > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                    -{b.discountPercentage}%
                </div>
            )}
        </div>

        <div className="p-4">
            <h3 className="font-bold text-sm line-clamp-2 min-h-[40px] text-[#2C3E50]">
                {b.title}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
                {b.authorName}
            </p>
    {/* Thêm phần hiển thị đánh giá tại đây */}
    <div className="mt-1">
        <StarRating rating={b.averageRating || 0} />
    </div>

            <div className="mt-3">

                {b.discountPercentage! > 0 ? (
                    <>
                        <div className="text-xs line-through text-gray-400">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND"
                            }).format(b.price)}
                        </div>

                        <div className="text-lg font-bold text-red-500">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND"
                            }).format(b.salePrice || b.price)}
                        </div>
                    </>
                ) : (
                    <div className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND"
                        }).format(b.price)}
                    </div>
                )}
            </div>
        </div>
    </div>
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
