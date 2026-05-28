import { NavLink } from "react-router-dom";
import { hasRole, hasPermission } from "../../services/authService";

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
        {!hasRole('USR') && (
        <NavLink to="/admin" end className={navClass}>
          <span className="material-symbols-outlined">dashboard</span>
          Bảng điều khiển
        </NavLink>
        )}

        {hasPermission('MANAGE_BOOK') && (
        <NavLink to="/admin/books" className={navClass}>
          <span className="material-symbols-outlined">auto_stories</span>
          Quản lý kho sách
        </NavLink>
        )}

        {hasPermission('MANAGE_ORDER') && (
        <NavLink to="/admin/orders" className={navClass}>
          <span className="material-symbols-outlined">receipt_long</span>
          Đơn hàng
        </NavLink>
        )}

        {hasPermission('MANAGE_USER') && (
        <NavLink to="/admin/users" className={navClass}>
          <span className="material-symbols-outlined">group</span>
          Người dùng
        </NavLink>
        )}

        {hasPermission('MANAGE_REVIEW') && (
        <NavLink to="/admin/reviews" className={navClass}>
          <span className="material-symbols-outlined">star</span>
          Đánh giá
        </NavLink>
        )}

        {hasPermission('MANAGE_SALES') && (
        <NavLink to="/admin/sale-manager" className={navClass}>
          <span className="material-symbols-outlined">star</span>
          FlashSale
        </NavLink>
        )}

        {hasPermission('MANAGE_ROLES') && (
         <NavLink to="/admin/roles" className={navClass}>
          <span className="material-symbols-outlined">
            admin_panel_settings
          </span>
          Phân quyền
        </NavLink>
        )}
      </nav>


    </aside>
  );
}