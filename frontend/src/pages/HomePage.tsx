import { useQuery } from "@tanstack/react-query";
import { bookService } from "../services/bookService";
import type { BookResponse } from "../types";
import BookCard from "../components/common/BookCard";

export default function HomePage() {
    const {
        data: bestSellers,
        isLoading: loadingBestSellers
    } = useQuery({
        queryKey: ["bestsellers"],
        queryFn: () => bookService.getBestSellers(4),
    });
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
                            src="https://cdn2.fptshop.com.vn/unsafe/800x0/hinh_nen_ke_sach_1_cb32b91b04.jpg" />
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
                    {loadingBestSellers ? (
                        // Hiển thị skeleton khi đang tải
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-64 rounded-xl bg-primary/10 animate-pulse" />
                        ))
                    ) : bestSellers?.length ? (
                        // BookCard là con TRỰC TIẾP của grid
                        bestSellers.map((book: BookResponse) => (
                            <BookCard key={book.id} {...book} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-primary/40 py-8">
                            Chưa có sách nào
                        </p>
                    )
                    }
                </div>
            </section>
        </main>
    )
}