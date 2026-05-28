import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  allowedPermissions?: string[];
}

const ProtectedRoute = ({ allowedRoles, allowedPermissions }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  // 1. Kiểm tra đăng nhập
  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userStr);
  const userRoles = user.roles || [];

  // 2. Kiểm tra quyền theo Role (Nếu có yêu cầu)
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = userRoles.some((role: any) => allowedRoles.includes(role.name));
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  // 3. Kiểm tra quyền theo Permission (Nếu có yêu cầu)
  if (allowedPermissions && allowedPermissions.length > 0) {
    // Thu thập tất cả permission từ các role của user
    const userPermissions: string[] = userRoles.flatMap((role: any) => 
      role.permissions ? role.permissions.map((p: any) => p.name) : []
    );

    // Kiểm tra xem user có ít nhất một trong các permission được yêu cầu không
    const hasPermission = allowedPermissions.some(p => userPermissions.includes(p));
    
    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  // Nếu vượt qua tất cả kiểm tra, cho phép truy cập
  return <Outlet />;
};

export default ProtectedRoute;
