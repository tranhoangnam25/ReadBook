import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Search,
  Filter,
  Eye,
  Pencil,
  Lock,
  LockOpen,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Users,
} from "lucide-react";

interface Role {
  name: string;
  description: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export default function ManageUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");

        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi lấy users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchKeyword =
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      const isNotAdmin = !user.roles?.some((r) => r.name === "ADM");

      return matchKeyword && matchStatus && isNotAdmin;
    });
  }, [users, keyword, statusFilter]);

const filteredBaseUsers = useMemo(() => {
  return users.filter((user) => {
    const isNotAdmin = !user.roles?.some((r) => r.name === "ADM");
    return isNotAdmin;
  });
}, [users]);

  const totalUsers = filteredBaseUsers.length;

  const lockedUsers = filteredBaseUsers.filter(
    (u) => u.status === "LOCKED"
  ).length;

  const activeUsers = filteredBaseUsers.filter(
    (u) => u.status === "ACTIVE"
  ).length;

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101222] text-slate-900 dark:text-white">

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar
          onOpenRegister={() => {}}
          onOpenLogin={() => {}}
          isLoggedIn={true}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="ml-64 pt-24">

        {/* Header */}
        <header className="sticky top-20 z-40 h-16 px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">

          <div>
            <h1 className="text-2xl font-bold">
              Quản lý người dùng
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Quản lý tài khoản và trạng thái người dùng
            </p>
          </div>


        </header>

        <div className="p-8 space-y-8">

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* Search */}
            <div className="md:col-span-8 relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#1121d4]/20"
              />
            </div>

            {/* Status */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <option value="ALL">
                  Tất cả trạng thái
                </option>

                <option value="ACTIVE">
                  Hoạt động
                </option>

                <option value="LOCKED">
                  Bị khóa
                </option>
              </select>
            </div>

            {/* Filter btn */}
            <div className="md:col-span-1">
              <button className="w-full h-full flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
                <Filter className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      Người dùng
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      Ngày tham gia
                    </th>

                    <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-slate-500">
                      Trạng thái
                    </th>

                    <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-slate-500">
                      Thao tác
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-slate-500"
                      >
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-slate-500"
                      >
                        Không tìm thấy người dùng
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {

                      const isLocked =
                        user.status === "LOCKED";

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition"
                        >

                          {/* User */}
                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-11 h-11 rounded-full bg-[#1121d4]/10 text-[#1121d4] flex items-center justify-center font-bold">
                                {user.username.charAt(0)}
                              </div>

                              <div>
                                <p className="font-semibold">
                                  {user.username}
                                </p>

                                <p className="text-sm text-slate-500">
                                  {user.email}
                                </p>
                              </div>

                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-6 py-4">

                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {user.roles?.[0]?.name}
                            </span>

                          </td>

                          {/* Created */}
                          <td className="px-6 py-4 text-slate-500">

                            {new Date(
                              user.createdAt
                            ).toLocaleDateString("vi-VN")}

                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">

                            <span
                              className={`inline-flex items-center gap-2 font-medium ${
                                isLocked
                                  ? "text-red-500"
                                  : "text-green-600"
                              }`}
                            >

                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isLocked
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                              />

                              {isLocked
                                ? "Bị khóa"
                                : "Hoạt động"}

                            </span>

                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">

                            <div className="flex items-center justify-end gap-2">

                              <button
                                onClick={() => navigate(`/admin/users/${user.id}`)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Eye className="w-4 h-4 text-slate-500" />
                              </button>



                              <button
                                className={`p-2 rounded-lg ${
                                  isLocked
                                    ? "bg-red-50 text-red-500"
                                    : "hover:bg-red-50 text-slate-500 hover:text-red-500"
                                }`}
                              >
                                {isLocked ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <LockOpen className="w-4 h-4" />
                                )}
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}

                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">

              <p className="text-sm text-slate-500">
                Tổng {filteredUsers.length} người dùng
              </p>

              <div className="flex items-center gap-2">

                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button className="w-8 h-8 rounded-lg bg-[#1121d4] text-white">
                  1
                </button>

                <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>

              </div>
            </div>
          </div>

          {/* Stats */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Tổng người dùng
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    {totalUsers}
                  </h3>
                </div>

                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <Users className="w-5 h-5" />
                </div>

              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Người dùng hoạt động
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-green-600">
                    {activeUsers}
                  </h3>
                </div>

                <div className="p-3 rounded-xl bg-green-100 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                </div>

              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Tài khoản bị khóa
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-red-500">
                    {lockedUsers}
                  </h3>
                </div>

                <div className="p-3 rounded-xl bg-red-100 text-red-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}