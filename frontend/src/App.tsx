import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from "./pages/HomePage"
import Layout from './components/layout/Layout'
import RegisterPage from './pages/registerPage'
import { useState } from 'react'
import LoginPage from "./pages/loginPage.tsx";
import BookDetail from './pages/BookDetail.tsx'
import ShopPage from './pages/Shop.tsx'
import HomePage2 from './pages/HomePage2.tsx'
import HomePageUser from './pages/HomePageUser.tsx'
import PaymentPage from './pages/PaymentPage.tsx'
import ReadingView from './pages/ReadingView.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function App() {

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/"
            element={<Layout
              onOpenRegister={() => setIsRegisterOpen(true)}
              onOpenLogin={() => setIsLoginOpen(true)}
            />}>

            <Route index element={<HomePage />} />
            <Route path="/home-page-user" element={<HomePageUser />} />
            <Route path="/book-detail/:id" element={<BookDetail />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/hompage2" element={<HomePage2 />} />
            <Route path="/payment/:orderId/:bookId" element={<PaymentPage />} />
            <Route path="/readingView" element={<ReadingView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {isRegisterOpen && <RegisterPage
          onClose={() => setIsRegisterOpen(false)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />}
        {isLoginOpen && <LoginPage
          onClose={() => setIsLoginOpen(false)}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />}

      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
