import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User, HistoryItem, BookResponse } from "../types";
import api from "../services/api";

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
export default function HomePageUser() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  type FlashSaleBook = BookResponse & {
  discountPercentage?: number;
  salePrice?: number;
};

const [books, setBooks] = useState<FlashSaleBook[]>([]);
  const [keyword, setKeyword] = useState("");
  
  // Quản lý trạng thái và bộ đếm ngược Flash Sale
  const [hasActiveSale, setHasActiveSale] = useState(false);
  const [countdown, setCountdown] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const navigate = useNavigate();
  const [saleEndTime, setSaleEndTime] = useState<Date | null>(null);

  useEffect(() => {
    // 1. Ưu tiên hiển thị dữ liệu User từ localStorage ngay lập tức để tránh hiện tượng nháy trang (Flicker)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Kích hoạt gọi đồng bộ các API lấy dữ liệu từ hệ thống backend
    fetchUser();
    fetchHistory();
    fetchRecommend();
    checkFlashSaleStatus();
  }, []);

  // Bộ đếm thời gian lùi (Countdown Timer) chuẩn Shopee Flash Sale - Kết thúc vào lúc 23:59:59 đêm nay
  useEffect(() => {
    if (!hasActiveSale || !saleEndTime) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = saleEndTime.getTime();
      const distance = end - now;

      if (distance <= 0) {
        clearInterval(timer);
        setHasActiveSale(false);
        return;
      }

      const hrs = Math.floor(distance / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        hours: String(hrs).padStart(2, '0'),
        minutes: String(mins).padStart(2, '0'),
        seconds: String(secs).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasActiveSale, saleEndTime]);

  // Kiểm tra nhanh xem hệ thống có đang mở đợt sale nào không dựa trên Book ID = 1
  // 1. Cập nhật hàm kiểm tra trạng thái
const checkFlashSaleStatus = async () => {
  try {
    const res = await api.get("/sales/admin");
    // Dữ liệu nằm trong res.data.content
    const salesList = res.data.content; 

    if (Array.isArray(salesList)) {
      const now = new Date().getTime();

      // Tìm đợt sale thỏa mãn điều kiện thời gian hiện tại
      const activeSale = salesList.find((s: any) => {
        const start = new Date(s.startDate).getTime();
        const end = new Date(s.endDate).getTime();
        return s.status === "active" && now >= start && now <= end;
      });

      if (activeSale) {
        setHasActiveSale(true);
        setSaleEndTime(new Date(activeSale.endDate));
      } else {
        setHasActiveSale(false);
      }
    }
  } catch (err) {
    console.error("Lỗi lấy danh sách Flash Sale:", err);
  }
};

  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const res = await api.get("/users/me", { params: { id: userId } });
      setUser(res.data);
    } catch (err) {
      console.error("fetchUser:", err);
    }
  };

  const fetchHistory = async () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token"); // Kiểm tra lại key lưu token

  if (!userId || !token) return;

  try {
    const res = await api.get(`/users/me/reading-history?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Đảm bảo gửi token
      }
    });
    setHistory(res.data || []);
  } catch (err) {
    console.error("Lỗi lấy lịch sử đọc:", err);
  }
};

  const fetchRecommend = async () => {
  try {
    const res = await api.get("/books/recommends");

    const bookList: BookResponse[] = res.data || [];

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
    <main className="max-w-7xl mx-auto px-10 py-6 font-sans text-gray-800">
      
      {/* ⚡ BANNER SHOPEE FLASH SALE Ở ĐẦU TRANG - ĐIỀU HƯỚNG CHUẨN XÁC ĐẾN ROUTE /sale */}
      {hasActiveSale && (
        <div 
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
            navigate("/sale");  // Đã cập nhật đúng Route /sale theo yêu cầu của bạn
          }}
          className="mb-8 bg-linear-to-r from-[#FF5722] to-[#EE4D2D] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-center text-white cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
        >
          <div className="flex items-center gap-4 pointer-events-none">
            {/* Sử dụng pointer-events-none để ép trình duyệt nhận diện cú click từ thẻ div cha to bên ngoài */}
            <span className="text-2xl font-black italic tracking-wide text-yellow-300 drop-shadow-md animate-pulse">
              ⚡ FLASH SALE
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-black/20 px-3 py-1.5 rounded-full">
              <span className="hidden md:inline text-white/90">KẾT THÚC TRONG</span>
              <span className="bg-black text-white px-2 py-0.5 rounded font-mono text-sm shadow">{countdown.hours}</span>:
              <span className="bg-black text-white px-2 py-0.5 rounded font-mono text-sm shadow">{countdown.minutes}</span>:
              <span className="bg-black text-white px-2 py-0.5 rounded font-mono text-sm shadow">{countdown.seconds}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3 sm:mt-0 font-medium text-sm pointer-events-none">
            <span>Vào xem danh sách sản phẩm giảm giá sốc liền tay</span>
            <span className="text-lg font-bold bg-white/20 w-8 h-8 flex items-center justify-center rounded-full shadow-inner">
              &rarr;
            </span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search your library..."
          className="w-full p-4 rounded-xl bg-gray-100 outline-none focus:ring-2 ring-[#e78f8f] transition-all"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, <span className="text-[#e78f8f]">{user?.username || "Reader"}</span>.
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Left Column: Reading & History */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          

          {/* Reading History Section */}
<div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
  <h3 className="text-xs text-gray-400 font-bold mb-4 uppercase tracking-widest">
    Reading History
  </h3>
  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
    {history.length > 0 ? (
      history.map((item: any, i: number) => (
        <div 
          key={i} 
          onClick={() => navigate(`/reading/${item.id}`)} 
          className="flex items-center gap-4 bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 hover:border-[#e78f8f] transition-all cursor-pointer hover:shadow-md"
        >
          <img 
            src={item.coverUrl || "https://via.placeholder.com/50x70"} 
            alt={item.title} 
            className="rounded w-12 h-16 object-cover bg-gray-100" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
            {/* Sử dụng optional chaining (?.) để tránh crash nếu dữ liệu null */}
            <p className="text-xs text-gray-400 mt-1">
              Tiến độ: {item.progressPercentage ? `${item.progressPercentage}%` : "0%"}
            </p>
          </div>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400 italic text-center py-4">Chưa có lịch sử đọc</p>
    )}
  </div>
</div>
        </div>

        {/* Right Column: Recommendations */}
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">
            Recommended <span className="text-[#e78f8f]">For You</span>
          </h2>
          {/* Right Column: Recommendations */}
<div className="col-span-12 lg:col-span-7">
  <div className="flex justify-between items-center mb-6">
    
    {/* Nút View All */}
    <button 
      onClick={() => navigate("/shop")}
      className="text-sm font-semibold text-[#e78f8f] hover:underline"
    >
      View All &rarr;
    </button>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    {books.length > 0 ? (
      // Dùng .slice(0, 4) để chỉ lấy 4 cuốn đầu tiên
      books.slice(0, 4).map((book) => (
        <div
          key={book.id}
          className="hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
          onClick={() => navigate(`/book-detail/${book.id}`)}
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100">
             <div className="relative aspect-2/3 overflow-hidden bg-gray-100">
                <img
                    src={book.coverImage || "https://via.placeholder.com/300x450"}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {book.discountPercentage! > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                    -{book.discountPercentage}%
                    </div>
                )}
             </div>
             <div className="p-4">
                <h3 className="font-bold text-sm line-clamp-2 min-h-10 text-gray-800">
                    {book.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{book.authorName}</p>
                <div className="mt-1">
                    <StarRating rating={book.averageRating || 0} />
                </div>
                <div className="mt-3">
                    {book.discountPercentage! > 0 ? (
                    <>
                        <div className="text-xs line-through text-gray-400">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(book.price)}
                        </div>
                        <div className="text-lg font-bold text-red-500">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(book.salePrice || book.price)}
                        </div>
                    </>
                    ) : (
                    <div className="text-lg font-bold text-[#e78f8f]">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(book.price)}
                    </div>
                    )}
                </div>
             </div>
          </div>
        </div>
      ))
    ) : (
      <p className="col-span-full text-center text-gray-400 py-16 bg-white rounded-2xl border border-dashed border-gray-200">
        Không tìm thấy sách gợi ý phù hợp.
      </p>
    )}
  </div>
</div>
        </div>
      </div>
    </main>
  );
}