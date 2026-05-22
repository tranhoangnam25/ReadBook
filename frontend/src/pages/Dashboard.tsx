import Sidebar from "../components/common/Sidebar";

export default function Dashboard() {

  const user = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 ml-64">
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
              <span className="material-symbols-outlined">
                notifications
              </span>
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
                <p className="text-sm font-medium text-slate-500">
                  Tổng doanh thu
                </p>

                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                  +12.5%
                </span>
              </div>

              <p className="text-2xl font-bold mt-2">$42,500.00</p>

              <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4"></div>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-500">
                  Người dùng mới
                </p>

                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                  +5.2%
                </span>
              </div>

              <p className="text-2xl font-bold mt-2">1,284</p>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-500">
                  Gói đăng ký hoạt động
                </p>

                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                  +8.1%
                </span>
              </div>

              <p className="text-2xl font-bold mt-2">8,420</p>

              <p className="mt-4 text-sm text-slate-500">
                <span className="text-primary font-semibold">432</span>
                {" "}gia hạn đang chờ xử lý hôm nay
              </p>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Đơn hàng gần đây
              </h3>

              <button className="text-primary text-sm font-bold hover:underline">
                Xem tất cả đơn hàng
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Mã đơn hàng</th>
                    <th className="px-6 py-4">Khách hàng</th>
                    <th className="px-6 py-4">Tiêu đề sách</th>
                    <th className="px-6 py-4">Số tiền</th>
                    <th className="px-6 py-4">Trạng thái</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">
                      #ORD-2849
                    </td>

                    <td className="px-6 py-4 text-sm">
                      Jane Doe
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500 italic">
                      The Midnight Library
                    </td>

                    <td className="px-6 py-4 text-sm font-bold">
                      $14.99
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase">
                        Đã hoàn thành
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}