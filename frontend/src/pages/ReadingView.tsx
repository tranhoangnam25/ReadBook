import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactReader, ReactReaderStyle } from "react-reader";
import type { Rendition } from "epubjs";
import { bookService } from "../services/bookService";
import { readerBookmarkService } from "../services/readerBookmarkService";
import { readerHighlightService } from "../services/readerHighlightService";
import type { BookResponse, ReaderBookmarkResponse, ReaderHighlightResponse, PageSpreadId } from "../types";
import { useEpubReader } from "../hooks/useEpubReader";
import ReaderSettingsPanel from "../components/reader/ReaderSettingsPanel";
import TocSidebar from "../components/reader/TocSidebar";
import PaywallOverlay from "../components/reader/PaywallOverlay";
import { FONT_FAMILIES, BG_COLORS } from "../constants/readerConstants";

export default function ReadingView() {
    const { bookId } = useParams();
    const navigate = useNavigate();

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
        updateProgressPercentage,
        renditionRef,
        handleLocationChanged,
        fontFamilyId,
        setFontFamilyId,
        fontFamilyCss,
        fontSize,
        setFontSize,
        lineHeight,
        setLineHeight,
        bgColor,
        setBgColor,
        pageSpread,
        setPageSpread,
        isSavingSettings,
        settingsLoaded,
        progressLoaded,
        injectEpubStyles,
        handleSaveSettings,
        handleReadAgain
    } = useEpubReader(bookId, book);

    const [showPanel, setShowPanel] = useState(false);
    const [showTocSidebar, setShowTocSidebar] = useState(false);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const [showHighlights, setShowHighlights] = useState(false);
    const [bookmarks, setBookmarks] = useState<ReaderBookmarkResponse[]>([]);
    const [isSavingBookmark, setIsSavingBookmark] = useState(false);
    const [notePopupMode, setNotePopupMode] = useState<"create" | "edit" | null>(null);
    const [selectedBookmark, setSelectedBookmark] = useState<ReaderBookmarkResponse | null>(null);
    const [pendingBookmarkLocation, setPendingBookmarkLocation] = useState<string | null>(null);
    const [bookmarkNoteDraft, setBookmarkNoteDraft] = useState("");
    const [highlights, setHighlights] = useState<ReaderHighlightResponse[]>([]);
    const [highlightNotePopupMode, setHighlightNotePopupMode] = useState<"create" | "edit" | null>(null);
    const [selectedHighlight, setSelectedHighlight] = useState<ReaderHighlightResponse | null>(null);
    const [pendingHighlight, setPendingHighlight] = useState<{ cfiRange: string; text: string } | null>(null);
    const [highlightNoteDraft, setHighlightNoteDraft] = useState("");
    const [isSavingHighlight, setIsSavingHighlight] = useState(false);
    const [isHighlightMode, setIsHighlightMode] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);

    const highlightsRef = useRef<ReaderHighlightResponse[]>([]);
    const isHighlightModeRef = useRef(false);
    const highlightEventsBoundRef = useRef<Rendition | null>(null);
    const reapplyHighlightsTimerRef = useRef<number | null>(null);
    const lastDisplayedLocationRef = useRef<string | number | null>(null);
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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsFocusMode(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (!userId || !book?.id) return;
        readerBookmarkService.getBookmarks(userId, book.id)
            .then(setBookmarks)
            .catch(() => setBookmarks([]));
    }, [userId, book?.id]);

    useEffect(() => {
        highlightsRef.current = highlights;
    }, [highlights]);

    useEffect(() => {
        isHighlightModeRef.current = isHighlightMode;
    }, [isHighlightMode]);

    useEffect(() => {
        if (!userId || !book?.id) return;
        readerHighlightService.getHighlights(userId, book.id)
            .then(setHighlights)
            .catch(() => setHighlights([]));
    }, [userId, book?.id]);

    const applyHighlight = useCallback((highlight: ReaderHighlightResponse) => {
        const annotations = (renditionRef.current as any)?.annotations;
        if (!annotations || !highlight.cfiRange) return;
        try {
            annotations.remove(highlight.cfiRange, "highlight");
            annotations.highlight(
                highlight.cfiRange,
                { id: highlight.id },
                undefined,
                "reader-highlight",
                { fill: highlight.color, "fill-opacity": "0.22", "mix-blend-mode": "normal" }
            );
        } catch (err) {
            console.error("Không render được highlight:", err);
        }
    }, [renditionRef]);

    const scheduleReapplyHighlights = useCallback(() => {
        if (reapplyHighlightsTimerRef.current) {
            window.clearTimeout(reapplyHighlightsTimerRef.current);
        }
        reapplyHighlightsTimerRef.current = window.setTimeout(() => {
            highlightsRef.current.forEach(applyHighlight);
        }, 120);
    }, [applyHighlight]);

    const applyPageSpread = useCallback((spread: PageSpreadId) => {
        const rend = renditionRef.current as any;
        if (!rend) return;
        try {
            rend.spread?.(spread === "AUTO" ? "auto" : "none");
            if (rend.manager && typeof rend.manager.resize === "function") {
                rend.manager.resize();
            } else if (typeof rend.resize === "function") {
                rend.resize();
            }
            scheduleReapplyHighlights();
        } catch (err) {
            console.error("Không đổi được chế độ trang:", err);
        }
    }, [renditionRef, scheduleReapplyHighlights]);

    const handlePageSpreadChange = (spread: PageSpreadId) => {
        setPageSpread(spread);
        applyPageSpread(spread);
    };

    useEffect(() => {
        applyPageSpread(pageSpread);
    }, [pageSpread, applyPageSpread]);

    useEffect(() => {
        if (!progressLoaded || !location || lastDisplayedLocationRef.current === location) return;
        const rend = renditionRef.current as any;
        if (!rend || typeof rend.display !== "function") return;

        lastDisplayedLocationRef.current = location;
        rend.display(location).then(scheduleReapplyHighlights).catch((err: unknown) => {
            console.error("Không mở được trang đang đọc dở:", err);
        });
    }, [progressLoaded, location, renditionRef, scheduleReapplyHighlights]);

    useEffect(() => {
        highlights.forEach(applyHighlight);
    }, [highlights, applyHighlight]);

    useEffect(() => () => {
        if (reapplyHighlightsTimerRef.current) {
            window.clearTimeout(reapplyHighlightsTimerRef.current);
        }
    }, []);

    const removeRenderedHighlight = useCallback((cfiRange: string) => {
        const annotations = (renditionRef.current as any)?.annotations;
        if (!annotations || !cfiRange) return;
        try {
            annotations.remove(cfiRange, "highlight");
        } catch (err) {
            console.error("Không xóa được highlight khỏi trang:", err);
        }
    }, [renditionRef]);

    const toggleFocusMode = () => {
        setShowPanel(false);
        setShowTocSidebar(false);
        setShowBookmarks(false);
        setShowHighlights(false);
        setIsFocusMode((current) => !current);
    };

    const closeSidebars = () => {
        setShowPanel(false);
        setShowTocSidebar(false);
        setShowBookmarks(false);
        setShowHighlights(false);
    };

    const closeHighlightNotePopup = () => {
        setHighlightNotePopupMode(null);
        setSelectedHighlight(null);
        setPendingHighlight(null);
        setHighlightNoteDraft("");
    };

    const handleAddHighlight = useCallback(async (cfiRange: string, text: string) => {
        if (!userId || !book?.id || !cfiRange) return;
        if (highlightsRef.current.some((highlight) => highlight.cfiRange === cfiRange)) return;

        setPendingHighlight({ cfiRange, text: text.trim() });
        setHighlightNoteDraft("");
        setHighlightNotePopupMode("create");
    }, [userId, book?.id]);

    const handleStartEditHighlightNote = (highlight: ReaderHighlightResponse) => {
        setSelectedHighlight(highlight);
        setHighlightNoteDraft(highlight.note || "");
        setHighlightNotePopupMode("edit");
    };

    const handleSaveHighlightNote = async () => {
        if (!highlightNotePopupMode) return;
        setIsSavingHighlight(true);
        try {
            if (highlightNotePopupMode === "create") {
                if (!userId || !book?.id || !pendingHighlight) return;
                const highlight = await readerHighlightService.createHighlight({
                    userId,
                    bookId: book.id,
                    cfiRange: pendingHighlight.cfiRange,
                    text: pendingHighlight.text,
                    note: highlightNoteDraft.trim(),
                    color: "#facc15",
                });
                setHighlights((current) => [highlight, ...current]);
                applyHighlight(highlight);
                setShowHighlights(true);
            } else if (selectedHighlight) {
                const updated = await readerHighlightService.updateNote(selectedHighlight.id, { note: highlightNoteDraft.trim() });
                setHighlights((current) => current.map((highlight) => highlight.id === selectedHighlight.id ? updated : highlight));
            }
            closeHighlightNotePopup();
        } finally {
            setIsSavingHighlight(false);
        }
    };

    const handleDeleteHighlight = async (highlight: ReaderHighlightResponse) => {
        await readerHighlightService.deleteHighlight(highlight.id);
        removeRenderedHighlight(highlight.cfiRange);
        setHighlights((current) => current.filter((item) => item.id !== highlight.id));
    };

    const handleGoToHighlight = (highlight: ReaderHighlightResponse) => {
        setLocation(highlight.cfiRange);
        closeSidebars();
        window.setTimeout(() => applyHighlight(highlight), 160);
    };

    const closeBookmarkNotePopup = () => {
        setNotePopupMode(null);
        setSelectedBookmark(null);
        setPendingBookmarkLocation(null);
        setBookmarkNoteDraft("");
    };

    const handleAddBookmark = () => {
        if (!userId || !book?.id || !location || isSavingBookmark) return;
        setPendingBookmarkLocation(String(location));
        setBookmarkNoteDraft("");
        setNotePopupMode("create");
    };

    const handleStartEditBookmarkNote = (bookmark: ReaderBookmarkResponse) => {
        setSelectedBookmark(bookmark);
        setBookmarkNoteDraft(bookmark.note || "");
        setNotePopupMode("edit");
    };

    const handleSaveBookmarkNote = async () => {
        if (!notePopupMode) return;
        setIsSavingBookmark(true);
        try {
            if (notePopupMode === "create") {
                if (!userId || !book?.id || !pendingBookmarkLocation) return;
                const bookmark = await readerBookmarkService.createBookmark({
                    userId,
                    bookId: book.id,
                    cfiLocation: pendingBookmarkLocation,
                    progressPercentage,
                    label: `Vị trí ${Math.round(progressPercentage)}%`,
                    note: bookmarkNoteDraft.trim(),
                });
                setBookmarks((current) => [bookmark, ...current]);
                setShowBookmarks(true);
            } else if (selectedBookmark) {
                const updated = await readerBookmarkService.updateNote(selectedBookmark.id, { note: bookmarkNoteDraft.trim() });
                setBookmarks((current) => current.map((bookmark) => bookmark.id === selectedBookmark.id ? updated : bookmark));
            }
            closeBookmarkNotePopup();
        } finally {
            setIsSavingBookmark(false);
        }
    };

    const handleDeleteBookmark = async (id: number) => {
        await readerBookmarkService.deleteBookmark(id);
        setBookmarks((current) => current.filter((bookmark) => bookmark.id !== id));
    };

    const handleGoToBookmark = (bookmark: ReaderBookmarkResponse) => {
        setLocation(bookmark.cfiLocation);
        updateProgressPercentage(Number(bookmark.progressPercentage) || 0);
        closeSidebars();
    };

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
            <div className={`absolute top-0 left-0 right-0 z-50 transition-transform duration-300 ${isFocusMode ? "-translate-y-full" : "translate-y-0"}`}
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
                        <h1 className="font-bold text-[15px] truncate max-w-50 md:max-w-md opacity-90">{book.title}</h1>
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
                                onClick={handleAddBookmark}
                                disabled={isSavingBookmark || !location}
                                className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-40 flex items-center justify-center"
                                title="Đánh dấu trang hiện tại"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{isSavingBookmark ? "progress_activity" : "bookmark_add"}</span>
                            </button>
                            <button
                                onClick={() => { setShowBookmarks(true); setShowHighlights(false); setShowTocSidebar(false); setShowPanel(false); }}
                                className={`w-9 h-9 rounded-full transition-colors flex items-center justify-center ${showBookmarks ? "bg-accent/10 text-accent" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
                                title="Danh sách bookmark"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>bookmarks</span>
                            </button>
                            <button
                                onClick={() => setIsHighlightMode((current) => !current)}
                                className={`w-9 h-9 rounded-full transition-colors flex items-center justify-center ${isHighlightMode ? "bg-yellow-400/20 text-yellow-600" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
                                title="Bật/tắt highlight đoạn văn"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>ink_highlighter</span>
                            </button>
                            <button
                                onClick={() => { setShowHighlights(true); setShowBookmarks(false); setShowTocSidebar(false); setShowPanel(false); }}
                                className={`w-9 h-9 rounded-full transition-colors flex items-center justify-center ${showHighlights ? "bg-yellow-400/20 text-yellow-600" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
                                title="Danh sách highlight"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>format_ink_highlighter</span>
                            </button>
                            <button
                                onClick={toggleFocusMode}
                                className={`w-9 h-9 rounded-full transition-colors flex items-center justify-center ${isFocusMode ? "bg-accent/10 text-accent" : "hover:bg-black/5 dark:hover:bg-white/10"}`}
                                title="Chế độ tập trung"
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>center_focus_strong</span>
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
                <div className="h-0.75 w-full bg-black/5 dark:bg-white/5 relative overflow-hidden">
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
                pageSpread={pageSpread}
                fontFamilies={FONT_FAMILIES}
                bgColors={BG_COLORS}
                onFontFamilyChange={(id) => { setFontFamilyId(id as any); }}
                onFontSizeChange={(val) => { setFontSize(val); injectEpubStyles(fontFamilyCss, val, lineHeight, bgColor); }}
                onLineHeightChange={(val) => { setLineHeight(val); injectEpubStyles(fontFamilyCss, fontSize, val, bgColor); }}
                onBgColorChange={(val) => { setBgColor(val); injectEpubStyles(fontFamilyCss, fontSize, lineHeight, val); }}
                onPageSpreadChange={handlePageSpreadChange}
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

            {showBookmarks && (
                <div
                    className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-60 shadow-2xl transition-transform"
                    style={{
                        background: isDark ? "rgba(26,26,46,0.96)" : "rgba(255,255,255,0.96)",
                        color: bgColor.text,
                        backdropFilter: "blur(16px)",
                        borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    }}
                >
                    <div className="h-14 px-4 flex items-center justify-between border-b border-black/5 dark:border-white/10">
                        <div className="font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">bookmarks</span>
                            Bookmark
                        </div>
                        <button onClick={() => setShowBookmarks(false)} className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                        </button>
                    </div>
                    <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-56px)]">
                        {bookmarks.length === 0 ? (
                            <p className="text-sm opacity-60 px-2 py-8 text-center">Chưa có bookmark.</p>
                        ) : bookmarks.map((bookmark) => (
                            <div key={bookmark.id} className="group rounded-xl p-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <button onClick={() => handleGoToBookmark(bookmark)} className="w-full text-left">
                                    <div className="font-semibold text-sm">{bookmark.label || `Vị trí ${Math.round(bookmark.progressPercentage)}%`}</div>
                                    <div className="text-xs opacity-60 mt-1">
                                        {Math.round(bookmark.progressPercentage)}% • {new Date(bookmark.createdAt).toLocaleString("vi-VN")}
                                    </div>
                                </button>

                                {bookmark.note && <div className="mt-2 rounded-lg bg-black/5 p-2 text-sm opacity-80 dark:bg-white/10">{bookmark.note}</div>}
                                <div className="mt-2 flex gap-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleStartEditBookmarkNote(bookmark)} className="text-accent">{bookmark.note ? "Sửa note" : "Thêm note"}</button>
                                    <button onClick={() => handleDeleteBookmark(bookmark.id)} className="text-red-500">Xóa bookmark</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {notePopupMode && (
                <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/45 px-4" onClick={closeBookmarkNotePopup}>
                    <div
                        className="w-full max-w-md rounded-2xl p-5 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: isDark ? "#1a1a2e" : "#ffffff",
                            color: bgColor.text,
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                        }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="font-bold text-lg">{notePopupMode === "create" ? "Thêm bookmark" : "Sửa note bookmark"}</div>
                            <button onClick={closeBookmarkNotePopup} className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                            </button>
                        </div>
                        <label className="mb-2 block text-sm font-semibold opacity-80">Note</label>
                        <textarea
                            value={bookmarkNoteDraft}
                            onChange={(e) => setBookmarkNoteDraft(e.target.value)}
                            className="w-full min-h-32 rounded-xl border border-black/10 bg-transparent p-3 text-sm outline-none focus:border-accent dark:border-white/10"
                            placeholder="Nhập note cho bookmark..."
                            maxLength={1000}
                            autoFocus
                        />
                        <div className="mt-2 text-right text-xs opacity-50">{bookmarkNoteDraft.length}/1000</div>
                        <div className="mt-5 flex justify-end gap-2">
                            <button onClick={closeBookmarkNotePopup} className="rounded-lg px-4 py-2 text-sm font-semibold opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10">Hủy</button>
                            <button
                                onClick={handleSaveBookmarkNote}
                                disabled={isSavingBookmark}
                                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                {isSavingBookmark ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showHighlights && (
                <div
                    className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-60 shadow-2xl transition-transform"
                    style={{
                        background: isDark ? "rgba(26,26,46,0.96)" : "rgba(255,255,255,0.96)",
                        color: bgColor.text,
                        backdropFilter: "blur(16px)",
                        borderLeft: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    }}
                >
                    <div className="h-14 px-4 flex items-center justify-between border-b border-black/5 dark:border-white/10">
                        <div className="font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">format_ink_highlighter</span>
                            Highlight
                        </div>
                        <button onClick={() => setShowHighlights(false)} className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                        </button>
                    </div>
                    <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-56px)]">
                        {highlights.length === 0 ? (
                            <p className="text-sm opacity-60 px-2 py-8 text-center">Chưa có highlight.</p>
                        ) : highlights.map((highlight) => (
                            <div key={highlight.id} className="group rounded-xl p-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                                <button onClick={() => handleGoToHighlight(highlight)} className="w-full text-left">
                                    <div className="text-sm line-clamp-3 border-l-4 pl-3" style={{ borderColor: highlight.color }}>
                                        {highlight.text || "Đoạn đã highlight"}
                                    </div>
                                    <div className="text-xs opacity-60 mt-2">
                                        {new Date(highlight.createdAt).toLocaleString("vi-VN")}
                                    </div>
                                </button>
                                {highlight.note && <div className="mt-2 rounded-lg bg-yellow-400/10 p-2 text-sm opacity-85">{highlight.note}</div>}
                                <div className="mt-2 flex gap-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleStartEditHighlightNote(highlight)} className="text-accent">{highlight.note ? "Sửa note" : "Thêm note"}</button>
                                    <button onClick={() => handleDeleteHighlight(highlight)} className="text-red-500">Xóa highlight</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {highlightNotePopupMode && (
                <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/45 px-4" onClick={closeHighlightNotePopup}>
                    <div
                        className="w-full max-w-md rounded-2xl p-5 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: isDark ? "#1a1a2e" : "#ffffff",
                            color: bgColor.text,
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                        }}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="font-bold text-lg">{highlightNotePopupMode === "create" ? "Thêm highlight" : "Sửa note highlight"}</div>
                            <button onClick={closeHighlightNotePopup} className="w-9 h-9 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center">
                                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
                            </button>
                        </div>
                        {pendingHighlight?.text && (
                            <div className="mb-4 rounded-xl bg-yellow-400/15 p-3 text-sm line-clamp-4">
                                {pendingHighlight.text}
                            </div>
                        )}
                        {selectedHighlight?.text && highlightNotePopupMode === "edit" && (
                            <div className="mb-4 rounded-xl bg-yellow-400/15 p-3 text-sm line-clamp-4">
                                {selectedHighlight.text}
                            </div>
                        )}
                        <label className="mb-2 block text-sm font-semibold opacity-80">Note</label>
                        <textarea
                            value={highlightNoteDraft}
                            onChange={(e) => setHighlightNoteDraft(e.target.value)}
                            className="w-full min-h-32 rounded-xl border border-black/10 bg-transparent p-3 text-sm outline-none focus:border-accent dark:border-white/10"
                            placeholder="Nhập note cho highlight..."
                            maxLength={1000}
                            autoFocus
                        />
                        <div className="mt-2 text-right text-xs opacity-50">{highlightNoteDraft.length}/1000</div>
                        <div className="mt-5 flex justify-end gap-2">
                            <button onClick={closeHighlightNotePopup} className="rounded-lg px-4 py-2 text-sm font-semibold opacity-70 hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10">Hủy</button>
                            <button
                                onClick={handleSaveHighlightNote}
                                disabled={isSavingHighlight}
                                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                {isSavingHighlight ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 w-full">
                <ReactReader
                    url={book.fileUrl}
                    location={location}
                    locationChanged={(epubcfi: string) => {
                        handleLocationChanged(epubcfi);
                        scheduleReapplyHighlights();
                    }}
                    tocChanged={setToc}
                    readerStyles={getReaderStyles(bgColor)}
                    getRendition={(rend: Rendition) => {
                        renditionRef.current = rend;
                        injectEpubStyles(fontFamilyCss, fontSize, lineHeight, bgColor);
                        applyPageSpread(pageSpread);
                        if (progressLoaded && location && lastDisplayedLocationRef.current !== location) {
                            lastDisplayedLocationRef.current = location;
                            (rend as any).display?.(location).catch((err: unknown) => console.error("Không mở được trang đang đọc dở:", err));
                        }
                        scheduleReapplyHighlights();

                        if (highlightEventsBoundRef.current !== rend) {
                            highlightEventsBoundRef.current = rend;
                            (rend as any).on("rendered", scheduleReapplyHighlights);
                            (rend as any).on("relocated", scheduleReapplyHighlights);
                            (rend as any).on("selected", (cfiRange: string, contents: any) => {
                                if (!isHighlightModeRef.current) return;
                                const selectedText = contents?.window?.getSelection?.()?.toString?.() ?? "";
                                handleAddHighlight(cfiRange, selectedText).catch((err) => console.error("Lưu highlight thất bại:", err));
                                contents?.window?.getSelection?.()?.removeAllRanges?.();
                            });
                        }
                    }}
                />
            </div>

            {isFocusMode && (
                <button
                    onClick={toggleFocusMode}
                    className="fixed top-4 right-4 z-70 w-11 h-11 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                    style={{
                        background: isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.88)",
                        color: bgColor.text,
                        backdropFilter: "blur(16px)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
                    }}
                    title="Thoát chế độ tập trung (Esc)"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>fullscreen_exit</span>
                </button>
            )}

            <PaywallOverlay 
                isLimitReached={isLimitReached} 
                bookId={book.id} 
                onReadAgain={handleReadAgain}
            />
        </div>
    );
}