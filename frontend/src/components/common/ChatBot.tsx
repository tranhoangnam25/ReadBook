import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

interface Book {
  id: number;
  title: string;
  author?: string;
  price?: number;
  salePrice?: number;
  discountPercentage?: number;
  previewPercentage?: number | null;
  description?: string;
  coverImage: string;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  books?: Book[];
}

export default function ChatBot() {
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);

  const [message, setMessage] = useState<string>("");

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Xin chào! Tôi có thể gợi ý sách cho bạn hôm nay 📚",
    },
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

    const userMessage: Message = {
      sender: "user",
      text: currentMessage,
    };

    setMessages((prev) => [...prev, userMessage]);

    setMessage("");

    try {
      const response = await api.post("/chat", {
        message: currentMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.message,
          books: response.data.books || [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Xin lỗi, hiện tại tôi không thể xử lý yêu cầu. Vui lòng thử lại sau.",
        },
      ]);
    }
  };

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-pink-400 hover:bg-pink-500"
            : "bg-[#2C3E50] hover:bg-slate-900"
        }`}
      >
        {open ? (
          <X className="text-white" size={28} />
        ) : (
          <MessageCircle className="text-white" size={28} />
        )}
      </button>

      {/* CHAT WINDOW */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[390px] h-[620px]
        bg-[#F4F1EA] rounded-2xl shadow-2xl overflow-hidden
        border border-zinc-200 flex flex-col transition-all duration-500
        ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* HEADER */}
        <div className="bg-[#2C3E50] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-300 flex items-center justify-center">
              <Bot className="text-white" size={20} />
            </div>

            <div>
              <p className="text-white font-bold text-sm">
                SunsetBook Assistant
              </p>

              <p className="text-green-300 text-[10px] uppercase tracking-widest">
                ● Online
              </p>
            </div>
          </div>

          <button onClick={() => setOpen(false)}>
            <X className="text-white" />
          </button>
        </div>

        {/* MESSAGE AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {messages.map((msg, index) => (
            <div key={index}>
              {/* USER MESSAGE */}
              {msg.sender === "user" && (
                <div className="flex justify-end">
                  <div className="bg-[#2C3E50] text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-[80%] text-sm shadow">
                    {msg.text}
                  </div>
                </div>
              )}

              {/* BOT MESSAGE */}
              {msg.sender === "bot" && (
                <div className="space-y-3">
                  {/* TEXT */}
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-pink-300 flex items-center justify-center text-white text-xs font-bold">
                      BP
                    </div>

                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm max-w-[85%] text-sm text-zinc-800 shadow leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>

                  {/* BOOKS */}
                  {msg.books && msg.books.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pl-9 pb-2 scrollbar-hide">
                      {msg.books.map((book, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            navigate(`/book-detail/${book.id}`)
                          }
                          className="min-w-[190px] max-w-[190px] bg-white rounded-xl p-3 shadow border border-zinc-100 hover:border-pink-300 transition-all duration-300 cursor-pointer hover:-translate-y-1 relative"
                        >
                          {/* SALE TAG */}
                          {book.discountPercentage && book.discountPercentage > 0 && (
                            <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-pulse">
                              -{book.discountPercentage}%
                            </div>
                          )}

                          {/* IMAGE */}
                          <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-zinc-100">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>

                          {/* TITLE */}
                          <p className="font-bold text-sm line-clamp-1">
                            {book.title}
                          </p>

                          {/* PRICE */}
                          <div className="mt-1">
                            {book.discountPercentage && book.discountPercentage > 0 ? (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-400 line-through">
                                        {(book.price || 0).toLocaleString("vi-VN")}đ
                                    </span>
                                    <span className="text-red-500 font-bold text-sm leading-tight">
                                        {(book.salePrice || 0).toLocaleString("vi-VN")}đ
                                    </span>
                                </div>
                            ) : (
                                book.price && (
                                    <p className="text-pink-500 font-semibold text-sm">
                                      {book.price.toLocaleString("vi-VN")}đ
                                    </p>
                                  )
                            )}
                          </div>

                          {/* DESCRIPTION */}
                          {book.description && (
                            <p className="text-[10px] text-zinc-500 mt-2 line-clamp-2 leading-tight">
                              {book.description}
                            </p>
                          )}

                          {/* PREVIEW */}
                          {book.previewPercentage && (
                            <div className="mt-3">
                              <div className="w-full bg-zinc-200 rounded-full h-2">
                                <div
                                  className="bg-pink-400 h-2 rounded-full"
                                  style={{
                                    width: `${book.previewPercentage}%`,
                                  }}
                                />
                              </div>

                              <p className="text-[10px] text-zinc-400 mt-1">
                                Preview {book.previewPercentage}%
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 bg-white border-t border-zinc-200">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask for a recommendation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="w-full bg-[#F4F1EA] rounded-full py-3 px-5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />

            <button
              onClick={handleSend}
              className="absolute right-2 w-9 h-9 bg-[#2C3E50] hover:bg-pink-300 rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <Send className="text-white" size={18} />
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 text-center mt-3 uppercase tracking-widest">
            Powered by BookPulse AI
          </p>
        </div>
      </div>
    </>
  );
}
