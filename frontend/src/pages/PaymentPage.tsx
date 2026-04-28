import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  coverUrl?: string;
};

export default function PaymentPage() {
  const { orderId, bookId } = useParams();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD BOOK
  useEffect(() => {
    if (!bookId) return;

    api.get(`/books/${bookId}`)
      .then(res => setBook(res.data))
      .catch(console.error);

  }, [bookId]);

  // 🔥 HANDLE PAYOS
  const handlePay = async () => {
    if (!orderId) return;

    try {
      setLoading(true);

      const res = await api.post(`/payments/create-payos`, null, {
        params: { orderId }
      });

      const data = res.data;

      console.log("PAYOS:", data);

      // redirect
      window.location.href = data.checkoutUrl;

    } catch (err) {
      console.error("Lỗi thanh toán:", err);
      alert("Không thể tạo thanh toán!");
    } finally {
      setLoading(false);
    }
  };

  if (!book) {
    return (
      <div className="h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dfe6ee] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-[#f6f1ea] rounded-xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">📚 LUMINA BOOKS</h2>
          <span className="cursor-pointer text-xl">×</span>
        </div>

        {/* ORDER */}
        <p className="text-xs text-gray-500 mb-2">ORDER SUMMARY</p>

        <div className="bg-white rounded-lg p-3 flex gap-3 items-center mb-4">
          <img
            src={book.coverUrl || "https://picsum.photos/100/150"}
            className="w-14 h-20 object-cover rounded"
          />

          <div>
            <p className="font-bold text-sm">{book.title}</p>
            <p className="text-xs text-gray-500">{book.author}</p>
            <p className="font-bold mt-1">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
            </p>
          </div>

          <span className="ml-auto text-xs bg-orange-100 text-orange-500 px-2 py-1 rounded">
            PENDING
          </span>
        </div>

        {/* PAYMENT INFO */}
        <div className="bg-white p-3 rounded mb-4 text-sm">
          <p className="mb-2">Thanh toán qua PayOS</p>
          <p className="text-gray-500 text-xs">
            Bạn sẽ được chuyển đến trang thanh toán an toàn để hoàn tất giao dịch.
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-[#2f3e4d] text-white py-3 rounded-lg font-bold"
        >
          {loading ? "Đang chuyển..." : "Thanh toán ngay"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-3">
          Cancel and Return to Shop
        </p>
      </div>
    </div>
  );
}