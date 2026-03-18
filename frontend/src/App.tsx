import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from "./pages/HomePage"
import Layout from './components/layout/Layout'
import RegisterPage from './pages/registerPage'
import { useState } from 'react'

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

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout onOpenRegister={() => setIsRegisterOpen(true)} />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        {isRegisterOpen && (
            <RegisterPage onClose={() => setIsRegisterOpen(false)} />
        )}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
