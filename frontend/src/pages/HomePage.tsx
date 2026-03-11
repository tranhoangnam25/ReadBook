export default function HomePage() {
    return (
        <main className="mx-auto w-full max-w-7xl px-6 lg:px-20">
            <section className="py-16 lg:py-24">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-accent">Premium Reading
                                Experience</span>
                            <h2 className="text-5xl font-black leading-tight text-primary lg:text-7xl">
                                Discover Your Next <span className="text-accent">Great Read</span>
                            </h2>
                            <p className="max-w-md text-lg leading-relaxed text-primary/70">
                                Immerse yourself in thousands of curated ebooks from world-className authors. Your next
                                literary adventure begins with a single click.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                className="rounded-lg bg-primary px-8 py-4 text-base font-bold text-white hover:bg-primary/90 transition-all shadow-md">Browse
                                Now</button>
                            <button
                                className="rounded-lg border border-primary/20 px-8 py-4 text-base font-bold hover:bg-primary/5 transition-all">View
                                Bestsellers</button>
                        </div>
                    </div>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
                        <img alt="Collection of modern books on a clean shelf" className="h-full w-full object-cover"
                            data-alt="Collection of minimalist book covers on a shelf"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_AsXHh4HL0eEQL-f6iaZMU1Cnazrpr0_lTF7a_7mVMREUqI1z7fVLSab1ZYO_rRVbuQV1JKu5e1V0ba-F4q_pbCZAsSbO4YL0IcMVfxDeokIVEdYx12CIK2yqVT7C4gMmSj2j6QXl0_JfuyplLFFG6MT1oOrNruNyDJVGuv5T79wgHTcxk4nsSuXEdCKLS2ZmqPA7qeCypWLWcu83HvsbF9oxQItaAPyx-yICKyYnKKAKHcDLaTSmf3oEOz_xIZnNhKVNfKG_eJ3G" />
                    </div>
                </div>
            </section>
            <section className="py-12">
                <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-primary">Find exactly what you're looking for</h3>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <span
                                className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40"
                                data-icon="search">search</span>
                            <input
                                className="w-full rounded-xl border-primary/10 bg-primary/5 py-4 pl-12 pr-4 focus:border-accent focus:ring-accent"
                                placeholder="Search by keyword, genre, or author..." type="text" />
                        </div>
                        <button
                            className="rounded-xl bg-accent px-10 py-4 font-bold text-white hover:bg-accent/90 transition-all">Search</button><button
                                className="rounded-xl border-2 border-accent px-6 py-4 font-bold text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-xl" data-icon="tune">tune</span>
                            Advanced Search
                        </button>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <div className="mb-10 flex items-end justify-between">
                    <h3 className="text-2xl font-bold tracking-tight text-primary">Browse by Genre</h3>
                    <a className="text-sm font-semibold text-accent underline underline-offset-4" href="#">See all
                        genres</a>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                    <div
                        className="group flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-primary/5 bg-white p-6 transition-all hover:border-accent hover:shadow-md dark:bg-zinc-900">
                        <span className="material-symbols-outlined text-4xl text-accent" data-icon="tempest">storm</span>
                        <span className="font-medium">Fiction</span>
                    </div>
                    <div
                        className="group flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-primary/5 bg-white p-6 transition-all hover:border-accent hover:shadow-md dark:bg-zinc-900">
                        <span className="material-symbols-outlined text-4xl text-accent"
                            data-icon="menu_book">menu_book</span>
                        <span className="font-medium">Non-fiction</span>
                    </div>
                    <div
                        className="group flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-primary/5 bg-white p-6 transition-all hover:border-accent hover:shadow-md dark:bg-zinc-900">
                        <span className="material-symbols-outlined text-4xl text-accent"
                            data-icon="fingerprint">fingerprint</span>
                        <span className="font-medium">Mystery</span>
                    </div>
                    <div
                        className="group flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-primary/5 bg-white p-6 transition-all hover:border-accent hover:shadow-md dark:bg-zinc-900">
                        <span className="material-symbols-outlined text-4xl text-accent"
                            data-icon="rocket_launch">rocket_launch</span>
                        <span className="font-medium">Sci-fi</span>
                    </div>
                    <div
                        className="group flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-primary/5 bg-white p-6 transition-all hover:border-accent hover:shadow-md dark:bg-zinc-900">
                        <span className="material-symbols-outlined text-4xl text-accent"
                            data-icon="favorite">favorite</span>
                        <span className="font-medium">Romance</span>
                    </div>
                    <div
                        className="group flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-primary/5 bg-white p-6 transition-all hover:border-accent hover:shadow-md dark:bg-zinc-900">
                        <span className="material-symbols-outlined text-4xl text-accent"
                            data-icon="history_edu">history_edu</span>
                        <span className="font-medium">History</span>
                    </div>
                </div>
            </section>
            <section className="py-16">
                <div className="mb-10 flex items-end justify-between">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold tracking-tight text-primary">Featured Selection</h3>
                        <p className="text-primary/60">Hand-picked titles for your reading list this month.</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent">
                        View All <span className="material-symbols-outlined text-sm"
                            data-icon="arrow_forward">arrow_forward</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="group flex flex-col gap-4">
                        <div
                            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-primary/5 shadow-md transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                            <img alt="Book cover: The Silent Echo" className="h-full w-full object-cover"
                                data-alt="Minimalist book cover featuring a mountain landscape"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl-ugj9lWqOxLqiKO31YlTOWH47pPPVtfx2b-gTUI7QQQ3YUQcgIbKMJZ6n53gv8IgXD4ahXJ7T3wlcWq-nzUrIjaSPTtZVDODPoyKaLqO1I2KhT37AkWEFv1PQjKLgSv2Puv0AiPo9EbwS8l-_K_Mpf1N3FTqsCUVmyA5cn0JC15JCnAHKgwqR7CEzh7sFDVnnX8ZxAZ_RVHjxM15oXmTOl55R3YmF_0ljIEsn9l9gOp7qzLrN6xmTki2cPmWmmymOIue2eGrnfEO" />
                            <div
                                className="absolute bottom-3 right-3 rounded-lg bg-accent px-3 py-1 text-sm font-bold text-white">
                                $12.99</div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-primary">The Silent Echo</h4>
                            <p className="text-sm text-primary/60">Eleanor Vance</p>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                <span className="ml-1 text-xs font-semibold text-primary/40">4.8</span>
                            </div>
                        </div>
                    </div>
                    <div className="group flex flex-col gap-4">
                        <div
                            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-primary/5 shadow-md transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                            <img alt="Book cover: Midnight in Venice" className="h-full w-full object-cover"
                                data-alt="Book cover with architectural sketches of Venice"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrvWJpY5JefYhS0qVY6llK3nRshy5JZIBr7qMJGC7-HcrskmkzK9KyolqVrNhN_DY9EmcT1PKG2_ERsTgiYlk2vT6CLQXyxhpxOzq4QFFOjDtZkXH0JuxUnvrLKQ-56N6pGQlTSSg6Ye4ZGIa6YsKU0vnuDUNLx_TrYyap2BoWziZEsSfKu_MMwaYZeA3McCqyuzWpIyZdutqf3LFXl3CgnWW8gHNCm40AP87UipdQ06H-ZZumIFjxPts1edc87oSlX2x1zTFCaxEb" />
                            <div
                                className="absolute bottom-3 right-3 rounded-lg bg-accent px-3 py-1 text-sm font-bold text-white">
                                $15.50</div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-primary">Midnight in Venice</h4>
                            <p className="text-sm text-primary/60">Julian Barnes</p>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent">star</span>
                                <span className="ml-1 text-xs font-semibold text-primary/40">4.5</span>
                            </div>
                        </div>
                    </div>
                    <div className="group flex flex-col gap-4">
                        <div
                            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-primary/5 shadow-md transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                            <img alt="Book cover: Beyond the Horizon" className="h-full w-full object-cover"
                                data-alt="Abstract ocean wave book cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK7s7T7eVmzI7UsUjsPHTzlNIm9EuYiydcepA1qD5_6Uh77i99JXX6RikcuKXPByt76VEhMPzaJvRQ7oeYz9aZjLQY5hcUjWtCCgZW6IvchTOpp7kFchXpFH3UiO99yS9hTt11TtFUEmQV6dP-vfcUs0ETW0UT4aWL-lw8lPtnW_kH9e-73Vaa4-HOhdNjoReHeCoNDtwWu664AxcBcP5R5a_rKhcbY6VMqdSKPqlZLC-S3txLRBvVZ8hw9ZOTP_HK3TiCUEPrXFQ_" />
                            <div
                                className="absolute bottom-3 right-3 rounded-lg bg-accent px-3 py-1 text-sm font-bold text-white">
                                $10.99</div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-primary">Beyond the Horizon</h4>
                            <p className="text-sm text-primary/60">Sarah Jenkins</p>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="ml-1 text-xs font-semibold text-primary/40">4.9</span>
                            </div>
                        </div>
                    </div>
                    <div className="group flex flex-col gap-4">
                        <div
                            className="relative aspect-[3/4] overflow-hidden rounded-xl bg-primary/5 shadow-md transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                            <img alt="Book cover: The Last Alchemist" className="h-full w-full object-cover"
                                data-alt="Elegant golden geometry on dark book cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD440x3DzAeaxAbuYw2iOKbVtWhq49ClBfTDas0ojVctIbprfuVOS7K83nQqKNoIqNMD1efY-ewZIPdiJBEWT9Cz7uVr1EGrHc4-dtKPiDJyU1QJVv-0YaDDp0WyiyPgupVgCvKSLKk-22up-Wcl2-PWt88Ynd0aQRrihWR8Aj0QSnR5dlFsvSETTKwJMfpdJLnnbJQegqzpIatZXuYKN6Y3B3RrlfeCn-M8wN1MHx41C9DP9rLEpHGTPSL2LF0ylxXHV5aReaCXz_h" />
                            <div
                                className="absolute bottom-3 right-3 rounded-lg bg-accent px-3 py-1 text-sm font-bold text-white">
                                $14.00</div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-primary">The Last Alchemist</h4>
                            <p className="text-sm text-primary/60">Marcus Thorne</p>
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="material-symbols-outlined text-sm text-accent"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                <span className="ml-1 text-xs font-semibold text-primary/40">4.7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}