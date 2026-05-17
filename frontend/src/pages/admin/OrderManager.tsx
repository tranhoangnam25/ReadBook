import React, { useState } from 'react';
import { 
  Search, Bell, Settings, Download, Eye, ChevronLeft, ChevronRight, Wallet 
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar'; 

// 1. Cập nhật kiểu dữ liệu: Chỉ giữ trạng thái 'paid' cho đơn hàng Ebook thành công
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  bookTitle: string;
  date: string;
  amount: string;
  status: 'paid'; 
}

// 2. Thu gọn Khối thống kê (Chỉ tập trung vào doanh thu và tổng số đơn)
interface Stats {
  totalRevenue: string;
  totalOrdersCount: number;
}

export default function OrderManagement(): React.JSX.Element {
  // Dữ liệu mẫu đã loại bỏ các đơn hàng chờ duyệt và hoàn tiền
  const [orders] = useState<Order[]>([
    {
      id: "#BK-9421",
      customerName: "Nguyễn Văn A",
      customerEmail: "vana@example.com",
      bookTitle: "Lược Sử Thời Gian",
      date: "12/10/2023",
      amount: "150.000đ",
      status: "paid"
    },
    {
      id: "#BK-6204",
      customerName: "Phạm Minh D",
      customerEmail: "minhd@example.com",
      bookTitle: "Đắc Nhân Tâm",
      date: "16/10/2023",
      amount: "75.000đ",
      status: "paid"
    }
  ]);

  const stats: Stats = {
    totalRevenue: "42.500.000đ",
    totalOrdersCount: 128
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-900 antialiased font-sans">
      
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top Header Barra */}
        <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 text-slate-700 placeholder-slate-400" 
              placeholder="Tìm mã đơn hàng, khách hàng..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"><Bell className="w-5 h-5" /></button>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"><Settings className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Nội dung Workspace chính */}
        <main className="flex-1 p-8 flex flex-col gap-6">
          
          {/* Header Title Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Đơn hàng Ebook</h1>
              <p className="text-sm text-slate-400 mt-0.5">Theo dõi lịch sử giao dịch và kích hoạt quyền đọc sách trực tuyến của khách hàng.</p>
            </div>
            <button className="bg-[#1121d4] text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/10 hover:bg-blue-800 transition-colors">
              <Download className="w-4 h-4" /> Xuất báo cáo
            </button>
          </div>

          {/* Tab Filter & Search Box Area */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-4 py-2 bg-[#1121d4] text-white text-sm font-semibold rounded-xl flex items-center gap-1.5">
                Tất cả đơn thành công <span className="bg-white/20 px-1.5 py-0.5 rounded-lg text-xs">{stats.totalOrdersCount}</span>
              </button>
            </div>
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-slate-200 text-slate-800 placeholder-slate-400" 
                placeholder="Tìm mã đơn hàng, khách hàng hoặc tên sách..." 
                type="text"
              />
            </div>
          </div>

          {/* Orders Listing Data Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Mã đơn hàng</th>
                    <th className="px-6 py-4">Khách hàng</th>
                    <th className="px-6 py-4">Tên sách Ebook</th>
                    <th className="px-6 py-4">Ngày mua</th>
                    <th className="px-6 py-4">Số tiền</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {orders.map((order: Order, index: number) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm text-[#1121d4]">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-slate-800">{order.customerName}</span>
                          <span className="text-xs text-slate-400">{order.customerEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{order.bookTitle}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{order.amount}</td>
                      <td className="px-6 py-4">
                        {/* Chỉ giữ lại badge Đã thanh toán */}
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          Đã thanh toán
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button className="text-slate-400 hover:text-slate-600" title="Xem chi tiết đơn hàng">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Điều hướng phân trang */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-50 bg-white">
              <span className="text-xs font-medium text-slate-400">Hiển thị 1-10 trên 128 đơn hàng</span>
              <div className="flex gap-1 items-center">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1121d4] text-white text-xs font-bold">1</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 text-slate-600 text-xs font-semibold">2</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 text-slate-600 text-xs font-semibold">3</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Khối thống kê Widget chân trang thiết kế lại gọn gàng hơn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng doanh thu bán Ebook</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalRevenue}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số đơn hàng thành công</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalOrdersCount} đơn hàng</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}