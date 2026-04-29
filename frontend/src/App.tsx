/* cspell:disable */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// Chú ý kiểm tra chính xác tên file hoa/thường (LoginPage vs loginPage)
import HomePage from "./pages/HomePage";
import { Layout } from './components/layout/Layout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from "./pages/LoginPage";
import BookDetail from './pages/BookDetail';
import ShopPage from './pages/Shop';
import HomePage2 from './pages/HomePage2';
import HomePageUser from './pages/HomePageUser';
import PaymentPage from './pages/PaymentPage';
import UserUpdatePage from "./pages/UserUpdatePage";
import ChangePassword from "./pages/ChangePassword";
import AllComments from "./pages/AllComments";
import ReadingViewer from './pages/ReadingView';
import LibraryPage from './pages/LibraryPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Khởi tạo state đăng nhập từ localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false); // Đóng modal khi thành công
  };
    useEffect(() => {
      const handleLogout = () => {
        setIsLoggedIn(false);
        setIsLoginOpen(true); // 🔥 mở modal login luôn
      };

      window.addEventListener("logout", handleLogout);

      return () => window.removeEventListener("logout", handleLogout);
    }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                isLoggedIn={isLoggedIn} // Truyền vào để Layout ẩn/hiện nút Login
                onOpenRegister={() => setIsRegisterOpen(true)}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            }
          >
            {/* GỘP CHUNG VÀO ĐÂY: Index route duy nhất cho trang chủ */}
            <Route
              index
              element={isLoggedIn ? <HomePageUser /> : <HomePage />}
            />

            <Route path="/users/me/profile" element={<UserUpdatePage />} />
            <Route path="/users/me/change-password" element={<ChangePassword />} />
            <Route path="/users/me/update/:id" element={<UserUpdatePage />} />
            <Route path="/book-detail/:id" element={<BookDetail />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/hompage2" element={<HomePage2 />} />
            <Route path="/payment/:orderId/:bookId" element={<PaymentPage />} />
            <Route path="/book-detail/all-comments/:id" element={<AllComments />} />
            <Route path="/library" element={<LibraryPage />} />
          </Route>

          <Route path="/reading/:bookId" element={<ReadingViewer />} />

          {/* Chuyển hướng mọi đường dẫn lạ về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Portals / Modals */}
        {isRegisterOpen && (
          <RegisterPage
            onClose={() => setIsRegisterOpen(false)}
            onOpenLogin={() => {
              setIsRegisterOpen(false);
              setIsLoginOpen(true);
            }}
          />
        )}

        {isLoginOpen && (
          <LoginPage
            onClose={() => setIsLoginOpen(false)}
            onOpenRegister={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true);
            }}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;