import React, { useState } from 'react';
// 1. Import Sidebar của bạn (Điều chỉnh lại đường dẫn cho đúng với cấu trúc dự án của bạn)
import Sidebar from '../../components/common/Sidebar';

interface Review {
  id: string;
  customerName: string;
  customerId: string;
  bookTitle: string;
  rating: number; 
  comment: string;
  date: string;
  status: 'hien' | 'an'; 
}

interface StatCard {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: string;
}

export default function ReviewManager(): React.JSX.Element {
  const [reviews] = useState<Review[]>([
    {
      id: "1",
      customerName: "Nguyễn Văn A",
      customerId: "#C001",
      bookTitle: "Đắc Nhân Tâm",
      rating: 5,
      comment: "Sách rất hay và ý nghĩa, tôi sẽ giới thiệu cho bạn bè.",
      date: "15/10/2023",
      status: "hien"
    },
    
    {
      id: "2",
      customerName: "Lê Văn C",
      customerId: "#C003",
      bookTitle: "Sapiens",
      rating: 1,
      comment: "Sách bị rách bìa khi tôi nhận hàng từ shipper.",
      date: "13/10/2023",
      status: "an"
    }
  ]);

  const stats: StatCard[] = [
    { title: "Tổng đánh giá", value: "1,250", trend: "12%", isPositive: true, icon: "trending_up" },
    { title: "Đánh giá 5 sao", value: "850", trend: "5%", isPositive: true, icon: "trending_up" },
    
  ];

  const renderStars = (rating: number): React.JSX.Element => {
    const stars: React.JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="material-symbols-outlined text-[16px]">
          {i <= rating ? 'star' : 'star_outline'}
        </span>
      );
    }
    return <div className="flex text-amber-400">{stars}</div>;
  };

  const renderStatusBadge = (status: Review['status']): React.JSX.Element => {
    switch (status) {
      case 'hien':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">Đã hiện</span>;
      
      case 'an':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Đã ẩn</span>;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f6f6f8] dark:bg-[#101222] font-['Inter',_sans-serif] text-slate-900 dark:text-slate-100 antialiased">
      
      {/* 2. Gọi Component Sidebar được import từ bên ngoài */}
      <Sidebar />

      {/* Vùng nội dung chính dịch sang phải ml-64 (hoặc ml-60) để cân xứng với Sidebar cố định */}
      <main className="flex-1 ml-64 min-w-0 flex flex-col overflow-hidden">
        
        {/* Header rút gọn chiều cao và khoảng cách đệm */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-bold">Kiểm duyệt đánh giá</h2>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full flex items-center">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
          </div>
        </header>

        {/* Khung cuộn chính tinh chỉnh nhỏ gọn (p-6) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Thống kê dạng Grid nhỏ gọn hơn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.title}</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.value}</h3>
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <span className="material-symbols-outlined text-xs">{stat.icon}</span> {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Thanh tìm kiếm và bộ lọc tối ưu diện tích */}
          <div className="flex flex-col lg:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs focus:ring-2 focus:ring-[#1121d4]/20 text-slate-800 dark:text-slate-200 transition-all placeholder-slate-400" 
                placeholder="Tìm kiếm đánh giá, tên sách..." 
                type="text"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
              <div className="relative">
                <select className="appearance-none bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium focus:ring-2 focus:ring-[#1121d4]/20 cursor-pointer text-slate-700 dark:text-slate-300">
                  <option value="">Tất cả trạng thái</option>
                  <option value="hien">Đã hiện</option>
                  
                  <option value="an">Đã ẩn</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">expand_more</span>
              </div>
              
              <div className="relative">
                <select defaultValue="30days" className="appearance-none bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-8 pr-8 py-1.5 text-xs font-medium focus:ring-2 focus:ring-[#1121d4]/20 cursor-pointer text-slate-700 dark:text-slate-300">
                  <option value="today">Hôm nay</option>
                  <option value="7days">7 ngày qua</option>
                  <option value="30days">30 ngày qua</option>
                  <option value="custom">Tùy chọn</option>
                </select>
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">calendar_today</span>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">expand_more</span>
              </div>
              
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1121d4] text-white text-xs font-bold rounded-lg hover:bg-[#1121d4]/90 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-xs">filter_alt</span> Lọc
              </button>
            </div>
          </div>

          {/* Bảng danh sách */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Khách hàng</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tên sách</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Đánh giá</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nội dung bình luận</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ngày gửi</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {reviews.map((review: Review) => (
                    <tr key={review.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{review.customerName}</div>
                        <div className="text-[10px] text-slate-400">ID: {review.customerId}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-medium text-xs text-[#1121d4] hover:underline cursor-pointer">{review.bookTitle}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <p className="text-xs truncate text-slate-600 dark:text-slate-400" title={review.comment}>
                          {review.comment}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">{review.date}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {renderStatusBadge(review.status)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs font-medium">
                        <div className="flex items-center gap-2.5">
                          {review.status === 'hien' && (
                            <>
                              <button className="text-[#1121d4] hover:underline">Phản hồi</button>
                              <button className="text-rose-500 hover:underline">Ẩn</button>
                            </>
                          )}
                          
                          {review.status === 'an' && (
                            <>
                              <button className="text-[#1121d4] hover:underline">Hiện</button>
                              <button className="text-[#1121d4] hover:underline">Phản hồi</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Thanh phân trang nhỏ gọn */}
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
              <p className="text-xs text-slate-500">Hiển thị 1-10 của 1,250 kết quả</p>
              <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 flex items-center" disabled>
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button className="w-6 h-6 rounded-md bg-[#1121d4] text-white text-xs font-bold">1</button>
                <button className="w-6 h-6 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-xs">2</button>
                <button className="w-6 h-6 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-xs">3</button>
                <span className="px-1 text-xs text-slate-400">...</span>
                <button className="w-6 h-6 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-xs">125</button>
                <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}