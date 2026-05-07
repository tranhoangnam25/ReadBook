import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { bookService } from "../services/bookService";
import { useQuery } from "@tanstack/react-query";
import type { BookResponse } from "../types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

function Stars({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let icon = "star";
    let fill = 0;
    if (rating >= i) {
      icon = "star";
      fill = 1;
    } else if (rating >= i - 0.5) {
      icon = "star_half";
      fill = 1;
    }
    stars.push(
      <span
        key={i}
        className="material-symbols-outlined text-sm"
        style={{ fontVariationSettings: `'FILL' ${fill}` }}
      >
        {icon}
      </span>
    );
  }
  return <div className="flex text-accent">{stars}</div>;
}

function ShowBook({ book }: { book: BookResponse }) {
  const [showForm, setShowForm] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
const location = useLocation();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
const [editingId, setEditingId] = useState<number | null>(null);

const user = JSON.parse(localStorage.getItem("user") || "null");
  
  const { data: reviewPage, refetch } = useQuery({
  queryKey: ["reviews", book.id],
  queryFn: async () => {
    const res = await api.get(`/reviews/book/${book.id}`);
    return res.data;
  },
});

const reviews = reviewPage?.content || [];

const myReview = user
  ? reviews.find((r: any) => r.userId === user.id)
  : null;
useEffect(() => {
  if (!showForm) return;

  if (myReview) {
    setEditingId(myReview.id);
    setRating(myReview.rating);
    setComment(myReview.comment);
  } else {
    setEditingId(null);
    setRating(5);
    setComment("");
  }
}, [myReview, showForm]);
const handleSubmitReview = async () => {
  try {
    if (!user?.id) {
      onOpenLogin();
      return;
    }

    if (!comment.trim()) {
      alert("Nhập nội dung review");
      return;
    }

    if (!isPurchased) {
      alert("Bạn phải mua sách trước");
      return;
    }

    if (editingId) {
      await api.put(
        `/reviews/${editingId}`,
        {
          rating,
          comment,
        },
        {
          params: {
            userId: user.id,
          },
        }
      );

      alert("Cập nhật review thành công!");
    } else {
      await api.post(
        `/reviews`,
        {
          rating,
          comment,
        },
        {
          params: {
            userId: user.id,
            bookId: book.id,
          },
        }
      );

      alert("Đăng review thành công!");
    }

    await refetch();

    setShowForm(false);
  } catch (e: any) {
  console.error("ERROR =", e);

  alert(
    e.response?.data?.message ||
    e.response?.data ||
    "Lỗi khi gửi review"
  );
}
};
const handleDelete = async (reviewId: number) => {
  try {
    await api.delete(`/reviews/${reviewId}`, {
      params: { userId: user.id },
    });

    await refetch();

    setEditingId(null);
    setRating(5);
    setComment("");
    setShowForm(false);

    alert("Xóa review thành công");
  } catch (e) {
    console.error(e);
    alert("Xóa thất bại");
  }
};
const handleEdit = (r: any) => {
  setEditingId(r.id);
  setRating(r.rating);
  setComment(r.comment);
   setShowForm(true);
};

  
  const { data: relatedBooks = [] } = useQuery({
    queryKey: ["related"],
    queryFn: async () => {
      const res = await api.get("/books/recommends");
      return res.data;
    },
  });

  const { onOpenLogin } = useOutletContext<{ onOpenLogin: () => void }>();

  const handleBuy = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user?.id) {
        onOpenLogin();
        return;
      }

      if (!book?.id) {
        alert("Không có book id");
        return;
      }

      const res = await api.post("/orders", null, {
        params: {
          userId: user.id,
          bookId: book.id,
          price: book.price
        }
      });

      const data = res.data;

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
// check purchased
useEffect(() => {
  const checkPurchased = async () => {
    try {
      if (!user?.id || !book?.id) return;

      const res = await api.get("/orders/check", {
        params: {
          userId: user.id,
          bookId: book.id,
        },
      });

      setIsPurchased(res.data === true || res.data?.purchased === true);
    } catch (err) {
      console.error("Check purchase error:", err);
    }
  };

  checkPurchased();
}, [book?.id]);


// load review của chính mình vào form

useEffect(() => {
  const query = new URLSearchParams(location.search);
  const payment = query.get("payment");

  if (payment === "success") {
  setIsPurchased(true);
  setShowForm(true);
}
}, [location.search]);
function StarPicker({ rating, setRating }: any) {
  return (
    <div className="flex gap-1 cursor-pointer">
      {[1,2,3,4,5].map((i) => (
        <span
          key={i}
          onClick={() => setRating(i)}
          className="material-symbols-outlined text-xl"
          style={{
            fontVariationSettings: `'FILL' ${i <= rating ? 1 : 0}`
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {}
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
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
            </p>
          </div>

          {isPurchased ? (
            <button
              onClick={() => navigate(`/reading/${book.id}`)}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90"
            >
              Read Book
            </button>
          ) : (
            <button
              onClick={handleBuy}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90"
            >
              Buy Ebook Now
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/reading/${book.id}?isSample=true`)}
              className="flex-1 bg-white border border-primary text-primary py-3 rounded-lg font-bold hover:bg-primary/5 transition-all"
            >
              Read Sample
            </button>

           <button className="px-4 border border-accent bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-white transition-all">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>
          </div>
        </div>

        {}
        <div className="md:col-span-8">
          <h1 className="text-4xl md:text-5xl font-black text-primary">
            {book.title}
          </h1>

          <p className="text-xl text-primary/70 mt-1">
            by {book.authorName}
          </p>

          <div className="flex items-center gap-3 mt-2 mb-6">
            <Stars rating={book.averageRating || 0} />
            <span className="font-bold text-primary">
              {book.averageRating || 0}
            </span>

            <span className="text-primary/30">|</span>

            <span className="text-sm uppercase text-primary/60">
              {book.category}
            </span>
          </div>

          {}
          <div className="mb-10">
            <h3 className="font-bold mb-2">
              About the Book
            </h3>

            <p className="text-primary/80 leading-relaxed">
              {book.description}
            </p>
          </div>

          {}
          <div className="border-t pt-10">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">
                Reader Reviews
              </h3>

              <button
              onClick={() => navigate(`/book-detail/all-comments/${book.id}`)}
              className="text-sm font-bold text-accent border-b-2 border-accent/30 hover:border-accent pb-0.5 transition-all">View All Reviews</button>
            </div>

            {}
            <div className="bg-white p-5 rounded-xl border mb-6">
  {isPurchased ? (
    <>
      {!showForm && !myReview && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Write Review
        </button>
      )}

      {!showForm && myReview && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-primary/70">
            Bạn đã review sách này
          </p>

          <button
            onClick={() => {
              setShowForm(true);
              handleEdit(myReview);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Edit Review
          </button>
        </div>
      )}

      {showForm && (
        <>
          <div className="flex gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />

            <div>
              <p className="font-bold text-sm">
                {editingId ? "Update your review" : "Write your review"}
              </p>
            </div>
          </div>

          <StarPicker
            rating={rating}
            setRating={setRating}
          />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full border rounded-lg p-3 text-sm mb-3 mt-3"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              className="bg-primary text-white px-4 py-2 rounded-lg"
            >
              {editingId
                ? "Update Review"
                : "Submit Review"}
            </button>

            <button
              onClick={() => {
                setShowForm(false);

                if (!myReview) {
                  setComment("");
                  setRating(5);
                }
              }}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  ) : (
    <div className="bg-primary/5 p-3 rounded-lg text-sm">
      You must purchase this ebook to write a review.
    </div>
  )}
</div>

            {}
            <div className="space-y-6">
  {reviews.map((r: any) => (
    <div key={r.id}>
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300" />

          <div>
            <p className="font-bold text-sm">
              {r.fullName || r.username || "Guest Reader"}
            </p>

            <Stars rating={r.rating || 5} />
          </div>
        </div>

        <span className="text-xs text-primary/40">
          recently
        </span>
      </div>

      {/* 👇 COMMENT */}
      <p className="text-sm mt-2 italic text-primary/80">
        "{r.comment}"
      </p>

      {/* 👇 THÊM ĐOẠN NÀY Ở ĐÂY */}
      {user?.id === r.userId && (
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => handleEdit(r)}
            className="text-blue-500 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(r.id)}
            className="text-red-500 text-sm"
          >
            Delete
          </button>
        </div>
      )}

      {/* optional */}
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

      {}
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
  const navigate = useNavigate();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => bookService.getBookById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading)
    return (
      <main className="flex justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary/60 font-medium">Đang tải thông tin sách...</p>
        </div>
      </main>
    );

  if (!book)
    return (
      <main className="flex justify-center py-20">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-5xl text-primary/20 mb-4">book_off</span>
          <h2 className="text-2xl font-bold text-primary mb-2">Không tìm thấy sách</h2>
          <p className="text-primary/60 mb-8">Cuốn sách bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
          >
            Quay lại trang chủ
          </button>
        </div>
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
