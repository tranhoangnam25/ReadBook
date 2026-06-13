import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import api from "../../services/api";


import type { ApiResponse, Permission } from "../../types";

import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  ArrowLeft,
  Trash2,
} from "lucide-react";

export default function ManagePermission() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.get<ApiResponse<Permission[]>>(
          "/permissions"
        );

        setPermissions(response.data.data);
      } catch (error) {
        console.error("Lỗi lấy permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);
const handleCreatePermission = async () => {
  try {
    setSubmitting(true);

    const res = await api.post("/permissions", form);

    // update UI ngay lập tức
    const newPermission: Permission = res.data.data;
    setPermissions((prev) => [...prev, newPermission]);

    setOpenModal(false);

    setForm({
      name: "",
      description: "",
    });

  } catch (err) {
    console.error("Create permission error:", err);
  } finally {
    setSubmitting(false);
  }
};
const handleDeletePermission = async (name: string) => {
  try {
    await api.delete(`/permissions/${name}`);

    setPermissions(prev =>
      prev.filter(p => p.name !== name)
    );

  } catch (err) {
    console.error("Delete permission error:", err);
    alert("Xóa thất bại!");
  }
};

  const filteredPermissions = useMemo(() => {
    return permissions.filter((permission) =>
      `${permission.name} ${permission.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [permissions, search]);

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101222] text-slate-900 dark:text-white font-sans">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 ml-64">
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-[#1121d4] hover:gap-3 transition-all duration-200">
                    <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700" />

                    <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Danh sách quyền hạn</h1>
                    <p className="text-slate-500">Quản lý các quyền truy cập trong hệ thống</p>
                    </div>
                </div>
                <button
                    onClick={() => setOpenModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#1121d4] text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                    <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Thêm quyền mới
                    </div>
                </button>
            </div>

          {/* Search */}
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type="text"
                placeholder="Tìm kiếm quyền hạn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  rounded-2xl
                  border
                  border-slate-200
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-900
                  text-sm
                  font-medium
                  outline-none
                  transition-all
                  focus:ring-4
                  focus:ring-[#1121d4]/10
                  focus:border-[#1121d4]
                "
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Tổng quyền hạn
                  </p>

                  <h3 className="mt-3 text-4xl font-black tracking-tight">
                    {permissions.length}
                  </h3>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-[#1121d4]/10 text-[#1121d4] flex items-center justify-center">
                  <KeyRound className="w-7 h-7" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Tên quyền
                    </th>





                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      Mô tả
                    </th>

                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-20 text-slate-500 font-medium"
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : filteredPermissions.length > 0 ? (
                    filteredPermissions.map((permission, index) => {


                      return (
                        <tr
                          key={index}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-2xl bg-[#1121d4]/10 text-[#1121d4] flex items-center justify-center shrink-0">
                                <KeyRound className="w-5 h-5" />
                              </div>

                              <div>
                                <h4 className="text-[15px] font-bold">
                                  {permission.name}
                                </h4>
                              </div>
                            </div>
                          </td>





                          <td className="px-6 py-5 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {permission.description}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end">


                              <button
                                onClick={() => handleDeletePermission(permission.name)}

                                className="p-2 rounded-xl text-slate-500 hover:text-red-500"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-20 text-slate-500 font-medium"
                      >
                        Không tìm thấy quyền hạn phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm font-medium text-slate-500">
                Hiển thị {filteredPermissions.length} trên tổng{" "}
                {permissions.length} quyền hạn
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  className="w-10 h-10 rounded-xl bg-[#1121d4] text-white text-sm font-bold"
                >
                  1
                </button>

                <button
                  type="button"
                  disabled
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {openModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">

          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold">
                Thêm quyền hạn mới
              </h2>

              <button
                onClick={() => setOpenModal(false)}
                className="text-slate-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">

              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Tên quyền hạn
                </label>
                <input
                    value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                  type="text"
                  placeholder="Ví dụ: Quản lý bài viết"
                  className="w-full mt-1 px-4 py-2 border rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#1121d4]/20"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600 dark:text-slate-300">
                  Mô tả
                </label>
                <textarea
                value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Mô tả ngắn gọn về phạm vi của quyền hạn này"
                  className="w-full mt-1 px-4 py-2 border rounded-xl h-28 resize-none bg-white dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-[#1121d4]/20"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">

              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600"
              >
                Hủy
              </button>

              <button
               onClick={handleCreatePermission}
                 disabled={submitting}
               className="px-4 py-2 rounded-xl bg-[#1121d4] text-white font-semibold hover:opacity-90">
                {submitting ? "Đang tạo..." : "Tạo quyền hạn"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}