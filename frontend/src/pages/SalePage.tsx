import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { BookResponse } from "../types";

interface FlashSaleBook extends BookResponse {
    discountPercentage?: number;
    salePrice?: number;
}

export default function FlashSalePage() {
    const [books, setBooks] = useState<FlashSaleBook[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    
    // State quản lý bộ đếm ngược theo format chuẩn ban đầu
    const [countdown, setCountdown] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00"
});

const [saleEndTime, setSaleEndTime] = useState<Date | null>(null);
const [hasActiveSale, setHasActiveSale] = useState(false);
    const navigate = useNavigate();

    
    // Lấy thời gian kết thúc Flash Sale thật từ backend
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
        console.error("Lỗi lấy Flash Sale:", err);
    }
};
// Countdown theo endDate thật
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
    const fetchFlashSaleBooks = async () => {
        setLoading(true);
        try {
            const res = await api.get("/books", {
                params: { page: page, size: 10 }
            });
            const bookList: BookResponse[] = res.data.content || [];
            setTotalPages(res.data.totalPages || 1);

            const extendedBooks: FlashSaleBook[] = await Promise.all(
                bookList.map(async (book) => {
                    try {
                        const discountRes = await api.get(`/sales/check-discount/${book.id}`);
                        const discount = discountRes.data || 0;

                        if (discount > 0) {
                            return {
                                ...book,
                                discountPercentage: discount,
                                salePrice: book.price * (100 - discount) / 100
                            };
                        }
                        return book;
                    } catch {
                        return book;
                    }
                })
            );

            const saleOnly = extendedBooks.filter(b => (b.discountPercentage || 0) > 0);
            setBooks(saleOnly);
        } catch (err) {
            console.error("Lỗi tải thông tin sản phẩm Flash Sale:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    fetchFlashSaleBooks();
    checkFlashSaleStatus();
}, [page]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    return (
        <div className="bg-[#F5F5F5] min-h-screen pb-12 font-sans text-gray-800">
            {/* BACKGROUND HEADER CAM BANNER CHUẨN SHOPEE */}
            <div className="bg-gradient-to-r from-[#FF5722] to-[#EE4D2D] text-white shadow-md">
                <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-extrabold italic tracking-wider text-yellow-300 drop-shadow-md">
                            FLASH SALE
                        </h1>
                        <div className="flex items-center gap-2 text-sm font-semibold bg-black/20 px-3 py-1.5 rounded-full">
                            <span>KẾT THÚC TRONG</span>
                            <div className="flex gap-1 text-base">
                                <span className="bg-black text-white px-2 rounded font-mono">{countdown.hours}</span>:
                                <span className="bg-black text-white px-2 rounded font-mono">{countdown.minutes}</span>:
                                <span className="bg-black text-white px-2 rounded font-mono">{countdown.seconds}</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm opacity-90 hidden md:block">⚡ Hàng giờ giá sốc - Mua ngay kẻo lỡ!</p>
                </div>
            </div>

            {/* VÙNG CHỨA SẢN PHẨM GIẢM GIÁ */}
            <div className="max-w-[1200px] mx-auto px-4 mt-6">
                {loading ? (
                    <div className="text-center py-20 text-gray-500 font-medium">Đang quét tìm ưu đãi sốc...</div>
                ) : books.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => navigate(`/book-detail/${book.id}`)}
                                    className="bg-white rounded-sm border border-transparent hover:border-[#EE4D2D] hover:shadow-lg transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between"
                                >
                                    <div className="relative pt-[125%] bg-gray-100 overflow-hidden group">
                                        <img
                                            src={book.coverImage || "https://via.placeholder.com/200x250?text=No+Image"}
                                            alt={book.title}
                                            className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-0 right-0 bg-[#FFD839]/90 text-[#EE4D2D] text-xs font-bold px-2 py-1 text-center flex flex-col items-center shadow-sm">
                                            <span>{book.discountPercentage}%</span>
                                            <span className="text-[9px] text-white font-extrabold tracking-wider block mt-[-2px]">GIẢM</span>
                                        </div>
                                    </div>

                                    <div className="p-3 flex flex-col flex-1 justify-between gap-2 bg-white">
                                        <h3 className="text-sm line-clamp-2 min-h-[40px] text-gray-800 font-medium leading-5">
                                            {book.title}
                                        </h3>

                                        <div className="flex flex-col gap-1 mt-1">
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <span className="text-[#EE4D2D] font-semibold text-base">
                                                    {formatCurrency(book.salePrice || book.price)}
                                                </span>
                                                <span className="text-gray-400 line-through text-xs">
                                                    {formatCurrency(book.price)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative mt-2 bg-[#FFD5C6] h-4 rounded-full overflow-hidden text-center flex items-center justify-center">
                                            <div 
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF5722] to-[#EE4D2D]"
                                                style={{ width: `${Math.min((book.id * 7) % 100 + 20, 95)}%` }}
                                            />
                                            <span className="absolute text-[10px] font-bold text-white uppercase z-10 drop-shadow-sm">
                                                Vừa mở bán
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* PHÂN TRANG */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setPage(p => Math.max(p - 1, 0))}
                                    disabled={page === 0}
                                    className={`px-4 py-2 border rounded bg-white text-sm ${page === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#EE4D2D] hover:text-white"}`}
                                >
                                    Trước
                                </button>
                                <span className="px-4 py-2 bg-white border rounded text-sm font-medium">
                                    {page + 1} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                                    disabled={page === totalPages - 1}
                                    className={`px-4 py-2 border rounded bg-white text-sm ${page === totalPages - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#EE4D2D] hover:text-white"}`}
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded shadow-sm text-center py-20 text-gray-500">
                        <div className="text-5xl mb-3">⏰</div>
                        <p className="font-medium text-base">Hiện không có sản phẩm nào trong khung giờ Flash Sale này.</p>
                        <p className="text-xs text-gray-400 mt-1">Vui lòng quay lại vào khung giờ tiếp theo!</p>
                    </div>
                )}
            </div>
        </div>
    );
}