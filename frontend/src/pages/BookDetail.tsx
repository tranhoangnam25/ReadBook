import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "../services/bookService";
import { useQuery } from "@tanstack/react-query";
import type { BookResponse } from "../types";
import { useEffect } from "react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex text-accent">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="material-symbols-outlined text-sm">
          {i <= rating ? "star" : "star_border"}
        </span>
      ))}
    </div>
  );
}

function ShowBook({ book }: { book: BookResponse }) {
  const navigate = useNavigate();

  // ===== GET REVIEWS =====
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", book.id],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:8080/api/reviews/book/${book.id}`
      );
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  // ===== RELATED BOOKS =====
  const { data: relatedBooks = [] } = useQuery({
    queryKey: ["related"],
    queryFn: async () => {
      const res = await fetch(
        "http://localhost:8080/api/books/recommends"
      );
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const handleBuy = async () => {
  try {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user?.id) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    if (!book?.id) {
      alert("Không có book id");
      return;
    }

    const res = await fetch(
      `http://localhost:8080/api/orders?userId=${user.id}&bookId=${book.id}&price=${book.price}`,
      { method: "POST" }
    );

    const data = await res.json();

    console.log("ORDER RESPONSE =", data);

    const orderId =
      data.orderId ||
      data.id ||
      data.order?.id;

    if (!orderId) {
      alert("orderId undefined");
      return;
    }

    navigate(`/payment/${orderId}/${book.id}`);
  } catch (e) {
    console.error(e);
    alert("Tạo order lỗi");
  }
};

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* LEFT */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="w-full aspect-[2/3] rounded-lg shadow-xl overflow-hidden bg-white">
            <img
              src={book.coverImage}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <p className="text-xs uppercase tracking-widest text-primary/50">
              Price
            </p>
            <p className="text-3xl font-black text-primary">
              ${book.price}
            </p>
          </div>

          <button
            onClick={handleBuy}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90"
          >
            Buy Ebook Now
          </button>

          <div className="flex gap-2">
            <button className="flex-1 bg-white border border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary/5 transition-all">
                        Read Sample
                    </button>

           <button className="px-4 border border-accent bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-8">
          <h1 className="text-4xl md:text-5xl font-black text-primary">
            {book.title}
          </h1>

          <p className="text-xl text-primary/70 mt-1">
            by {book.authorName}
          </p>

          <div className="flex items-center gap-3 mt-2 mb-6">
            <Stars rating={4} />
            <span className="font-bold text-primary">
              4.5
            </span>

            <span className="text-primary/30">|</span>

            <span className="text-sm uppercase text-primary/60">
              {book.category}
            </span>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <h3 className="font-bold mb-2">
              About the Book
            </h3>

            <p className="text-primary/80 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* REVIEWS */}
          <div className="border-t pt-10">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">
                Reader Reviews
              </h3>

              <button className="text-sm font-bold text-accent border-b-2 border-accent/30 hover:border-accent pb-0.5 transition-all">View All Reviews</button>
            </div>

            {/* write review box */}
            <div className="bg-white p-5 rounded-xl border mb-6">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />

                <div>
                  <p className="font-bold text-sm">
                    Share your thoughts
                  </p>

                  <Stars rating={0} />
                </div>
              </div>

              <div className="bg-primary/5 p-3 rounded-lg text-sm">
                You must purchase this ebook to write a review.
              </div>
            </div>

            {/* reviews list */}
            <div className="space-y-6">
              {reviews.map((r: any) => (
                <div key={r.id}>
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300" />

                      <div>
                        <p className="font-bold text-sm">
                          {r.userName || "User"}
                        </p>

                        <Stars rating={r.rating || 5} />
                      </div>
                    </div>

                    <span className="text-xs text-primary/40">
                      recently
                    </span>
                  </div>

                  <p className="text-sm mt-2 italic text-primary/80">
                    "{r.comment}"
                  </p>

                  <div className="flex gap-4 mt-2 text-sm text-primary/60">
                    <button>👍 24</button>
                    <button>Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div className="mt-20">
        <h3 className="text-xl font-bold mb-6">
          Readers also enjoyed
        </h3>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {relatedBooks.map((b: BookResponse) => (
            <div
              key={b.id}
              className="min-w-[160px] cursor-pointer group"
              onClick={() =>
                navigate(`/book-detail/${b.id}`)
              }
            >
              <div className="w-[160px] h-[240px] rounded-lg overflow-hidden shadow-sm bg-white">
                <img
                  src={b.coverImage}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <p className="text-sm font-bold mt-2 truncate">
                {b.title}
              </p>

              <p className="text-xs text-primary/60">
                {b.authorName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function BookDetail() {
  const { id } = useParams();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookService.getBookById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading || !book)
    return (
      <main className="flex justify-center py-8">
        Loading...
      </main>
    );

  return (
    <main className="flex justify-center py-8">
      <div className="max-w-[1100px] w-full px-6">
        <ShowBook book={book} />
      </div>
    </main>
  );
}
