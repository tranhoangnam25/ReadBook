import { useState, useRef, useEffect, useCallback } from "react";
import type { Rendition } from "epubjs";
import { bookService } from "../services/bookService";
import { getStoredUserId } from "../services/authService";
import { readerSettingService } from "../services/readerSettingService";
import { BG_COLORS, FONT_FAMILIES } from "../constants/readerConstants";
import type { TocItem, BookResponse, FontFamilyId, BackgroundColorId } from "../types";

export function useEpubReader(bookId: string | undefined, book: BookResponse | null, isSample: boolean) {
    const [location, setLocation] = useState<string | number>(0);
    const [progressLoaded, setProgressLoaded] = useState(false);
    const initialLocationLoaded = useRef(false); // Cờ chặn ghi đè khi chưa tải xong
    const [toc, setToc] = useState<TocItem[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);
    
    // Settings state — fontFamilyId stores the Enum ID (for DB), CSS value is derived
    const [fontFamilyId, setFontFamilyId] = useState<FontFamilyId>("DEFAULT");
    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.8);
    const [bgColor, setBgColor] = useState(BG_COLORS[0]);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    // Derived CSS value from fontFamilyId
    const fontFamilyCss = FONT_FAMILIES.find(f => f.id === fontFamilyId)?.value ?? "inherit";

    const renditionRef = useRef<Rendition | null>(null);
    const saveProgressInterval = useRef<NodeJS.Timeout | null>(null);
    const saveProgressDebounce = useRef<NodeJS.Timeout | null>(null);
    const pageFlipsRef = useRef(0);

    const latestLocation = useRef<string | number>(location);
    const latestPercentage = useRef<number>(0);

    const paywallKey = `paywall_reached_${bookId}`;

    // Initial load: User & Settings (Only once on mount)
    useEffect(() => {
        const uid = getStoredUserId();
        const currentUserId = uid ? Number(uid) : null;
        setUserId(currentUserId);
        
        if (currentUserId) {
            // Load Settings
            readerSettingService.getReaderSettings(currentUserId)
                .then(settings => {
                    if (settings) {
                        setFontFamilyId(settings.fontFamily);  // Enum ID from DB
                        setFontSize(settings.fontSize);
                        setLineHeight(settings.lineHeight);
                        const bg = BG_COLORS.find(c => c.id === settings.backgroundColor);
                        if (bg) setBgColor(bg);
                    }
                })
                .catch(err => console.error("Không load được cài đặt:", err))
                .finally(() => setSettingsLoaded(true));
        } else {
            setSettingsLoaded(true);
        }
    }, []);

    // Load Progress (Runs whenever bookId or userId changes)
    useEffect(() => {
        if (userId && bookId) {
            bookService.getReadingProgress(userId, Number(bookId))
                .then(progressData => {
                    if (progressData) {
                        if (progressData.cfiLocation) {
                            setLocation(progressData.cfiLocation);
                            latestLocation.current = progressData.cfiLocation;
                            initialLocationLoaded.current = true;
                        }
                        if (progressData.progressPercentage != null) {
                            const percent = Number(progressData.progressPercentage);
                            setProgressPercentage(percent);
                            latestPercentage.current = percent;
                        }
                    }
                    setProgressLoaded(true);
                })
                .catch(err => {
                    console.error("Lỗi tải tiến độ:", err);
                    initialLocationLoaded.current = true; 
                    setProgressLoaded(true);
                });
        } else {
            // Nếu chưa đăng nhập, bỏ qua tải tiến độ và cho phép hiển thị sách
            initialLocationLoaded.current = true;
            setProgressLoaded(true);
        }
    }, [userId, bookId]);

    // Check Paywall from sessionStorage on init
    useEffect(() => {
        if (bookId) {
            const reached = sessionStorage.getItem(paywallKey) === 'true';
            setIsLimitReached(reached);
        }
    }, [bookId, paywallKey]);

    // Apply styles to rendition — receives CSS values directly
    const injectEpubStyles = useCallback((ffCss: string, fs: number, lh: number, bg: typeof BG_COLORS[0]) => {
        const rend = renditionRef.current;
        if (!rend) return;
        rend.themes.default({
            body: {
                "font-family": `${ffCss} !important`,
                "font-size": `${fs}px !important`,
                "background": `${bg.value} !important`,
                "color": `${bg.text} !important`,
                "line-height": `${lh} !important`,
                "padding-top": "40px !important",
                "padding-bottom": "60px !important",
            },
            "p, span, h1, h2, h3, h4, h5, h6, li, a, div, section": { 
                "font-family": `${ffCss} !important`,
                "color": `${bg.text} !important`,
                "background-color": "transparent !important"
            }
        });
        rend.themes.select("default");
    }, []);

    // Auto-apply styles when settings change or rendition is ready
    useEffect(() => {
        if (renditionRef.current) {
            injectEpubStyles(fontFamilyCss, fontSize, lineHeight, bgColor);
        }
    }, [fontFamilyCss, fontSize, lineHeight, bgColor, injectEpubStyles]);

    // Save settings to database using Enum IDs
    const handleSaveSettings = async () => {
        if (!userId) return;
        setIsSavingSettings(true);
        try {
            await readerSettingService.saveReaderSettings({
                userId,
                fontFamily: fontFamilyId,
                fontSize,
                lineHeight,
                backgroundColor: bgColor.id as BackgroundColorId,
            });
        } catch (err) {
            console.error("Lưu cài đặt thất bại:", err);
        } finally {
            setTimeout(() => setIsSavingSettings(false), 2000);
        }
    };

    // Auto-save Progress periodically and on Unmount/BeforeUnload
    useEffect(() => {
        if (!userId || !bookId || isSample) return;

        const saveProgress = () => {
            if (!initialLocationLoaded.current) return; // Chặn lưu nếu chưa load xong
            const cfi = latestLocation.current;
            const percent = latestPercentage.current;
            if (cfi && typeof cfi === "string") {
                bookService.saveReadingProgress(userId, Number(bookId), cfi, percent)
                    .catch(e => console.error("Lưu tiến độ thất bại:", e));
            }
        };

        saveProgressInterval.current = setInterval(saveProgress, 30000);
        window.addEventListener('beforeunload', saveProgress);

        return () => {
            saveProgress(); // Save when leaving the page (component unmount)
            if (saveProgressInterval.current) clearInterval(saveProgressInterval.current);
            window.removeEventListener('beforeunload', saveProgress);
        };
    }, [userId, bookId, isSample]);

    const handleReadAgain = () => {
        sessionStorage.removeItem(paywallKey);
        setIsLimitReached(false);
        setLocation(0); // Reset to start
    };

    const calculatePositionPercent = useCallback((rend: Rendition): number => {
        const loc = rend.location?.start;
        if (!loc) return 0;

        const spineItems = (rend.book as any)?.spine?.items ?? [];
        const spineTotal: number = spineItems.length;
        const currentIndex: number = loc.index ?? 0;

        if (spineTotal > 1) {
            return Math.round((currentIndex / spineTotal) * 100 * 10) / 10;
        }

        const displayed = loc.displayed;
        if (displayed && displayed.total > 1) {
            return Math.round((displayed.page / displayed.total) * 100 * 10) / 10;
        }

        const estimatedTotalPages = 300;
        return Math.min(Math.round((pageFlipsRef.current / estimatedTotalPages) * 100 * 10) / 10, 100);
    }, []);

    const handleLocationChanged = useCallback((epubcfi: string) => {
        setLocation(epubcfi);
        latestLocation.current = epubcfi;
        pageFlipsRef.current += 1;

        const rend = renditionRef.current;
        const percentValue = rend ? calculatePositionPercent(rend) : 0;
        setProgressPercentage(percentValue);
        latestPercentage.current = percentValue;

        if (isSample && book && book.previewPercentage != null) {
            const limit = book.previewPercentage < 1 ? book.previewPercentage * 100 : book.previewPercentage;
            if (percentValue > limit) {
                setIsLimitReached(true);
                sessionStorage.setItem(paywallKey, 'true');
            }
        }

        // Tự động lưu tiến độ sau 2 giây khi ngừng lật trang (Debounce)
        if (initialLocationLoaded.current && userId && bookId && !isSample) {
            if (saveProgressDebounce.current) clearTimeout(saveProgressDebounce.current);
            saveProgressDebounce.current = setTimeout(() => {
                bookService.saveReadingProgress(userId, Number(bookId), epubcfi, percentValue)
                    .catch(e => console.error("Lưu tiến độ thất bại (debounce):", e));
            }, 2000);
        }
    }, [isSample, book, calculatePositionPercent, paywallKey, userId, bookId]);

    return {
        location,
        setLocation,
        toc,
        setToc,
        userId,
        isLimitReached,
        progressPercentage,
        renditionRef,
        handleLocationChanged,
        // Settings exports
        fontFamilyId,       // Enum ID (for DB & panel selection)
        setFontFamilyId,
        fontFamilyCss,      // CSS value (for EPUB injection)
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
    };
}
