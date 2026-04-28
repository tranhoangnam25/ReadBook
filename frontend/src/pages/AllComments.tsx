import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookService } from '../services/bookService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from "../services/api";

function Stars({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let icon = "star";
    let fill = 0;
    if (rating >= i) {
      icon = "star";
      fill = 1;
    } else if (rating >= i - 0.5) {
      icon = "star_half";
      fill = 1;
    }
    stars.push(
      <span
        key={i}
        className="material-symbols-outlined text-sm"
        style={{ fontVariationSettings: `'FILL' ${fill}` }}
      >
        {icon}
      </span>
    );
  }
  return <div className="flex text-accent">{stars}</div>;
}

export default function AllCommentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const size = 4;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Query thông tin sách
  const { data: book, isLoading: isBookLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookService.getBookById(Number(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  // Query danh sách review
  const { data: reviewPage, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["reviews", "all", id, page],
    queryFn: async () => {
      const res = await api.get(`/reviews/book/${id}`, {
        params: {
          page,
          size
        }
      });
      return res.data;
    },
    enabled: !!id,
  });

  // PHÒNG VỆ: Trích xuất dữ liệu an toàn để tránh lỗi .map()
  // Nếu Backend dùng cấu hình via-dto, đôi khi dữ liệu nằm trong reviewPage.page.content
  const reviews = reviewPage?.content || [];
  const totalPages = reviewPage?.totalPages || 0;
  const totalElements = reviewPage?.totalElements || 0; // Đã thêm khai báo biến này

  if (isBookLoading || isReviewsLoading || !book) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-[#F4F1EA]">
        <div className="font-black text-primary/20 animate-pulse tracking-widest uppercase">
          Loading Wisdom...
        </div>
      </main>
    );
  }

  // Chỉ thay đổi phần JSX bên trong return để đồng bộ font
  return (
    <main className="flex justify-center py-8 bg-[#F4F1EA] min-h-screen font-sans"> {/* Đảm bảo font-sans là chủ đạo */}
      <div className="max-w-[1100px] w-full px-6">

        <button
          onClick={() => navigate(`/book-detail/${id}`)}
          // Font cực nhỏ, đậm và dãn cách rộng giống hệt nút Detail
          className="flex items-center gap-2 text-primary/40 hover:text-primary mb-12 transition-all font-black uppercase tracking-[0.3em] text-[10px]"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Wisdom
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* CỘT TRÁI */}
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="w-full aspect-[2/3] rounded-2xl shadow-2xl overflow-hidden bg-white border-8 border-white">
              <img
                src={book.coverImage}
                className="w-full h-full object-cover"
                alt={book.title}
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x600?text=No+Cover')}
              />
            </div>

            <div className="bg-white/50 p-6 rounded-3xl border border-white shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/30 font-black mb-2">Investment</p>
              <p className="text-5xl font-black text-primary tracking-tighter">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}</p>
            </div>

            <div className="bg-primary p-6 rounded-3xl shadow-xl shadow-primary/20">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Total Reviews</span>
                    <span className="text-2xl font-black text-white">{totalElements}</span>
                </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="md:col-span-8">
            {/* Tiêu đề lớn, sát chữ (tracking-tighter) */}
            <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter leading-[0.9] mb-4">
              {book.title}
            </h1>
            <p className="text-2xl text-primary/40 font-medium italic tracking-tight mb-12 border-l-4 border-accent pl-6">
              by {book.authorName}
            </p>

            <div className="pt-2">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <p className="text-[11px] font-black uppercase text-accent tracking-[0.3em] mb-1">Reader Feedback</p>
                  <h3 className="text-3xl font-black text-primary tracking-tight">The Community Voice</h3>
                </div>
                <div className="text-[10px] font-black uppercase text-primary/40 tracking-widest bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white shadow-sm">
                    {page + 1} <span className="mx-1 text-primary/10">/</span> {totalPages || 1}
                </div>
              </div>

              {/* LIST REVIEWS */}
              <div className="space-y-10 min-h-[500px]">
                {Array.isArray(reviews) && reviews.length > 0 ? (
                  reviews.map((r: any) => (
                    <article key={r.id} className="relative group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-primary/5 group-hover:rotate-3 transition-transform">
                            <span className="material-symbols-outlined text-primary/20 text-3xl">person</span>
                          </div>
                          <div>
                            <p className="font-black text-primary uppercase text-[11px] tracking-[0.15em] mb-1">
                                {r.user?.fullName || r.user?.username || "Guest Reader"}
                            </p>
                            <Stars rating={Number(r.rating)} />
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-primary/20 uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      {/* Nội dung Review: Italic và Leading thoáng */}
                      <p className="text-2xl italic text-primary/70 leading-relaxed font-medium tracking-tight pl-2 border-l-2 border-primary/5">
                        "{r.comment}"
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="text-center py-32 bg-white/30 rounded-[3rem] border-2 border-dashed border-white">
                    <p className="text-primary/20 font-black uppercase tracking-[0.3em] text-[11px]">Silence is the loudest message.</p>
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-6">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="p-4 rounded-2xl bg-white shadow-lg shadow-primary/5 disabled:opacity-20 hover:bg-primary hover:text-white transition-all group border border-white"
                  >
                    <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                  </button>

                  <div className="flex gap-3">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-12 h-12 rounded-2xl font-black text-[11px] transition-all duration-500 ${
                          page === i
                            ? "bg-primary text-white shadow-2xl shadow-primary/40 scale-110"
                            : "bg-white text-primary/40 hover:bg-primary/5 border border-white shadow-sm"
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="p-4 rounded-2xl bg-white shadow-lg shadow-primary/5 disabled:opacity-20 hover:bg-primary hover:text-white transition-all group border border-white"
                  >
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}