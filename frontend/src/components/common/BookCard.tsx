
import { Link } from 'react-router-dom';
import type { BookResponse } from '../../types'

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        let icon = "star";
        if (rating >= i) icon = "star";
        else if (rating >= i - 0.5) icon = "star_half";
        stars.push(
            <span
                key={i}
                className="material-symbols-outlined text-sm text-accent"
                style={{ fontVariationSettings: "'FILL' 1" }}
            >
                {icon}
            </span>
        );

    }
    return stars;
};

export default function BookCard(book: BookResponse) {
    return (
        <Link to={`/book-detail/${book.id}`}>
            <div className="group flex flex-col gap-4">
                <div
                    className="relative aspect-[3/4] overflow-hidden rounded-xl bg-primary/5 shadow-md transition-transform group-hover:-translate-y-2 group-hover:shadow-xl">
                    <img alt={book.title}
                        src={book.coverImage}
                        className="h-full w-full object-cover" />
                    <div className="absolute bottom-3 right-3 rounded-lg bg-accent px-3 py-1 text-sm font-bold text-white">
                        {book.price.toFixed(2)}
                    </div>
                </div>
                <div className="space-y-1">
                    <h4 className="text-lg font-bold text-primary">{book.title}</h4>
                    <p className="text-sm text-primary/60">{book.authorName}</p>
                    <div className="flex items-center gap-1">
                        {renderStars(book.previewPercentage / 20)}
                        <span className="ml-1 text-xs font-semibold text-primary/40">{book.previewPercentage / 20}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}