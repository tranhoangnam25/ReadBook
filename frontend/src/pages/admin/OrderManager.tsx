import React, { useState } from 'react';
import { 
  BookOpen, LayoutGrid, BookMarked, ShoppingCart, Users, Settings, 
  User, Search, Bell, Download, ChevronDown, Eye, XCircle, 
  LogIn, Wallet, CalendarClock, RefreshCw, ChevronLeft, ChevronRight 
} from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho từng Đơn hàng
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  bookTitle: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'refunded';
}

// Định nghĩa kiểu dữ liệu cho Khối thống kê
interface Stats {
  totalRevenue: string;
  pendingCount: number;
  refundCount: number;
}

export default function OrderManagement(): React.JSX.Element {
  // 1. Khởi tạo State với kiểu dữ liệu Order[] cố định dữ liệu mẫu
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
      id: "#BK-8832",
      customerName: "Trần Thị B",
      customerEmail: "thib@example.com",
      bookTitle: "Nhà Giả Kim",
      date: "14/10/2023",
      amount: "89.000đ",
      status: "pending"
    },
    {
      id: "#BK-7519",
      customerName: "Lê Văn C",
      customerEmail: "vanc@example.com",
      bookTitle: "Tâm Lý Học Tội Phạm",
      date: "15/10/2023",
      amount: "210.000đ",
      status: "refunded"
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

  // 2. Dữ liệu Thống kê mẫu tuân thủ interface Stats
  const stats: Stats = {
    totalRevenue: "42.500.000đ",
    pendingCount: 18,
    refundCount: 4
  };

  // Hàm helper xử lý render Badge Trạng thái có kiểm tra Type an toàn
  const renderStatusBadge = (status: Order['status']): React.JSX.Element | null => {
    switch(status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Đã thanh toán
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            Chờ xử lý
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
            Đã hoàn tiền
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-900 antialiased font-sans">
      
      {/* Sidebar thanh điều hướng bên trái */}
      <aside className="w-64 border-r border-slate-100 bg-white flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1121d4] rounded-xl flex items-center justify-center text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-wider">LIBROADMIN</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm" href="#dashboard">
            <LayoutGrid className="w-5 h-5 text-slate-400" />
            <span>Tổng quan</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm" href="#books">
            <BookMarked className="w-5 h-5 text-slate-400" />
            <span>Quản lý sách</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 bg-[#1121d4] text-white rounded-xl shadow-md shadow-primary/10 font-semibold text-sm" href="#orders">
            <ShoppingCart className="w-5 h-5" />
            <span>Đơn hàng & Hoàn tiền</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm" href="#customers">
            <Users className="w-5 h-5 text-slate-400" />
            <span>Khách hàng</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium text-sm" href="#settings">
            <Settings className="w-5 h-5 text-slate-400" />
            <span>Cài đặt</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-400 truncate">admin@libro.vn</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Vùng Main Content bên phải */}
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
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Đơn hàng & Hoàn tiền</h1>
              <p className="text-sm text-slate-400 mt-0.5">Theo dõi, phê duyệt hoàn tiền và quản lý trạng thái giao dịch sách.</p>
            </div>
            <button className="bg-[#1121d4] text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/10 hover:bg-blue-800 transition-colors">
              <Download className="w-4 h-4" /> Xuất báo cáo
            </button>
          </div>

          {/* Tab Filter & Search Box Area */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button className="px-4 py-2 bg-[#1121d4] text-white text-sm font-semibold rounded-xl flex items-center gap-1.5">
                Tất cả <span className="bg-white/20 px-1.5 py-0.5 rounded-lg text-xs">128</span>
              </button>
              <button className="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 flex items-center gap-1">
                Đã thanh toán <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <button className="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 flex items-center gap-1">
                Chờ xử lý <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              <button className="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-100 flex items-center gap-1">
                Đã hoàn tiền <ChevronDown className="w-4 h-4 text-slate-400" />
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
                    <th className="px-6 py-4">Tên sách</th>
                    <th className="px-6 py-4">Ngày đặt</th>
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
                      <td className="px-6 py-4">{renderStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button className="text-slate-400 hover:text-slate-600" title="Xem chi tiết">
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === 'paid' && (
                            <button className="text-slate-400 hover:text-red-500" title="Hủy đơn">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {order.status === 'pending' && (
                            <button className="text-slate-400 hover:text-blue-500" title="Duyệt hoàn tiền">
                              <LogIn className="w-4 h-4 rotate-180" />
                            </button>
                          )}
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

          {/* Các Khối báo cáo thống kê Widget chân trang */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng doanh thu tháng</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalRevenue}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                <CalendarClock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang chờ xử lý</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.pendingCount} đơn hàng</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yêu cầu hoàn tiền</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.refundCount} yêu cầu</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
