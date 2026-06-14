import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/common/Sidebar";
import api from "../../services/api";
import type { ApiResponse } from "../../types/index";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Shield,
  Users,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Settings,
} from "lucide-react";

interface Role {
  name: string;
  description: string;
}

export default function ManageRole() {
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get<ApiResponse<Role[]>>("/roles");

        setRoles(response.data.data);
      } catch (error) {
        console.error("Lỗi lấy roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      `${role.name} ${role.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [roles, search]);
const handleDeleteRole = async (roleName: string) => {
  const confirmDelete = window.confirm(
    `Bạn có chắc muốn xoá role "${roleName}" không?`
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/roles/${roleName}`);

    setRoles((prev) =>
      prev.filter((role) => role.name !== roleName)
    );

    alert("Xoá role thành công");
  } catch (error) {
    console.error("Lỗi xoá role:", error);

    alert("Xoá role thất bại");
  }
};

  const getRoleIcon = (role: Role) => {
    if (role.name.toLowerCase().includes("admin")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-[#1121d4] text-white flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
      );
    }

    if (role.name.toLowerCase().includes("cskh")) {
      return (
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-xl bg-[#1121d4]/10 text-[#1121d4] flex items-center justify-center">
        <BadgeCheck className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101222] text-slate-900 dark:text-white">


      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="ml-64 pt-24 min-h-screen">
        {/* Header */}
        <header className="sticky top-20 z-40 h-20 px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <h1 className="text-2xl font-bold">Danh sách vai trò</h1>


          </div>

          <div className="flex items-center gap-3">
            <button
             onClick={() => navigate("/admin/permissions")}
             className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Quyền hạn
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/create-role")}
              className="px-4 py-2.5 rounded-xl bg-[#1121d4] text-white">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Thêm vai trò
              </div>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Search */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type="text"
                placeholder="Tìm kiếm vai trò..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Mô tả</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-10">
                        Đang tải...
                      </td>
                    </tr>
                  ) : filteredRoles.length > 0 ? (
                    filteredRoles.map((role, index) => (
                      <tr
                        key={index}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            {getRoleIcon(role)}

                            <div>
                              <h4 className="font-bold text-lg">
                                {role.name}
                              </h4>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">
                          {role.description}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                             onClick={() => navigate(`/admin/update-role/${role.name}`)}
                             className="p-2 rounded-xl text-slate-500 hover:text-[#1121d4]">
                              <Pencil className="w-5 h-5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteRole(role.name)
                              }
                              className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-16 text-slate-500"
                      >
                        Không tìm thấy vai trò phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-500">
                Hiển thị {filteredRoles.length} vai trò
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button className="w-9 h-9 rounded-xl bg-[#1121d4] text-white text-sm font-semibold">
                  1
                </button>

                <button
                  disabled
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}