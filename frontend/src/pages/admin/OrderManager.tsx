import React, { useEffect, useState } from 'react';
import api from '../../services/api';

import {
  Search,
  Bell,
  Settings,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react';

import Sidebar from '../../components/common/Sidebar';

// ============================
// TYPES
// ============================

interface Order {
  id : string;
  customerName: string;
  customerEmail: string;
  bookTitle: string;
  date: string;
  amount: number;
  status: string;
}

interface Stats {
  totalRevenue: number;
  totalOrdersCount: number;
}

// ============================
// COMPONENT
// ============================

export default function OrderManagement(): React.JSX.Element {

  // ============================
  // STATES
  // ============================

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [stats, setStats] =
    useState<Stats>({
      totalRevenue: 0,
      totalOrdersCount: 0
    });

  const [loading, setLoading] =
    useState<boolean>(false);

  const [keyword, setKeyword] =
    useState<string>("");

  const [page, setPage] =
    useState<number>(0);

  const [totalPages, setTotalPages] =
    useState<number>(0);

  const size = 10;
  const [selectedOrder, setSelectedOrder] =
  useState<Order | null>(null);

const [showModal, setShowModal] =
  useState(false);

  // ============================
  // FETCH ORDERS
  // ============================

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "/orders/admin",
        {
          params: {
            keyword,
            page,
            size
          }
        }
      );

      setOrders(response.data.content);

      setTotalPages(response.data.totalPages);

    } catch (error) {

      console.error(
        "Fetch orders failed:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // ============================
  // FETCH STATS
  // ============================

  const fetchStats = async () => {

    try {

      const response = await api.get(
        "/orders/admin/stats"
      );

      setStats(response.data);

    } catch (error) {

      console.error(
        "Fetch stats failed:",
        error
      );
    }
  };

  const fetchOrderDetail = async (
  orderId: string
) => {

  try {

    // "#BK-25" -> "25"

    const realId =
      orderId.replace("#BK-", "");

    const response = await api.get(
      `/orders/admin/${realId}`
    );

    setSelectedOrder(response.data);

    setShowModal(true);

  } catch (error) {

    console.error(
      "Fetch order detail failed:",
      error
    );
  }
};

  // ============================
  // EXPORT EXCEL
  // ============================

  const exportExcel = async () => {

    try {

      const response = await api.get(
        "/orders/export",
        {
          responseType: "blob"
        }
      );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "orders.xlsx"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (error) {

      console.error(
        "Export excel failed:",
        error
      );
    }
  };

  // ============================
  // USE EFFECT
  // ============================

  useEffect(() => {

    fetchOrders();

  }, [keyword, page]);

  useEffect(() => {

    fetchStats();

  }, []);

  // ============================
  // RENDER
  // ============================

  return (

    <div className="flex min-h-screen w-full bg-[#f8fafc] text-slate-900 antialiased font-sans">

      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* HEADER */}

        <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-10 px-8 flex items-center justify-between">

          <div className="relative w-96">

            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 text-slate-700 placeholder-slate-400"
              placeholder="Tìm mã đơn hàng, khách hàng..."
              type="text"
              value={keyword}
              onChange={(e) =>
                setKeyword(e.target.value)
              }
            />

          </div>

          <div className="flex items-center gap-2">

            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl">
              <Bell className="w-5 h-5" />
            </button>

            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl">
              <Settings className="w-5 h-5" />
            </button>

          </div>

        </header>

        {/* MAIN */}

        <main className="flex-1 p-8 flex flex-col gap-6">

          {/* TITLE */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Quản lý Đơn hàng Ebook
              </h1>

              <p className="text-sm text-slate-400 mt-0.5">
                Theo dõi lịch sử giao dịch và kích hoạt quyền đọc sách trực tuyến của khách hàng.
              </p>

            </div>

            <button
              onClick={exportExcel}
              className="bg-[#1121d4] text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-primary/10 hover:bg-blue-800 transition-colors"
            >

              <Download className="w-4 h-4" />

              Xuất báo cáo

            </button>

          </div>

          {/* FILTER */}

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">

            <div className="flex flex-wrap items-center gap-2">

              <button className="px-4 py-2 bg-[#1121d4] text-white text-sm font-semibold rounded-xl flex items-center gap-1.5">

                Tất cả đơn thành công

                <span className="bg-white/20 px-1.5 py-0.5 rounded-lg text-xs">

                  {stats.totalOrdersCount}

                </span>

              </button>

            </div>

            <div className="relative w-full">

              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-slate-200 text-slate-800 placeholder-slate-400"
                placeholder="Tìm mã đơn hàng, khách hàng hoặc tên sách..."
                type="text"
                value={keyword}
                onChange={(e) =>
                  setKeyword(e.target.value)
                }
              />

            </div>

          </div>

          {/* TABLE */}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse">

                <thead>

                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">

                    <th className="px-6 py-4">
                      Mã đơn hàng
                    </th>

                    <th className="px-6 py-4">
                      Khách hàng
                    </th>

                    <th className="px-6 py-4">
                      Tên sách Ebook
                    </th>

                    <th className="px-6 py-4">
                      Ngày mua
                    </th>

                    <th className="px-6 py-4">
                      Số tiền
                    </th>

                    <th className="px-6 py-4">
                      Trạng thái
                    </th>

                    <th className="px-6 py-4 text-center">
                      Hành động
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-50 text-slate-700">

                  {loading ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="text-center py-10"
                      >
                        Đang tải dữ liệu...
                      </td>

                    </tr>

                  ) : orders.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="text-center py-10"
                      >
                        Không có dữ liệu
                      </td>

                    </tr>

                  ) : (

                    orders.map((order) => (

                      <tr
                        key={order.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >

                        <td className="px-6 py-4 font-semibold text-sm text-[#1121d4]">
                          {order.id}
                        </td>

                        <td className="px-6 py-4">

                          <div className="flex flex-col">

                            <span className="font-semibold text-sm text-slate-800">
                              {order.customerName}
                            </span>

                            <span className="text-xs text-slate-400">
                              {order.customerEmail}
                            </span>

                          </div>

                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                          {order.bookTitle}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">

                          {new Date(order.date)
                            .toLocaleDateString("vi-VN")}

                        </td>

                        <td className="px-6 py-4 text-sm font-bold text-slate-800">

                          {order.amount.toLocaleString()}đ

                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">

                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>

                            Đã thanh toán

                          </span>

                        </td>

                        <td className="px-6 py-4 text-center">

                          <div className="flex justify-center items-center gap-3">

                            <button
  onClick={() =>
    fetchOrderDetail(order.id)
  }
  className="text-slate-400 hover:text-slate-600"
  title="Xem chi tiết đơn hàng"
>

                              <Eye className="w-4 h-4" />

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

            {/* PAGINATION */}

            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-50 bg-white">

              <span className="text-xs font-medium text-slate-400">

                Trang {page + 1} / {totalPages || 1}

              </span>

              <div className="flex gap-1 items-center">

                <button
                  disabled={page === 0}
                  onClick={() =>
                    setPage(page - 1)
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400"
                >

                  <ChevronLeft className="w-4 h-4" />

                </button>

                <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1121d4] text-white text-xs font-bold">

                  {page + 1}

                </button>

                <button
                  disabled={page >= totalPages - 1}
                  onClick={() =>
                    setPage(page + 1)
                  }
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-400"
                >

                  <ChevronRight className="w-4 h-4" />

                </button>

              </div>

            </div>

          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">

              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">

                <Wallet className="w-6 h-6" />

              </div>

              <div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tổng doanh thu bán Ebook
                </p>

                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">

                  {stats.totalRevenue.toLocaleString()}đ

                </p>

              </div>

            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">

              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">

                <Eye className="w-6 h-6" />

              </div>

              <div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tổng số đơn hàng thành công
                </p>

                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">

                  {stats.totalOrdersCount} đơn hàng

                </p>

              </div>

            </div>

          </div>

          {/* MODAL CHI TIẾT ĐƠN HÀNG */}

{showModal && selectedOrder && (

  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">

    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-bold text-slate-800">
          Chi tiết đơn hàng
        </h2>

        <button
          onClick={() =>
            setShowModal(false)
          }
          className="text-slate-400 hover:text-slate-600 text-xl"
        >
          ✕
        </button>

      </div>

      <div className="space-y-4">

        <div>
          <p className="text-sm text-slate-400">
            Mã đơn hàng
          </p>

          <p className="font-semibold text-slate-800">
            {selectedOrder.id}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Khách hàng
          </p>

          <p className="font-semibold text-slate-800">
            {selectedOrder.customerName}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Email
          </p>

          <p className="font-semibold text-slate-800">
            {selectedOrder.customerEmail}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Tên sách
          </p>

          <p className="font-semibold text-slate-800">
            {selectedOrder.bookTitle}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Ngày mua
          </p>

          <p className="font-semibold text-slate-800">

            {new Date(selectedOrder.date)
              .toLocaleString("vi-VN")}

          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Số tiền
          </p>

          <p className="font-bold text-emerald-600 text-lg">

            {selectedOrder.amount.toLocaleString()}đ

          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Trạng thái
          </p>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">

            Đã thanh toán

          </span>
        </div>

      </div>

    </div>

  </div>

)}

        </main>

      </div>

    </div>
  );
}