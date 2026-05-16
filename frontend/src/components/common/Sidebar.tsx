import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-lg">
            book_open
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-primary">
          LIBROADMIN
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
        >
          <span className="material-symbols-outlined">dashboard</span>
          Bảng điều khiển
        </Link>

        <Link
          to="/admin/books"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
        >
          <span className="material-symbols-outlined">auto_stories</span>
          Quản lý kho sách
        </Link>

        <Link
          to="/admin/orders"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
        >
          <span className="material-symbols-outlined">receipt_long</span>
          Đơn hàng & Hoàn tiền
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
        >
          <span className="material-symbols-outlined">group</span>
          Người dùng
        </Link>

        <Link
          to="/admin/reviews"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
        >
          <span className="material-symbols-outlined">star</span>
          Đánh giá
        </Link>

        <Link
          to="/admin/admins"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
        >
          <span className="material-symbols-outlined">
            admin_panel_settings
          </span>
          Quản trị viên
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
            AR
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate">
              Alex Rivera
            </span>

            <span className="text-xs text-slate-500 truncate">
              Quản trị viên cấp cao
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}