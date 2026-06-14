import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import AdminNavbar from './AdminNavbar'

interface LayoutProps {
    onOpenRegister: () => void;
    onOpenLogin: () => void;
    isLoggedIn: boolean;
}

export function Layout({onOpenRegister, onOpenLogin, isLoggedIn}: LayoutProps) {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-parchment flex flex-col font-body">
            {isAdminPage ? (
                <AdminNavbar />
            ) : (
                <Navbar
                    onOpenRegister={onOpenRegister}
                    onOpenLogin={onOpenLogin}
                    isLoggedIn={isLoggedIn}
                />
            )}
            <main className="flex-1">
                <Outlet context={{ onOpenLogin, onOpenRegister }} />
            </main>
            {!isAdminPage && <Footer/>}
        </div>
    )
}
