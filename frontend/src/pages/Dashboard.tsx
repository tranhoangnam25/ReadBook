import { useState, useEffect } from "react";
import Sidebar from "../components/common/Sidebar";
import { hasRole } from "../services/authService";
import api from "../services/api";

interface DashboardStats {
  totalRevenue: number;
  newUsersCount: number;
  totalOrdersCount: number;
}

interface RecentOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  bookTitle: string;
  createdAt: string;
  amount: number;
  status: string;
}

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasRole('ADM')) {
      const fetchDashboardData = async () => {
        try {
          const [statsRes, ordersRes] = await Promise.all([
            api.get("/admin/dashboard/stats"),
            api.get("/admin/dashboard/recent-orders")
          ]);
          setStats(statsRes.data);
          setRecentOrders(ordersRes.data);
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu dashboard:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 ml-64">
        {hasRole('ADM') ? (
          <>
            {/* Header */}
            <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-10 px-8 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    search
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="Tìm kiếm sách, người dùng hoặc đơn hàng..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  <span className="material-symbols-outlined">settings</span>
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="p-8 max-w-7xl mx-auto space-y-8">
              {/* Welcome */}
              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900">
                  Tổng quan Dashboard
                </h2>
                <p className="text-slate-500">
                  Chào mừng trở lại, {user?.username || "Admin"}. Đây là những gì đang diễn ra hôm nay.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-slate-500">Tổng doanh thu</p>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Thực tế</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {loading ? "..." : formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                  <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full"></div>
                  </div>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-slate-500">Người dùng mới (10 ngày)</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">Mới</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {loading ? "..." : stats?.newUsersCount.toLocaleString()}
                  </p>
                </div>

                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-slate-500">Tổng số đơn hàng</p>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Thành công</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {loading ? "..." : stats?.totalOrdersCount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Đơn hàng gần đây (7 ngày)</h3>
                  <a href="/admin/orders" className="text-primary text-sm font-bold hover:underline">Xem tất cả đơn hàng</a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Mã đơn hàng</th>
                        <th className="px-6 py-4">Khách hàng</th>
                        <th className="px-6 py-4">Tiêu đề sách</th>
                        <th className="px-6 py-4">Số tiền</th>
                        <th className="px-6 py-4">Thời gian</th>
                        <th className="px-6 py-4">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-slate-400">Đang tải dữ liệu...</td>
                        </tr>
                      ) : recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-slate-400">Không có đơn hàng mới trong 7 ngày qua</td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => (
                          <tr key={order.orderId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium">{order.orderId}</td>
                            <td className="px-6 py-4 text-sm">{order.customerName}</td>
                            <td className="px-6 py-4 text-sm text-slate-500 italic">{order.bookTitle}</td>
                            <td className="px-6 py-4 text-sm font-bold">{formatCurrency(order.amount)}</td>
                            <td className="px-6 py-4 text-sm">{formatDate(order.createdAt)}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase">
                                {order.status === 'paid' ? 'Đã hoàn thành' : order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
            <h1 className="text-5xl font-black text-slate-300 tracking-tighter">XIN CHÀO BẠN</h1>
            <p className="text-slate-400 mt-4 font-medium uppercase tracking-widest text-sm">Chào mừng bạn đến với hệ thống quản trị</p>
          </div>
        )}
      </main>
    </div>
  );
}
