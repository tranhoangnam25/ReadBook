import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

interface LayoutProps {
    onOpenRegister: () => void;
    onOpenLogin: () => void;
    isLoggedIn: boolean;
}

export function Layout({onOpenRegister, onOpenLogin, isLoggedIn}: LayoutProps) {
    return (
        <div className="min-h-screen bg-parchment flex flex-col font-body">
            <Navbar
                onOpenRegister={onOpenRegister}
                onOpenLogin={onOpenLogin}
                isLoggedIn={isLoggedIn}
            />
            <main className="flex-1">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}
