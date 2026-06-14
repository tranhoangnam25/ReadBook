
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';


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
import ReadingView from './pages/ReadingView';
import LibraryPage from './pages/LibraryPage';
import CollectionPage from './pages/CollectionPage';
import DashBoard from './pages/Dashboard';
import OrderManagement from './pages/admin/OrderManager';
import ReviewManager from './pages/admin/ReviewManager';
import BookInventory from './pages/admin/BookInventory';
import ChatBot from "./components/common/ChatBot";
import ManageUser from './pages/admin/ManageUser';
import UserDetail from './pages/admin/UserDetail';
import ProtectedRoute from './components/common/ProtectedRoute';

import ManageRole from './pages/admin/ManageRole';
import ManagePermission from './pages/admin/ManagePermission';
import CreateRole from './pages/admin/CreateRole';
import UpdateRole from './pages/admin/UpdateRole';

import SalePage from './pages/SalePage';
import SaleManager from './pages/admin/ManagerSale';

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


  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };
  useEffect(() => {
    const handleLogout = () => {
      setIsLoggedIn(false);
      setIsLoginOpen(true);
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
                isLoggedIn={isLoggedIn}
                onOpenRegister={() => setIsRegisterOpen(true)}
                onOpenLogin={() => setIsLoginOpen(true)}
              />
            }
          >
            <Route
              index
              element={isLoggedIn ? <HomePageUser /> : <HomePage />}
            />
            <Route path="/collection/:id" element={<CollectionPage />} />
            <Route path="/update" element={<UserUpdatePage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/book-detail/:id" element={<BookDetail />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/hompage2" element={<HomePage2 />} />
            <Route path="/payment/:orderId/:bookId" element={<PaymentPage />} />
            <Route path="/book-detail/all-comments/:id" element={<AllComments />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/sale" element={<SalePage />} />

          </Route>

          <Route path="/admin" element={<DashBoard />} />

          <Route element={<ProtectedRoute allowedPermissions={['MANAGE_ORDER']} />}>
            <Route path="/admin/orders" element={<OrderManagement />} />
          </Route>

          <Route element={<ProtectedRoute allowedPermissions={['MANAGE_BOOK']} />}>
            <Route path="/admin/books" element={<BookInventory />} />
          </Route>
          <Route element={<ProtectedRoute allowedPermissions={['MANAGE_REVIEW']} />}>
            <Route path="/admin/reviews" element={<ReviewManager />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['ADM']} />}>
            <Route path="/admin/users" element={<ManageUser />} />
            <Route path="/admin/users/:id" element={<UserDetail />} />
            <Route path="/admin/roles" element={<ManageRole />} />
            <Route path="/admin/permissions" element={<ManagePermission />} />
            <Route path="/admin/create-role" element={<CreateRole />} />
            <Route path="/admin/update-role/:id" element={<UpdateRole />} />
          </Route>
          <Route element={<ProtectedRoute allowedPermissions={['MANAGE_SALES']} />}>
            <Route path="/admin/sale-manager" element={<SaleManager />} />
          </Route>
          <Route path="/reading/:bookId" element={<ReadingView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

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

        <ChatBot />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
