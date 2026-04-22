import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactReader, ReactReaderStyle } from "react-reader";
import type { Rendition } from "epubjs";
import { bookService } from "../services/bookService";
import { getStoredUserId } from "../services/authService";
import type { BookResponse } from "../types";

const FONT_FAMILIES = [
    { label: "Mặc định", value: "inherit" },
    { label: "Serif", value: "Georgia, serif" },
    { label: "Sans-serif", value: "Arial, sans-serif" },
    { label: "Mono", value: "'Courier New', monospace" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
];

const FONT_SIZES = [14, 16, 18, 20, 22, 24, 28];

const BG_COLORS = [
    { label: "Trắng", value: "#ffffff", text: "#1a1a1a" },
    { label: "Kem", value: "#f5f0e8", text: "#2c2416" },
    { label: "Xanh nhạt", value: "#e8f0f5", text: "#162030" },
    { label: "Vàng nhạt", value: "#fdf6e3", text: "#2c2416" },
    { label: "Xám nhạt", value: "#f0f0f0", text: "#1a1a1a" },
    { label: "Tối", value: "#1a1a2e", text: "#e0e0e0" },
    { label: "Đen", value: "#121212", text: "#e8e8e8" },
];

export default function ReadingViewer() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    
    const [book, setBook] = useState<BookResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [location, setLocation] = useState<string | number>(0);
    const renditionRef = useRef<Rendition | null>(null);
    
    // UI States
    const [fontFamily, setFontFamily] = useState("inherit");
    const [fontSize, setFontSize] = useState(18);
    const [bgColor, setBgColor] = useState(BG_COLORS[0]);
    const [showPanel, setShowPanel] = useState(false);
    const [showTocSidebar, setShowTocSidebar] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [toc, setToc] = useState<any[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const saveProgressTimeout = useRef<NodeJS.Timeout | null>(null);

    const getReaderStyles = useCallback((bg: (typeof BG_COLORS)[0]) => {
        // We override ReactReaderStyle to hide default Header and TOC
        return {
            ...ReactReaderStyle,
            container: { ...ReactReaderStyle.container, background: bg.value },
            readerArea: { 
                ...ReactReaderStyle.readerArea, 
                background: bg.value, 
                transition: "background 0.3s",
            },
            titleArea: { display: "none" }, // Ẩn header mặc định
            tocArea: { display: "none" }, // Ẩn toc mặc định
            tocButton: { display: "none" }, // Ẩn nút toc mặc định
            tocButtonExpanded: { display: "none" },
            tocButtonBar: { display: "none" },
            reader: { ...ReactReaderStyle.reader, background: bg.value },
        };
    }, []);

    const injectEpubStyles = useCallback(
        (ff: string, fs: number, bg: (typeof BG_COLORS)[0]) => {
            const rend = renditionRef.current;
            if (!rend) return;
            rend.themes.default({
                body: {
                    "font-family": `${ff} !important`,
                    "font-size": `${fs}px !important`,
                    "background": `${bg.value} !important`,
                    "color": `${bg.text} !important`,
                    "line-height": "1.8 !important",
                    "padding-bottom": "60px !important", // Khoảng trống dưới đáy
                },
                p: {
                    "font-family": `${ff} !important`,
                    "color": `${bg.text} !important`,
                },
                span: {
                    "font-family": `${ff} !important`,
                },
                div: {
                    "background": `${bg.value} !important`,
                },
            });
            rend.themes.select("default");
        },
        []
    );

    const handleFontFamily = (value: string) => {
        setFontFamily(value);
        injectEpubStyles(value, fontSize, bgColor);
    };

    const handleFontSize = (value: number) => {
        setFontSize(value);
        injectEpubStyles(fontFamily, value, bgColor);
    };

    const handleBgColor = (color: (typeof BG_COLORS)[0]) => {
        setBgColor(color);
        injectEpubStyles(fontFamily, fontSize, color);
    };

    const isDark = ["#1a1a2e", "#121212"].includes(bgColor.value);

    const labelStyle: React.CSSProperties = {
        fontSize: 12,
        color: isDark ? "#aaa" : "#888",
        marginBottom: 6,
        fontWeight: 500,
        letterSpacing: 0.5,
        textTransform: "uppercase",
    };

    useEffect(() => {
        if (!bookId) {
            setError("Không tìm thấy ID sách.");
            setLoading(false);
            return;
        }

        const fetchBook = async () => {
            try {
                setLoading(true);
                const uid = getStoredUserId();
                setUserId(uid ? Number(uid) : null);

                const data = await bookService.getBookById(Number(bookId));
                setBook(data);

                if (uid) {
                    try {
                        const progressData = await bookService.getReadingProgress(Number(uid), Number(bookId));
                        if (progressData && progressData.cfiLocation) {
                            setLocation(progressData.cfiLocation);
                        }
                    } catch (e) {
                        console.log("Không có tiến độ đọc cũ.");
                    }
                }

                if (!data.fileUrl) {
                    setError("Sách này chưa có file EPUB.");
                }
            } catch (err) {
                console.error("Error fetching book:", err);
                setError("Có lỗi xảy ra khi tải thông tin sách.");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    // Click outside settings panel to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (showPanel && !target.closest('.settings-panel') && !target.closest('.settings-btn')) {
                setShowPanel(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPanel]);

    const handleLocationChanged = (epubcfi: string) => {
        setLocation(epubcfi);
        
        if (!userId || !bookId) return;

        if (saveProgressTimeout.current) {
            clearTimeout(saveProgressTimeout.current);
        }

        saveProgressTimeout.current = setTimeout(() => {
            const rend = renditionRef.current;
            let percentValue = 0;
            if (rend && rend.location && rend.location.start) {
                // Lấy phần trăm nếu có (cần generate locations trước, tuỳ thuộc file epub)
                const percentage = rend.location.start.percentage;
                if (percentage) {
                    percentValue = Math.round(percentage * 100 * 100) / 100;
                }
            }
            bookService.saveReadingProgress(userId, Number(bookId), epubcfi, percentValue)
                .catch(e => console.error("Lỗi khi lưu tiến độ:", e));
        }, 1500); // Lưu sau 1.5s để tránh call API quá nhiều
    };

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: bgColor.value, color: bgColor.text }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span className="font-medium">Đang tải sách...</span>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: bgColor.value, color: bgColor.text }}>
                <span className="material-symbols-outlined text-4xl mb-4 opacity-50">error_outline</span>
                <p className="font-medium">{error || "Không thể tải sách."}</p>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ 
                        padding: "8px 24px", marginTop: 24, cursor: "pointer", 
                        background: "#4a4aff", color: "white", border: "none", borderRadius: 8,
                        fontWeight: 600, boxShadow: "0 4px 14px 0 rgba(74, 74, 255, 0.39)"
                    }}
                >
                    Quay lại
                </button>
            </div>
        );
    }

    // Default to a test EPUB if file_url from DB is just a dummy path without an actual file server yet
    const defaultTestUrl = "https://pub-c171790faebb4d1c803ee83383ed9093.r2.dev/Doi-Dich-Edited.epub";
    const finalEpubUrl = book.fileUrl?.startsWith("http") ? book.fileUrl : defaultTestUrl;

    return (
        <div className="flex flex-col h-screen relative overflow-hidden transition-colors duration-300" style={{ background: bgColor.value, color: bgColor.text }}>
            
            {/* Custom Premium Header */}
            <div className={`absolute top-0 left-0 right-0 z-50 transition-transform duration-300 ${headerVisible ? "translate-y-0" : "-translate-y-full"}`} 
                 style={{ 
                     background: isDark ? "rgba(30,30,48,0.75)" : "rgba(255,255,255,0.75)", 
                     backdropFilter: "blur(16px)", 
                     WebkitBackdropFilter: "blur(16px)",
                     borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` 
                 }}>
                <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                        </button>
                        <h1 className="font-bold text-[15px] truncate max-w-[200px] md:max-w-md opacity-90">{book.title}</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setShowTocSidebar(true)} className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center" title="Mục lục">
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>format_list_bulleted</span>
                        </button>
                        <button 
                            className={`settings-btn w-9 h-9 rounded-full transition-colors flex items-center justify-center ${showPanel ? "bg-accent/10 text-accent" : "hover:bg-black/5 dark:hover:bg-white/10"}`} 
                            onClick={() => setShowPanel(!showPanel)}
                            title="Tùy chỉnh giao diện"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel Cài đặt (Settings) - Premium Glassmorphism */}
            <div className={`settings-panel absolute right-4 z-[100] transition-all duration-300 ease-out origin-top-right ${showPanel ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
                 style={{
                     top: 64,
                     background: isDark ? "rgba(30,30,48,0.9)" : "rgba(255,255,255,0.9)",
                     backdropFilter: "blur(24px)",
                     WebkitBackdropFilter: "blur(24px)",
                     border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                     borderRadius: 16,
                     padding: "20px",
                     width: 300,
                     boxShadow: isDark ? "0 10px 40px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.1)",
                 }}>
                
                {/* Phông chữ */}
                <div className="mb-5">
                    <div style={labelStyle}>Phông chữ</div>
                    <div className="flex flex-col gap-1.5">
                        {FONT_FAMILIES.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => handleFontFamily(f.value)}
                                className="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
                                style={{
                                    background: fontFamily === f.value ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "transparent",
                                    fontFamily: f.value,
                                    fontSize: 14,
                                    color: fontFamily === f.value ? (isDark ? "#fff" : "#000") : (isDark ? "#bbb" : "#555"),
                                    fontWeight: fontFamily === f.value ? 600 : 400,
                                }}
                            >
                                {f.label}
                                {fontFamily === f.value && <span className="material-symbols-outlined text-[16px]">check</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cỡ chữ */}
                <div className="mb-5">
                    <div className="flex justify-between items-end mb-2">
                        <div style={{...labelStyle, marginBottom: 0}}>Cỡ chữ</div>
                        <span className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{fontSize}px</span>
                    </div>
                    <input
                        type="range"
                        min={14}
                        max={28}
                        step={2}
                        value={fontSize}
                        onChange={(e) => handleFontSize(Number(e.target.value))}
                        className="w-full mb-1"
                        style={{ accentColor: isDark ? "#fff" : "#000" }}
                    />
                    <div className="flex justify-between text-[10px] opacity-50 px-1">
                        <span>A-</span>
                        <span>A+</span>
                    </div>
                </div>

                {/* Màu nền */}
                <div>
                    <div style={labelStyle}>Màu nền & Giao diện</div>
                    <div className="flex gap-2 flex-wrap mt-2">
                        {BG_COLORS.map((c) => (
                            <button
                                key={c.value}
                                onClick={() => handleBgColor(c)}
                                title={c.label}
                                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                style={{
                                    background: c.value,
                                    border: `1px solid ${c.value === "#121212" || c.value === "#1a1a2e" ? "#444" : "#ddd"}`,
                                    boxShadow: bgColor.value === c.value ? `0 0 0 2px ${isDark ? "#fff" : "#000"}` : "none",
                                }}
                            >
                                {bgColor.value === c.value && (
                                    <span className="material-symbols-outlined text-[14px]" style={{ color: c.text }}>check</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TOC Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-[60] w-[280px] shadow-2xl transform transition-transform duration-300 ease-in-out ${showTocSidebar ? "translate-x-0" : "-translate-x-full"}`}
                 style={{ background: isDark ? "#1a1a2e" : "#fdfdfd", borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                <div className="h-14 px-4 flex justify-between items-center" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    <h2 className="font-bold text-[15px] opacity-90">Mục lục</h2>
                    <button onClick={() => setShowTocSidebar(false)} className="w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-56px)] p-2">
                    {toc.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 opacity-50">
                            <span className="material-symbols-outlined mb-2 text-2xl">menu_book</span>
                            <p className="text-xs">Không có mục lục</p>
                        </div>
                    ) : (
                        <ul className="space-y-0.5">
                            {toc.map((item, index) => (
                                <li key={index}>
                                    <button 
                                        onClick={() => {
                                            setLocation(item.href);
                                            setShowTocSidebar(false);
                                        }}
                                        className="w-full text-left py-2.5 px-3 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[13px] truncate"
                                        style={{ color: isDark ? "#ddd" : "#444" }}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Overlay for Sidebar */}
            {showTocSidebar && (
                <div className="fixed inset-0 z-[55] backdrop-blur-[2px]" 
                     style={{ background: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)" }} 
                     onClick={() => setShowTocSidebar(false)} />
            )}

            {/* Reader Area */}
            <div className="flex-1 w-full" onClick={() => setHeaderVisible(!headerVisible)}>
                <ReactReader
                    url={finalEpubUrl}
                    location={location}
                    locationChanged={handleLocationChanged}
                    tocChanged={(toc) => setToc(toc)}
                    readerStyles={getReaderStyles(bgColor)}
                    getRendition={(rend: Rendition) => {
                        renditionRef.current = rend;
                        rend.themes.default({
                            body: {
                                "font-family": `${fontFamily} !important`,
                                "font-size": `${fontSize}px !important`,
                                "background": `${bgColor.value} !important`,
                                "color": `${bgColor.text} !important`,
                                "line-height": "1.8 !important",
                                "padding-top": "40px !important", // Khoảng trống cho Header
                                "padding-bottom": "60px !important",
                            },
                            p: {
                                "font-family": `${fontFamily} !important`,
                                "color": `${bgColor.text} !important`,
                            },
                            span: {
                                "font-family": `${fontFamily} !important`,
                            },
                            div: {
                                "background": `${bgColor.value} !important`,
                            },
                        });
                        rend.themes.select("default");
                    }}
                />
            </div>
        </div>
    );
}