import { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar.tsx";
import { useParams } from "react-router-dom";
import api from "../../services/api";

import {
  Lock,
  ChevronRight,
} from "lucide-react";

export const toggleUserStatus = async (id: number) => {
  return await api.patch(`/users/${id}/toggle-status`);
};

export default function UserDetail() {
  const { id } = useParams();
  const userId = Number(id);
  if (!userId) {
    return <div>Invalid user</div>;
  }

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");


  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };


const handleToggleStatus = async () => {
  try {
    const res = await toggleUserStatus(userId);

    // update UI ngay sau khi API trả về
    setUser((prev: any) => ({
      ...prev,
      status: res.data.status,
    }));
  } catch (err) {
    console.error(err);
    alert("Không thể cập nhật trạng thái");
  }
};

const handleUpdateRole = async () => {
    try {
        await api.put(`/users/${userId}/roles`, {
         roles:[selectedRole]
        });
    alert("Cập nhật quyền thành công!");

    setUser((prev: any) => ({
        ...prev,
        roles: [{name : selectedRole}]
        }));
    } catch (err){
        console.error(err);
        alert("Lỗi khi cập nhật quyền!")
        }
};

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const [userRes, orderRes, rolesRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/users/${id}/orders`),
          api.get("/roles"),
        ]);

        const userData = userRes.data;
        setUser(userData);

        setOrders(
          orderRes.data.map((o: any) => ({
            name: o.bookTitle,
            date: new Date(o.createdAt).toLocaleDateString("vi-VN"),
            total: o.price?.toLocaleString("vi-VN") + "đ",
            status: o.status,
          }))
        );

        const rolesList = rolesRes.data.data || rolesRes.data;
        setAllRoles(rolesList);

        if (userData.roles && userData.roles.length > 0) {
          setSelectedRole(userData.roles[0].name);
        } else if (rolesList.length > 0) {
          setSelectedRole(rolesList[0].name);
        }

      } catch (err) {
        console.error("Lỗi load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [id]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  const isActive = user.status === "ACTIVE";

  return (
    <div className="flex min-h-screen bg-[#f6f6f8] dark:bg-[#101222] text-slate-900 dark:text-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 ml-64">
        {/* Topbar */}
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span>Người dùng</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-white">Chi tiết người dùng</span>
            </div>

          {/* Profile Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md bg-[#1121d4]/10 flex items-center justify-center">
                {user.avatarUrl ? (
                    <img 
                        src={user.avatarUrl} 
                        alt="avatar" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                        alt="avatar" 
                        className="w-full h-full object-cover"
                    />
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>

                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-sm text-slate-500">
                    ID: #{user.id}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isActive
                        ? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    {isActive ? "Đang hoạt động" : "Bị khóa"}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1121d4]/10 text-[#1121d4]">
                    {user.roles?.[0]?.name}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <label className="text-sm font-semibold">Quyền truy cập:</label>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                    {allRoles.map((role) => (
                        <option key={role.name} value={role.name}>
                        {role.name} - {role.description}
                        </option>
                    ))}
                 </select>
                 <button
                 onClick={handleUpdateRole}
                 className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">
                 Lưu quyền
                </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2.5 rounded-xl text-white flex items-center gap-2
                  ${isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                <Lock className="w-4 h-4" />
                {isActive ? "Khóa tài khoản" : "Mở khóa"}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold mb-4">Thông tin cá nhân</h3>

            <p>Email: {user.email}</p>
            <p>Số điện thoại: {user.phone}</p>
            <p>Ngày tham gia: {formatDate(user.createdAt)}</p>
          </div>

          {/* LỊCH SỬ MUA HÀNG */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold">Lịch sử mua hàng</h3>


            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40">
                    <th className="px-6 py-4 text-left text-xs text-slate-500 uppercase">
                      Tên sách
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-slate-500 uppercase">
                      Ngày mua
                    </th>
                    <th className="px-6 py-4 text-right text-xs text-slate-500 uppercase">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-center text-xs text-slate-500 uppercase">
                      Trạng thái
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-slate-500">
                        Không có lịch sử mua hàng
                      </td>
                    </tr>
                  ) : (
                    orders.map((o, i) => (
                      <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="px-6 py-4 font-medium">{o.name}</td>

                        <td className="px-6 py-4 text-slate-500">{o.date}</td>

                        <td className="px-6 py-4 text-right font-semibold">
                          {o.total}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-semibold ${
                              o.status === "SUCCESS"
                                ? "bg-green-100 text-green-600"
                                : o.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {o.status}
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
      </main>
    </div>
  );
}