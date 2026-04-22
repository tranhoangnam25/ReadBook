import { useParams } from "react-router-dom"
import { bookService } from "../services/bookService";
import { useQuery } from "@tanstack/react-query";
import type { BookResponse } from "../types";
import { useEffect } from "react";

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        let icon = "star";
        let fill = 0;
        if (rating >= i) {
            icon = "star";
            fill = 1;
        } else if (rating >= i - 0.5) {
            icon = "star_half";
            fill = 0;
        }
        stars.push(
            <span
                key={i}
                className="material-symbols-outlined text-sm text-accent"
                style={{ fontVariationSettings: `'FILL' ${fill}` }}
            >
                {icon}
            </span>
        );
    }
    return stars;
};

function ShowBook({ book }: { book: BookResponse }) {
    return (<div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 flex flex-col gap-6">
            <div className="w-full aspect-[2/3] rounded-lg shadow-xl overflow-hidden bg-white">
                <img alt="Minimalist book cover design" className="w-full h-full object-cover" data-alt="Minimalist dark blue book cover with gold lettering" src={book.coverImage} />
            </div>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-[10px] uppercase tracking-widest text-primary/50 font-bold mb-1">Price</p>
                <p className="text-3xl font-black text-primary">${book.price}</p>
            </div>
            <div className="flex flex-col gap-3">
                <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"><span className="material-symbols-outlined">shopping_cart</span> Buy Ebook Now</button>
                <div className="flex gap-2">
                    <button 
                        onClick={() => window.location.href = `/reading/${book.id}`}
                        className="flex-1 bg-white border border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary/5 transition-all">
                        Read Book
                    </button>
                    <button className="px-4 border border-accent bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>
                </div>
            </div>
        </div>
        <div className="md:col-span-8">
            <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-4xl md:text-5xl font-black text-primary leading-tight tracking-tight">{book.title}</h1>
                <p className="text-xl text-primary/70 font-medium">by {book.authorName}</p>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-accent">
                        {renderStars(book.previewPercentage / 20)}
                        <span className="text-sm font-bold text-primary ml-1">{book.previewPercentage / 20}</span>
                    </div>
                    <span className="text-primary/30">|</span>
                    <p className="text-sm font-medium text-primary/60 uppercase tracking-widest">{book.category}</p>
                </div>
            </div>
            <div className="prose prose-slate max-w-none text-primary/80 leading-relaxed mb-10">
                <h3 className="text-lg font-bold text-primary mb-3">About the Book</h3>
                <p className="mb-4">{book.description}</p>
            </div>
            <div className="border-t border-primary/10 pt-10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-primary">Reader Reviews</h3>
                    <button className="text-sm font-bold text-accent border-b-2 border-accent/30 hover:border-accent pb-0.5 transition-all">View All 1.2k Reviews</button>
                </div>
                <div className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" data-alt="User profile circular avatar" style={
                            { backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCS8gXqKccWYUJp95iyHb52s5SvUFi5laMAlB5IDIIyB5GE2T45NowtFZaRE9GeQ8dnhwAaQl2CJPtWPBhBFgg8JbFP_BDTokbcAmalXDduwvWHr3dXU5N9IGbiydA_AmfIH0wiyaVzEU37yqe43iyj5WXdlcP4s6bJeDbUzp0tGZtCIHZB2vsEGjCrPa7zjHN4douuLwYwPn50TAXy6AP48VdXCBv0fEKVIWHuFy17TCHXDZy8PElBo_GysWFeFief7x3xsbJsesqB')" }} ></div>
                        <div>
                            <p className="font-bold text-primary">Share your thoughts, Alex</p>
                            <div className="flex items-center gap-1 text-primary/30 mt-1">
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                                <span className="material-symbols-outlined">star</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary/60 text-xl">info</span>
                        <p className="text-sm font-medium text-primary">You must purchase this ebook to write a review.</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" data-alt="Female profile picture" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsSAydCZZfLf2YtKp4VEkHhw2v32NvVElHrzsvjWJNk6W7aENSaZYrHeqKOAd8neSuhOD7kTBNnYvBSd3tD8qIMp4Nor15SxG9Ki7WQhpPuRi361RELHUKn1l6vD1O0qppl2pczm64n373r6aKTAeMqHYOaWF9MnWAEyYp3QDHhwCxzvA-HBqvO9E_IILXpu3iRpT-1aSgJoOV-cufPIbqde-EyjNZJkMhS6ompk3TG7XA0W4djztlKvBL3BdhMs40A-VWYMZYElmo')" }}></div>
                                <div>
                                    <p className="text-sm font-bold text-primary">Sarah Jenkins</p>
                                    <div className="flex text-accent">
                                        <span className="material-symbols-outlined text-xs fill-1">star</span>
                                        <span className="material-symbols-outlined text-xs fill-1">star</span>
                                        <span className="material-symbols-outlined text-xs fill-1">star</span>
                                        <span className="material-symbols-outlined text-xs fill-1">star</span>
                                        <span className="material-symbols-outlined text-xs fill-1">star</span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-primary/40">2 days ago</span>
                        </div>
                        <p className="text-sm text-primary/80 italic leading-relaxed">"This book completely changed how I view my own 'what-ifs'. A poignant and beautiful journey through life's infinite possibilities."</p>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-primary/60 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">thumb_up</span>
                                <span className="text-xs font-bold">24</span>
                            </button>
                            <button className="flex items-center gap-1 text-primary/60 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">reply</span>
                                <span className="text-xs font-bold">Reply</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
export default function BookDetail() {
    const { id } = useParams();
    const {
        data: book,
        isLoading: loadingBook
    } = useQuery({
        queryKey: ["book", id],
        queryFn: () => bookService.getBookById(Number(id)),
        enabled: !!id && !isNaN(Number(id)),
    });
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <main className="flex flex-1 justify-center py-8">
            <div className="layout-content-container flex flex-col max-w-[1100px] flex-1 px-6">
                {
                    loadingBook ? (
                        <div className="h-64 rounded-xl bg-primary/10 animate-pulse" />
                    ) : book ? (
                        <ShowBook book={book} />
                    ) : (
                        <p className="col-span-full text-center text-primary/40 py-8"> Chưa có sách nào </p>
                    )
                }


                <div className="mt-20">
                    <h3 className="text-2xl font-bold text-primary mb-8">Readers also enjoyed</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                        <div className="flex flex-col gap-2 group cursor-pointer">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-sm bg-white mb-2">
                                <img alt="Book cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Geometric abstract book cover art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBQujZNOyPAyTNf8qBwHt5oP9e3ugFdVpBAyGFt01pe6-UrfGWqYU85TW1HAU1zI53yWT04dRDGeMHvQQAIGQuq2NWIeOF3M6uqnM7v2LzdZ18pCKOTtfMDp-ETSq_M5Xri6R1fRm_HRVHwDCNwFsEIQWRnH6td_XgE-4hlxcPiyVNF-98Hnu7_U1uiuwBYkxTC7g8QfXhXlBGmnwYxPXrBKAybgXO-DOuvzCwsE-_Y8Q-V6GK_5lYBFknKvuN3kSV92-NRqNxA_gs" />
                            </div>
                            <p className="text-sm font-bold text-primary truncate">Circe</p>
                            <p className="text-xs text-primary/60">Madeline Miller</p>
                        </div>
                        <div className="flex flex-col gap-2 group cursor-pointer">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-sm bg-white mb-2">
                                <img alt="Book cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Classic vintage book cover design" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDao6bXICQBsgieW71WMGW7N7cYW6uqgHvNhF2eqPU5E4ZNRWxbK4Q-K2-0nQCuYUpUG8f1W6a_eA9Gv1OmbWT_oO-qHyilVzYL1iDOTYIJa5LIlhUO69uMW8W30KZ0aUARc1NGkCBYfYpk9ORxo7jPhaVhE8hlKyxlwZB5F5_2sQkkYf2BABVvAtdl5foUBZ7QMUNnX4ZyDhG8n4qV2NK5ov-TCrg5VvGM2LVlXWumk66Aoze2v5ZFuATPVwfDuTek2Fk-qXX5dD8j" />
                            </div>
                            <p className="text-sm font-bold text-primary truncate">Normal People</p>
                            <p className="text-xs text-primary/60">Sally Rooney</p>
                        </div>
                        <div className="flex flex-col gap-2 group cursor-pointer">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-sm bg-white mb-2">
                                <img alt="Book cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Minimal cover with hand drawing" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBklp5J5mdPorYU9tfM3p3ITPVVrXw7coH5aAMWAHH-3Hp06DJbWJ2UYlpK8pNnTDWKUPMdVZHfmMGowvHJbVWVQsfo1Ebf86p3R40PA_NNOKyaYXlnpGp8glYnprgZ_mboimbR2H_MinEYAXw7EJBfuEGR7HkHQEsn4FtUZXD8-SZKH8dCMOzEmP987m-cUUbhW28IEmEQ8MHHIwtXTWwjrvbAG6GONrOWPYmeGujueymAveadFhrHJBVDp9jFEuLTibjpnZenZoT5" />
                            </div>
                            <p className="text-sm font-bold text-primary truncate">The Alchemist</p>
                            <p className="text-xs text-primary/60">Paulo Coelho</p>
                        </div>
                        <div className="flex flex-col gap-2 group cursor-pointer">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-sm bg-white mb-2">
                                <img alt="Book cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Colorful abstract book cover pattern" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRPIybdz6lmuABPe_dZjUZKMkom-YCnqx_fwhWOtG88cLAW4iI3ko_UlzWct2nhjA4fa7YQA9XxGtbm8cyGHw8H5YGOtVodvmi0USMCJzeA9XeP_p6n5ad7MRODFCXsyZnG7DqmdUqXKtupSkI1shX0K3Z2E6IzBDTD_-6RUKupbE7n18f3sl0gLywEl41Ab9V5sixIYgMRfXhIjiGjekVRT0NbqlJbighicDVmZi5B5o7r6eqzPa2fmUrEje7izaoBLdW5mQUz7_-" />
                            </div>
                            <p className="text-sm font-bold text-primary truncate">Eleanor Oliphant</p>
                            <p className="text-xs text-primary/60">Gail Honeyman</p>
                        </div>
                        <div className="flex flex-col gap-2 group cursor-pointer hidden md:flex">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-sm bg-white mb-2">
                                <img alt="Book cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-alt="Dark moody nature book cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBiDq8bOh-NkrYQtyFrSNe5PvjtQa4DTWa-oC29oOJ8w5v1nEBfyvur353yDbD1SJ3dGV_Tf1SvIWupE2jg63azcrVgRk8LKiYPAt9BzZpsToJe5t0giV41OxPnJ7mIrzYJXNHpsjZ7_bmUO0eIkwUmz9jEXtuuaS8-G-cd-5Acy8hNyBtEpgYb_BQ9HyJSTvhTlzDk-GFojqBiA22_CuHyGwO1M3Eke9M9e0vLeCS7OKEDR80jXcScDzkmMWmf-O1iY9tzU2zhSAQ" />
                            </div>
                            <p className="text-sm font-bold text-primary truncate">Where the Crawdads Sing</p>
                            <p className="text-xs text-primary/60">Delia Owens</p>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    )
}