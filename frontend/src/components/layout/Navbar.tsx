export default function Navbar() {

    return (
        <header
            className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 backdrop-blur-md dark:bg-background-dark/80 px-6 lg:px-20 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2 text-primary dark:text-accent">
                        <span className="material-symbols-outlined text-3xl" data-icon="auto_stories">auto_stories</span>
                        <h1 className="text-xl font-bold tracking-tight">Lumina Books</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a className="text-sm font-medium hover:text-accent transition-colors" href="#">Explore</a>
                        <a className="text-sm font-medium hover:text-accent transition-colors" href="#">My Library</a>
                        <a className="text-sm font-medium hover:text-accent transition-colors" href="#">Shop</a>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end gap-6">
                    <div className="relative hidden lg:flex items-center gap-2 w-full max-w-md">
                        <span
                            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-xl"
                            data-icon="search">search</span>
                        <input
                            className="w-full rounded-lg border-none bg-primary/5 py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-accent"
                            placeholder="Search titles..." type="text" /><button
                                className="whitespace-nowrap rounded-lg border border-[#2C3E50] px-3 py-1.5 text-xs font-medium text-[#2C3E50] hover:bg-primary/5 transition-colors">Advanced
                            Search</button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="px-4 py-2 text-sm font-semibold hover:text-accent transition-colors">Login</button>
                        <button
                            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-sm">Sign
                            Up</button>
                    </div>
                </div>
            </div>
        </header>
    )
}