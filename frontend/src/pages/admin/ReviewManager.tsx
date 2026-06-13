import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, MessageSquare, Eye, EyeOff, ChevronLeft, ChevronRight, Star, X, CheckCircle 
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar'; 
import api from '../../services/api';

// --- Interface hứng dữ liệu chuẩn từ Spring Boot ---
interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface ReviewAdminResponse {
  id: number;
  bookTitle: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  replyAdmin: string | null; // ✅ Đã sửa từ reply thành adminReply khớp với DB
  status: 'VISIBLE' | 'HIDDEN' | string; // ✅ Khớp chính xác với Enum StatusReview ở Backend
  date: string;
}

interface ReviewStatsResponse {
  totalReviews: number;
  averageRating: number;
  hiddenReviews: number;
}

export default function ReviewManagement(): React.JSX.Element {
  // --- States quản lý dữ liệu API ---
  const [reviews, setReviews] = useState<ReviewAdminResponse[]>([]);
  const [stats, setStats] = useState<ReviewStatsResponse>({ totalReviews: 0, averageRating: 0, hiddenReviews: 0 });
  const [selectedReview, setSelectedReview] = useState<ReviewAdminResponse | null>(null);

  // --- Trạng thái UI/UX và Modal ---
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'reply' | 'detail' | null>(null); 
  const [replyText, setReplyText] = useState<string>('');

  // --- Trạng thái Tìm kiếm, Bộ lọc & Phân trang ---
  const [keyword, setKeyword] = useState<string>('');
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // "" (Tất cả), "VISIBLE", "HIDDEN"
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  // 1. Lấy danh sách đánh giá có Phân trang + Keyword + Status
  const fetchReviews = useCallback(async (searchKey: string, status: string, page: number) => {
    setLoading(true);
    try {
      const response = await api.get<SpringPage<ReviewAdminResponse>>(
        `/reviews/admin?keyword=${encodeURIComponent(searchKey)}&status=${status}&page=${page}&size=${pageSize}`
      );
      const data = response.data;
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // 2. Lấy số liệu thống kê Widgets chân trang
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get<ReviewStatsResponse>(`/reviews/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thống kê:", error);
    }
  }, []);

  // 3. Xử lý Ẩn đánh giá (Sử dụng API /{id}/hide)
  const handleHideReview = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn ẩn đánh giá này khỏi giao diện người dùng?")) return;
    try {
      const response = await api.put(`/reviews/${id}/hide`);
      if (response.status === 200) {
        alert("Ẩn đánh giá thành công!");
        refreshData();
      }
    } catch (error) {
      console.error("Lỗi khi ẩn review:", error);
    }
  };

  // 4. Xử lý Hiện đánh giá (Sử dụng API /{id}/show)
  const handleShowReview = async (id: number) => {
    try {
      const response = await api.put(`/reviews/${id}/show`);
      if (response.status === 200) {
        alert("Hiển thị đánh giá thành công!");
        refreshData();
      }
    } catch (error) {
      console.error("Lỗi khi hiện review:", error);
    }
  };

  // 5. Gửi phản hồi của Admin lên Backend (Sử dụng API /{id}/reply)
  const handleSendReply = async () => {
    if (!selectedReview || !replyText.trim()) return;
    try {
      const response = await api.post(`/reviews/${selectedReview.id}/reply`, {
        reply: replyText 
      });
      if (response.status === 200) {
        alert("Gửi phản hồi thành công!");
        setModalType(null);
        setReplyText('');
        refreshData(); // Làm mới dữ liệu để hiển thị phản hồi vừa cập nhật
      }
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
    }
  };

  // Hàm tiện ích làm mới nhanh dữ liệu
  const refreshData = () => {
    fetchReviews(debouncedKeyword, statusFilter, currentPage);
    fetchStats();
  };

  // --- Áp dụng Debounce 300ms cho ô tìm kiếm ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // --- Tự động gọi lại API khi thay đổi bộ lọc hoặc trang ---
  useEffect(() => {
    fetchReviews(debouncedKeyword, statusFilter, currentPage);
    fetchStats();
  }, [debouncedKeyword, statusFilter, currentPage, fetchReviews, fetchStats]);

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-900 antialiased font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Nội dung Workspace chính */}
        <main className="flex-1 p-8 flex flex-col gap-6">
          
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Quản lý Đánh giá & Phản hồi</h1>
            <p className="text-sm text-slate-400 mt-0.5">Kiểm duyệt các bình luận, chấm điểm của độc giả và tương tác phản hồi trực tiếp.</p>
          </div>

          {/* Thanh Bộ Lọc & Tìm kiếm */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-slate-200 text-slate-800 placeholder-slate-400" 
                placeholder="Tìm từ khóa, độc giả, tên sách..." 
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-slate-400 uppercase">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
                className="bg-slate-50 text-slate-700 text-sm py-2 px-3 border-none rounded-xl focus:ring-2 focus:ring-slate-200 cursor-pointer font-medium"
              >
                <option value="">Tất cả đánh giá</option>
                <option value="VISIBLE">Đang Hiển thị</option> {/* ✅ Gửi đúng Enum VISIBLE lên Backend */}
                <option value="HIDDEN">Đang Ẩn</option>        {/* ✅ Gửi đúng Enum HIDDEN lên Backend */}
              </select>
            </div>
          </div>

          {/* Bảng Dữ liệu Đánh giá */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 w-12 text-center">ID</th>
                    <th className="px-6 py-4">Độc giả</th>
                    <th className="px-6 py-4">Sách Ebook</th>
                    <th className="px-6 py-4 text-center">Điểm số</th>
                    <th className="px-6 py-4 max-w-xs">Nội dung bình luận</th>
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-sm text-slate-400">Đang đồng bộ dữ liệu đánh giá...</td>
                    </tr>
                  ) : reviews.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-sm text-slate-400">Không tìm thấy đánh giá nào.</td>
                    </tr>
                  ) : (
                    reviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-center text-xs font-bold text-slate-400">#{rev.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-slate-800">{rev.customerName || 'Ẩn danh'}</span>
                            <span className="text-xs text-slate-400">{rev.customerEmail || '---'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-[#1121d4] truncate max-w-[150px]" title={rev.bookTitle}>
                          {rev.bookTitle}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-0.5 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg w-fit mx-auto font-bold text-xs">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {rev.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={rev.comment}>
                          {rev.comment}
                        </td>
                        <td className="px-6 py-4 text-center">
  {/* 🌟 Chuẩn hóa chuỗi trạng thái về chữ thường để tránh lỗi lệch kiểu chữ viết hoa/thường */}
  {rev.status && (rev.status.toLowerCase() === 'hidden' || rev.status.toLowerCase() === 'invisible') ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
      Đang ẩn
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      Hiển thị
    </span>
  )}
</td>
                        <td className="px-6 py-4 text-center">
  <div className="flex justify-center items-center gap-2">
    {/* Nút Xem chi tiết */}
    <button 
      onClick={() => { setSelectedReview(rev); setModalType('detail'); }}
      className="text-slate-400 hover:text-[#1121d4] p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
      title="Xem chi tiết & phản hồi"
    >
      <Eye className="w-4 h-4" />
    </button>

    {/* Nút Phản hồi nhanh */}
    <button 
      onClick={() => { setSelectedReview(rev); setReplyText(rev.replyAdmin || ''); setModalType('reply'); }}
      className={`p-1.5 rounded-lg transition-colors ${rev.replyAdmin ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
      title={rev.replyAdmin ? "Sửa phản hồi đã gửi" : "Phản hồi đánh giá"}
    >
      <MessageSquare className="w-4 h-4" />
    </button>

    {/* Nút Ẩn/Hiện kiểm duyệt */}
    {/* 🌟 Đổi từ 'HIDDEN' thành 'hidden' tại đây */}
    {rev.status === 'hidden' ? (
      <button 
        onClick={() => handleShowReview(rev.id)}
        className="text-emerald-500 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
        title="Hiển thị lại bình luận"
      >
        <CheckCircle className="w-4 h-4" />
      </button>
    ) : (
      <button 
        onClick={() => handleHideReview(rev.id)}
        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
        title="Ẩn bình luận vi phạm"
      >
        <EyeOff className="w-4 h-4" />
      </button>
    )}
  </div>
</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang hệ thống */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-50 bg-white">
              <span className="text-xs font-medium text-slate-400">
                Hiển thị {reviews.length === 0 ? 0 : (currentPage * pageSize) + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} trên {totalElements} đánh giá
              </span>
              <div className="flex gap-1 items-center">
                <button 
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 text-slate-400 ${currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${currentPage === i ? 'bg-[#1121d4] text-white' : 'border border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 text-slate-400 ${currentPage >= totalPages - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Widgets Thống kê chân trang */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số lượt đánh giá</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalReviews} bình luận</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Điểm số trung bình</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
        {/* 🌟 TỰ TÍNH TOÁN: Cộng tổng cột rating rồi chia trung bình */}
        {reviews.length > 0 
          ? (reviews.reduce((sum, rev) => sum + (rev.rating || 0), 0) / reviews.length).toFixed(1)
          : '0.0'
        } / 5.0
      </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                <EyeOff className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đánh giá đang ẩn kiểm duyệt</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
        {stats.hiddenReviews ?? reviews.filter(rev => rev.status === 'hidden').length} vi phạm
      </p>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* --- POPUP 1: ĐIỀN / SỬA PHẢN HỒI --- */}
      {modalType === 'reply' && selectedReview && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Phản hồi độc giả #{selectedReview.id}</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
              <p className="font-semibold text-slate-700">Độc giả: <span className="font-normal text-slate-500">{selectedReview.customerName}</span></p>
              <p className="text-slate-600 mt-1 italic">" {selectedReview.comment} "</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Nội dung phản hồi của Admin</label>
              <textarea
                rows={4}
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-200 text-slate-800 placeholder-slate-400"
                placeholder="Nhập lời giải đáp hoặc phản hồi đến khách hàng..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <button 
                onClick={() => setModalType(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-[#1121d4] hover:bg-blue-800 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-40"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- POPUP 2: XEM CHI TIẾT ĐÁNH GIÁ VÀ TRẠNG THÁI PHẢN HỒI (MẮT THẦN) --- */}
      {modalType === 'detail' && selectedReview && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Chi tiết đánh giá toàn diện</h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Tên sách:</span>
                <span className="text-[#1121d4] font-bold">{selectedReview.bookTitle}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Người đánh giá:</span>
                <span className="text-slate-800 font-semibold">{selectedReview.customerName} ({selectedReview.customerEmail})</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Số sao chấm:</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  {selectedReview.rating} <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </span>
              </div>
              <div className="flex flex-col gap-1 border-b border-dashed border-slate-100 py-1.5">
                <span className="text-slate-400 font-medium">Ý kiến độc giả:</span>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100/70 font-medium italic">
                  "{selectedReview.comment}"
                </p>
              </div>

              {/* Phần thông tin phản hồi của Admin */}
              <div className="flex flex-col gap-1 py-1.5">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  Phản hồi từ Hệ thống:
                  {/* ✅ Sửa kiểm tra điều kiện hiển thị theo biến replyAdmin */}
                  {selectedReview.replyAdmin ? ( 
                    <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded">
                      <CheckCircle className="w-2.5 h-2.5" /> Đã trả lời
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-1.5 py-0.5 rounded">Chờ phản hồi</span>
                  )}
                </span>
                {/* ✅ Hiển thị chính xác giá trị replyAdmin từ DB */}
                {selectedReview.replyAdmin ? (
                  <p className="text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 font-medium">
                    {selectedReview.replyAdmin}
                  </p>
                ) : (
                  <p className="text-slate-400 text-xs italic bg-slate-50/50 p-3 rounded-xl border border-dashed border-slate-200">
                    Chưa có văn bản trả lời cho bình luận này. Bạn có thể sử dụng biểu tượng tin nhắn ở hàng danh sách để gửi phản hồi nhanh.
                  </p>
                )}
              </div>
            </div>

            <button 
              onClick={() => setModalType(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-sm transition-colors mt-2"
            >
              Đóng cửa sổ xem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}