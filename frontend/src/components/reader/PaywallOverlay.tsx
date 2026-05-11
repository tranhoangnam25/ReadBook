import React from "react";
import { useNavigate } from "react-router-dom";

interface PaywallOverlayProps {
    isLimitReached: boolean;
    bookId: number | undefined;
    onReadAgain: () => void;
}

const PaywallOverlay: React.FC<PaywallOverlayProps> = ({ isLimitReached, bookId, onReadAgain }) => {
    const navigate = useNavigate();

    if (!isLimitReached) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-end"
            style={{
                background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.97) 100%)",
                backdropFilter: "blur(2px)",
            }}
        >
            <div className="w-full max-w-md mx-auto px-8 pb-10 pt-10 text-center">
                <span
                    className="material-symbols-outlined text-5xl mb-4 block"
                    style={{ color: "#e8c98a" }}
                >
                    lock
                </span>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                    Bạn đã đọc hết phần thử miễn phí
                </h2>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">
                    Mua sách để tiếp tục đọc và mở khoá toàn bộ nội dung.
                </p>
                <button
                    onClick={() => navigate(`/book-detail/${bookId}`)}
                    className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all hover:scale-105 active:scale-95"
                    style={{
                        background: "linear-gradient(135deg, #e8c98a 0%, #c9a84c 100%)",
                        color: "#1a1200",
                        boxShadow: "0 8px 32px rgba(232,201,138,0.4)",
                    }}
                >
                    Mua sách ngay →
                </button>
                <div className="flex flex-col gap-2 mt-4">
                    <button
                        onClick={onReadAgain}
                        className="w-full py-3 rounded-2xl font-bold text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">replay</span>
                        Đọc lại từ đầu
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 rounded-2xl font-bold text-sm text-white/40 hover:text-white/60 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaywallOverlay;
