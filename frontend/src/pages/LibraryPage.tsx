import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Inbox, Heart, History, Rocket, Lightbulb,
  PlusCircle, LayoutGrid, PlayCircle, CheckCircle,
  Clock, Plus
} from 'lucide-react';

// 1. Interface khớp hoàn toàn với LibraryResponse từ Backend
interface LibraryResponse {
  progressId: number;
  bookId: number;
  title: string;
  authorName: string;
  coverImage: string;
  status: 'reading' | 'completed' | 'to_read';
  progress: number;
  lastLocation: string;
}

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();

  // Lấy thông tin user từ LocalStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 2. Gọi API lấy danh sách sách trong thư viện
  const { data: libraryBooks, isLoading } = useQuery<LibraryResponse[]>({
    queryKey: ["my-library", user?.id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/api/library/${user.id}`);
      if (!response.ok) throw new Error("Không thể tải thư viện");
      return response.json();
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F1EA]">
        <div className="font-black text-primary/20 animate-pulse tracking-[0.3em] uppercase">
          Curating your wisdom...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 items-start gap-12 px-6 py-12 lg:px-20 min-h-screen bg-[#F4F1EA]">

      {/* SIDEBAR - Giống hệt bản HTML thiết kế */}
      <aside className="sticky top-32 hidden w-64 flex-col gap-10 lg:flex">
        <div>
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-primary/30">My Shelves</h3>
          <nav className="flex flex-col gap-2">
            {[
              { name: 'All Books', icon: <Inbox size={18} />, active: true },
              { name: 'Favorites', icon: <Heart size={18} /> },
              { name: 'Classics', icon: <History size={18} /> },
              { name: 'Sci-Fi', icon: <Rocket size={18} /> },
              { name: 'Growth', icon: <Lightbulb size={18} /> },
            ].map((item) => (
              <button
                key={item.name}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                  item.active
                  ? 'bg-primary font-black text-white shadow-xl shadow-primary/20'
                  : 'font-bold text-primary/50 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/10 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-primary/30 hover:border-accent hover:text-accent transition-all">
          <PlusCircle size={16} /> New Shelf
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-4xl font-black text-primary tracking-tighter">Virtual Bookshelf</h2>
            <p className="mt-1 text-primary/40 font-medium">You have {libraryBooks?.length || 0} titles in your collection.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 xl:grid-cols-4">
          {libraryBooks?.map((book) => (
            <div
              key={book.progressId}
              className="group cursor-pointer"
              onClick={() => navigate(`/reading/${book.bookId}`)}
            >
              <div className="relative aspect-[3/4.5] w-full mb-4 overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
                <img
                  alt={book.title}
                  className="h-full w-full object-cover"
                  src={book.coverImage}
                  onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x600?text=No+Cover')}
                />

                {/* Status Badges */}
                <div className="absolute right-3 top-3">
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase text-white shadow-lg ${
                    book.status === 'reading' ? 'bg-accent' :
                    book.status === 'completed' ? 'bg-primary' : 'bg-white/90 backdrop-blur-md text-primary/60'
                  }`}>
                    {book.status === 'reading' && <PlayCircle size={10} fill="currentColor" />}
                    {book.status === 'completed' && <CheckCircle size={10} />}
                    {book.status === 'to_read' && <Clock size={10} />}
                    {book.status === 'reading' ? 'Reading' : book.status === 'completed' ? 'Read' : 'To Read'}
                  </span>
                </div>

                {/* Progress Bar cho sách đang đọc */}
                {book.status === 'reading' && (
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/5">
                    <div
                      className="h-full bg-accent shadow-[0_0_10px_rgba(212,165,165,0.8)] transition-all duration-1000"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <h4 className="truncate font-black text-primary text-sm uppercase tracking-tight">{book.title}</h4>
              <p className="truncate text-xs font-bold text-primary/40 mt-0.5 uppercase tracking-tighter">{book.authorName}</p>
            </div>
          ))}

          {/* NÚT THÊM SÁCH - Dẫn sang Shop */}
          <div
            className="group flex cursor-pointer flex-col"
            onClick={() => navigate('/shop')}
          >
            <div className="flex aspect-[3/4.5] w-full items-center justify-center mb-4 overflow-hidden rounded-2xl border-2 border-dashed border-primary/10 bg-white/30 transition-all duration-300 group-hover:border-accent group-hover:bg-white group-hover:shadow-xl">
              <div className="text-center">
                <Plus className="mx-auto text-primary/20 group-hover:text-accent transition-colors" size={32} />
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-primary/30 group-hover:text-accent">Add Book</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;