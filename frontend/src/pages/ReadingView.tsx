import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ReactReader, ReactReaderStyle } from "react-reader";
import type { Rendition } from "epubjs";
import { bookService } from "../services/bookService";
import type { BookResponse } from "../types";
import { useEpubReader } from "../hooks/useEpubReader";
import ReaderSettingsPanel from "../components/reader/ReaderSettingsPanel";
import TocSidebar from "../components/reader/TocSidebar";
import PaywallOverlay from "../components/reader/PaywallOverlay";
import { FONT_FAMILIES, BG_COLORS } from "../constants/readerConstants";

export default function ReadingView() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isSample = searchParams.get("isSample") === "true";

    const [book, setBook] = useState<BookResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        location,
        setLocation,
        toc,
        setToc,
        userId,
        isLimitReached,
        progressPercentage,
        renditionRef,
        handleLocationChanged,
        // Settings from hook
        fontFamilyId,
        setFontFamilyId,
        fontFamilyCss,
        fontSize,
        setFontSize,
        lineHeight,
        setLineHeight,
        bgColor,
        setBgColor,
        isSavingSettings,
        settingsLoaded,
        progressLoaded,
        injectEpubStyles,
        handleSaveSettings,
        handleReadAgain
    } = useEpubReader(bookId, book, isSample);

    const [showPanel, setShowPanel] = useState(false);
    const [showTocSidebar, setShowTocSidebar] = useState(false);

    const settingsPanelRef = useRef<HTMLDivElement>(null);
    const settingsBtnRef = useRef<HTMLButtonElement>(null);

    const isDark = ["#1a1a2e", "#121212"].includes(bgColor.value);

    const getReaderStyles = useCallback((bg: typeof BG_COLORS[0]) => ({
        ...ReactReaderStyle,
        container: { ...ReactReaderStyle.container, background: bg.value },
        readerArea: { 
            ...ReactReaderStyle.readerArea,
            background: bg.value, 
            transition: "background 0.3s",
        },
        titleArea: { display: "none" },
        tocArea: { display: "none" },
        tocButton: { display: "none" },
        tocButtonExpanded: { display: "none" },
        tocButtonBar: { display: "none" },
        reader: { ...ReactReaderStyle.reader, background: bg.value },
    }), []);

    // Issue #1: Redirect if not logged in
    useEffect(() => {
        if (settingsLoaded && userId === null) {
            navigate("/");
        }
    }, [settingsLoaded, userId, navigate]);

    useEffect(() => {
        if (!bookId) {
            setError("Không tìm thấy ID sách.");
            setLoading(false);
            return;
        }
        bookService.getBookById(Number(bookId))
            .then(data => {
                setBook(data);
                if (!data.fileUrl) setError("Sách này chưa có file EPUB.");
            })
            .catch(() => setError("Có lỗi xảy ra khi tải thông tin sách."))
            .finally(() => setLoading(false));
    }, [bookId]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (showPanel && 
                settingsPanelRef.current && !settingsPanelRef.current.contains(target) &&
                settingsBtnRef.current && !settingsBtnRef.current.contains(target)) {
                setShowPanel(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showPanel]);

    if (loading || !settingsLoaded || !progressLoaded) {
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
                <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow-lg hover:opacity-90 transition-opacity">Quay lại</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen relative overflow-hidden transition-colors duration-300" style={{ background: bgColor.value, color: bgColor.text }}>
            <div className="absolute top-0 left-0 right-0 z-50 transition-transform duration-300" 
                 style={{ 
                     background: isDark ? "rgba(30,30,48,0.75)" : "rgba(255,255,255,0.75)", 
                     backdropFilter: "blur(16px)", 
                     borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` 
                 }}>
                <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                        </button>
                        <h1 className="font-bold text-[15px] truncate max-w-[200px] md:max-w-md opacity-90">{book.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-[13px] font-bold opacity-60 flex items-center gap-1">
                             <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                             {Math.round(progressPercentage)}%
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setShowTocSidebar(true)} className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center" title="Mục lục">
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>format_list_bulleted</span>
                            </button>
                            <button 
                                ref={settingsBtnRef}
                                className={`settings-btn w-9 h-9 rounded-full transition-colors flex items-center justify-center ${showPanel ? "bg-accent/10 text-accent" : "hover:bg-black/5 dark:hover:bg-white/10"}`} 
                                onClick={() => setShowPanel(!showPanel)} 
                                title="Tùy chỉnh giao diện"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="h-[3px] w-full bg-black/5 dark:bg-white/5 relative overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-accent transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <ReaderSettingsPanel 
                ref={settingsPanelRef}
                showPanel={showPanel}
                isDark={isDark}
                fontFamilyId={fontFamilyId}
                fontSize={fontSize}
                lineHeight={lineHeight}
                bgColor={bgColor}
                fontFamilies={FONT_FAMILIES}
                bgColors={BG_COLORS}
                onFontFamilyChange={(id) => { setFontFamilyId(id as any); }}
                onFontSizeChange={(val) => { setFontSize(val); injectEpubStyles(fontFamilyCss, val, lineHeight, bgColor); }}
                onLineHeightChange={(val) => { setLineHeight(val); injectEpubStyles(fontFamilyCss, fontSize, val, bgColor); }}
                onBgColorChange={(val) => { setBgColor(val); injectEpubStyles(fontFamilyCss, fontSize, lineHeight, val); }}
                onSaveSettings={handleSaveSettings}
                isSaving={isSavingSettings}
            />

            <TocSidebar 
                showTocSidebar={showTocSidebar}
                isDark={isDark}
                bgColor={bgColor}
                toc={toc}
                onClose={() => setShowTocSidebar(false)}
                onLocationChange={(href) => setLocation(href)}
            />

            <div className="flex-1 w-full">
                <ReactReader
                    url={book.fileUrl}
                    location={location}
                    locationChanged={handleLocationChanged}
                    tocChanged={setToc}
                    readerStyles={getReaderStyles(bgColor)}
                    getRendition={(rend: Rendition) => {
                        renditionRef.current = rend;
                        injectEpubStyles(fontFamilyCss, fontSize, lineHeight, bgColor);
                    }}
                />
            </div>

            <PaywallOverlay 
                isLimitReached={isLimitReached} 
                bookId={book.id} 
                onReadAgain={handleReadAgain}
            />
        </div>
    );
}