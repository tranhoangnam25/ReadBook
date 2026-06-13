import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/common/Sidebar";

import api from "../../services/api";

import type {
  ApiResponse,
  Permission,
  Role,
} from "../../types";

import {
  ArrowLeft,
  BadgePlus,
  Save,
  Shield,
  Check,
} from "lucide-react";

interface RoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export default function CreateRole() {
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState<
    Permission[]
  >([]);

  const [selectedPermissions, setSelectedPermissions] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<RoleRequest>({
    name: "",
    description: "",
    permissions: [],
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response =
          await api.get<ApiResponse<Permission[]>>(
            "/permissions"
          );

        setPermissions(response.data.data);
      } catch (error) {
        console.error(
          "Lỗi lấy permissions:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleTogglePermission = (
    permissionName: string
  ) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionName)) {
        return prev.filter(
          (item) => item !== permissionName
        );
      }

      return [...prev, permissionName];
    });
  };

  const handleSelectAll = () => {
    if (
      selectedPermissions.length ===
      permissions.length
    ) {
      setSelectedPermissions([]);
      return;
    }

    setSelectedPermissions(
      permissions.map((p) => p.name)
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload: RoleRequest = {
        ...form,
        permissions: selectedPermissions,
      };

      await api.post<ApiResponse<Role>>(
        "/roles",
        payload
      );

      navigate("/admin/roles");
    } catch (error) {
      console.error("Lỗi tạo role:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101222] text-slate-900 dark:text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <div className="p-8 space-y-8">
            <div className="flex items-center gap-5">
                <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#1121d4] hover:gap-3 transition-all"
                >
                <ArrowLeft className="w-4 h-4" />

                <span className="text-sm font-bold">
                    Quay lại
                </span>
                </button>

                <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />

                <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                    Thêm vai trò mới
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tạo vai trò và gán quyền truy cập
                </p>
                </div>
            </div>

            <form
            onSubmit={handleSubmit}
            className="space-y-8"
            >
          {/* Basic info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-[#1121d4]/10 text-[#1121d4] flex items-center justify-center">
                <BadgePlus className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  Thông tin cơ bản
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Thiết lập thông tin vai trò
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tên vai trò
                </label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Ví dụ: Nhân viên kho"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-4 focus:ring-[#1121d4]/10 focus:border-[#1121d4]"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mô tả vai trò
                </label>

                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  placeholder="Mô tả ngắn về vai trò"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-4 focus:ring-[#1121d4]/10 focus:border-[#1121d4]"
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            {/* Top */}
            <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#1121d4]/10 text-[#1121d4] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Danh sách quyền hạn
                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Tổng cộng{" "}
                    {permissions.length} quyền
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    permissions.length > 0 &&
                    selectedPermissions.length ===
                      permissions.length
                  }
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-slate-300 text-[#1121d4] focus:ring-[#1121d4]"
                />

                <span className="text-sm font-medium">
                  Chọn tất cả
                </span>
              </label>
            </div>

            {/* Body */}
            <div className="p-8">
              {loading ? (
                <div className="text-center py-20 text-slate-500">
                  Đang tải quyền hạn...
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {permissions.map((permission) => (
                    <label
                      key={permission.name}
                      className="flex items-start justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#1121d4]/30 hover:bg-[#1121d4]/[0.03] transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-[#1121d4]/10 text-[#1121d4] flex items-center justify-center shrink-0">
                          <Shield className="w-5 h-5" />
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {permission.name}
                          </h4>

                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {
                              permission.description
                            }
                          </p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(
                          permission.name
                        )}
                        onChange={() =>
                          handleTogglePermission(
                            permission.name
                          )
                        }
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-[#1121d4] focus:ring-[#1121d4] shrink-0"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-7 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-7 py-3 rounded-2xl bg-[#1121d4] hover:bg-[#0d1ab3] text-white transition-all shadow-lg shadow-[#1121d4]/20 flex items-center gap-2 font-medium disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Check className="w-4 h-4" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Lưu vai trò
                </>
              )}
            </button>
          </div>

          {/* Bottom note */}
          <div className="pt-10 text-center">
            <div className="w-28 h-28 rounded-full bg-[#1121d4]/5 flex items-center justify-center mx-auto mb-5">
              <Shield className="w-14 h-14 text-[#1121d4]" />
            </div>

            <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Mọi thay đổi quyền hạn sẽ được áp
              dụng ngay sau khi người dùng đăng
              nhập lại vào hệ thống.
            </p>
          </div>
        </form>
        </div>
        </main>
        </div>
        );
        }