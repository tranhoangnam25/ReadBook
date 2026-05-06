import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

type Review = {
  id: number;
  userId: number;
  rating: number;
  comment: string;
};

type Book = {
  id: number;
  title: string;
  price: number;
  description: string;
  coverImage: string;
  authorName: string;
  category: string;
};

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  
  useEffect(() => {
    if (!id) return;

    
    api.get(`/books/${id}`)
      .then(res => setBook(res.data));

    
    api.get(`/reviews/book/${id}`)
      .then(res => setReviews(res.data));

    
    api.get(`/books`, {
      params: { page: 0, size: 10 }
    })
      .then(res => {
        const books = res.data.content || [];
        const filtered = books.filter(
          (b: Book) => b.id != Number(id)
        );
        setRelatedBooks(filtered.slice(0, 5));
      });

  }, [id]);

  
  const handleBuy = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập");
      navigate("/login");
      return;
    }

    const res = await api.post("/orders", null, {
        params: {
          userId: user.id,
          bookId: id,
          price: book?.price
        }
      });

    const data = res.data;
    const orderId = data.orderId || data.id;

    navigate(`/payment/${orderId}/${id}`);
  };

  
  const handleSubmitReview = async () => {
    if (!user) return alert("Login trước");

    const myReview = reviews.find(r => r.userId === user.id);


    if (myReview && !editingId) {
      return alert("Bạn đã đánh giá rồi!");
    }

    if (editingId) {
      
      await api.put(`/reviews/${editingId}`, {
            rating,
            comment
          }, {
            params: { userId: user.id }
          });
    } else {
      
      await api.post(`/reviews`, {
            rating,
            comment
          }, {
            params: {
              userId: user.id,
              bookId: id
            }
          });
    }

    setRating(5);
    setComment("");
    setEditingId(null);

    
    const res = await api.get(`/reviews/book/${id}`);
      setReviews(res.data);
  };

  const handleDelete = async (reviewId: number) => {
    if (!user) return;

    await api.delete(`/reviews/${reviewId}`, {
       params: { userId: user.id }
     });

    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const handleEdit = (r: Review) => {
    setEditingId(r.id);
    setRating(r.rating);
    setComment(r.comment);
  };

  
  return (
    <main className="bg-[#F4F1EA] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid md:grid-cols-12 gap-10">

          {}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img
                className="w-full h-[400px] object-cover"
                src={book?.coverImage || "https://via.placeholder.com/300x450"}
              />
            </div>

            

            <button
              onClick={handleBuy}
              className="w-full bg-[#2C3E50] text-white py-3 rounded-lg font-bold"
            >
              Continue Reading
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

          {}
          <div className="md:col-span-8">

            <h1 className="text-4xl font-black text-[#2C3E50]">
              {book?.title}
            </h1>

            <p className="text-gray-500 mt-2">
              by {book?.authorName}
            </p>

            <p className="mt-4 text-gray-600">
              {book?.description}
            </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="border border-primary/10 p-4 rounded-xl text-center">
                                <p className="text-[10px] uppercase tracking-widest text-primary/50 font-bold mb-1">Pages</p>
                                <p className="text-lg font-bold text-primary">304</p>
                            </div>
                            <div className="border border-primary/10 p-4 rounded-xl text-center">
                                <p className="text-[10px] uppercase tracking-widest text-primary/50 font-bold mb-1">Language</p>
                                <p className="text-lg font-bold text-primary">English</p>
                            </div>
                            <div className="border border-primary/10 p-4 rounded-xl text-center">
                                <p className="text-[10px] uppercase tracking-widest text-primary/50 font-bold mb-1">Format</p>
                                <p className="text-lg font-bold text-primary">Hardcover</p>
                            </div>
                        </div>
                        <div className="prose prose-slate max-w-none text-primary/80 leading-relaxed mb-10">
                            <h3 className="text-lg font-bold text-primary mb-3">About the Book</h3>
                            <p className="mb-4">Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?</p>
                            <p>A dazzling novel about all the choices that go into a life well lived, from the acclaimed author of <i>How To Stop Time</i> and <i>Reasons to Stay Alive</i>.</p>
                        </div>
            {}
            <div className="mt-10 bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold mb-3">
                {editingId ? "Edit Review" : "Write Review"}
              </h2>

              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border p-2 w-20"
                />

                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border p-2 flex-1"
                  placeholder="Write comment..."
                />

                <button
                  onClick={handleSubmitReview}
                  className="bg-pink-400 text-white px-4 rounded"
                >
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
            </div>

            {}
            <div className="mt-6 space-y-4">
              {reviews.map((r) => {
                const isMyReview = user && r.userId === user.id;

                return (
                  <div key={r.id} className="bg-white p-4 rounded-xl shadow">
                    <p className="text-pink-400">⭐ {r.rating}</p>
                    <p className="italic text-gray-700">"{r.comment}"</p>

                    {isMyReview && (
                      <div className="flex gap-4 mt-3">
                        <button
                          onClick={() => handleEdit(r)}
                          className="bg-white border border-primary text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/5 transition-all"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(r.id)}
                          className="bg-white border border-primary text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/5 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {}
            <div className="mt-20">
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-8">
                Readers also enjoyed
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
                {relatedBooks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate(`/book/${b.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden shadow bg-white mb-2">
                      <img
                        src={b.coverImage}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>

                    <p className="text-sm font-bold text-[#2C3E50] truncate">
                      {b.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      {b.authorName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}