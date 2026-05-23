import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed top-16 left-0 h-[calc(100vh-64px)]">
      <div className="p-6 flex items-center gap-3"></div>

      <nav className="flex-1 px-4 space-y-1">
        <NavLink to="/admin" end className={navClass}>
          <span className="material-symbols-outlined">dashboard</span>
          Bảng điều khiển
        </NavLink>

        <NavLink to="/admin/books" className={navClass}>
          <span className="material-symbols-outlined">auto_stories</span>
          Quản lý kho sách
        </NavLink>

        <NavLink to="/admin/orders" className={navClass}>
          <span className="material-symbols-outlined">receipt_long</span>
          Đơn hàng & Hoàn tiền
        </NavLink>

        <NavLink to="/admin/users" className={navClass}>
          <span className="material-symbols-outlined">group</span>
          Người dùng
        </NavLink>

        <NavLink to="/admin/reviews" className={navClass}>
          <span className="material-symbols-outlined">star</span>
          Đánh giá
        </NavLink>

        <NavLink to="/admin/admins" className={navClass}>
          <span className="material-symbols-outlined">
            admin_panel_settings
          </span>
          Quản trị viên
        </NavLink>
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