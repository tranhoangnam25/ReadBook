import { useState, useRef, useEffect, useCallback } from "react";
import type { Rendition } from "epubjs";
import { bookService } from "../services/bookService";
import { getStoredUserId } from "../services/authService";
import { readerSettingService } from "../services/readerSettingService";
import { BG_COLORS, FONT_FAMILIES } from "../constants/readerConstants";
import type { TocItem, BookResponse, FontFamilyId, BackgroundColorId } from "../types";

export function useEpubReader(bookId: string | undefined, book: BookResponse | null) {
    const [location, setLocation] = useState<string | number>(0);
    const [progressLoaded, setProgressLoaded] = useState(false);
    const initialLocationLoaded = useRef(false); 
    const [toc, setToc] = useState<TocItem[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const [isPurchased, setIsPurchased] = useState(false);
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);
    
    const [fontFamilyId, setFontFamilyId] = useState<FontFamilyId>("DEFAULT");
    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.8);
    const [bgColor, setBgColor] = useState(BG_COLORS[0]);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const [settingsLoaded, setSettingsLoaded] = useState(false);

    const fontFamilyCss = FONT_FAMILIES.find(f => f.id === fontFamilyId)?.value ?? "inherit";

    const renditionRef = useRef<Rendition | null>(null);
    const saveProgressInterval = useRef<NodeJS.Timeout | null>(null);
    const saveProgressDebounce = useRef<NodeJS.Timeout | null>(null);
    const locationsReadyRef = useRef(false);

    const latestLocation = useRef<string | number>(location);
    const latestPercentage = useRef<number>(0);

    const paywallKey = `paywall_reached_${bookId}`;

    useEffect(() => {
        const uid = getStoredUserId();
        const currentUserId = uid ? Number(uid) : null;
        setUserId(currentUserId);
        
        if (currentUserId) {
     
            readerSettingService.getReaderSettings(currentUserId)
                .then(settings => {
                    if (settings) {
                        setFontFamilyId(settings.fontFamily);  
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

    useEffect(() => {
        const loadAccessAndProgress = async () => {
            if (!userId || !bookId) {
                initialLocationLoaded.current = true;
                setProgressLoaded(true);
                return;
            }

            try {
                const purchased = await bookService.checkPurchased(userId, Number(bookId));
                setIsPurchased(purchased);

                if (!purchased) {
                    setLocation(0);
                    setProgressPercentage(0);
                    latestLocation.current = 0;
                    latestPercentage.current = 0;
                    initialLocationLoaded.current = true;
                    setProgressLoaded(true);
                    return;
                }

                const progressData = await bookService.getReadingProgress(userId, Number(bookId));
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
            } catch (err) {
                console.error("Lỗi kiểm tra quyền đọc hoặc tải tiến độ:", err);
                initialLocationLoaded.current = true;
                setProgressLoaded(true);
            }
        };

        setProgressLoaded(false);
        initialLocationLoaded.current = false;
        loadAccessAndProgress();
    }, [userId, bookId]);

    useEffect(() => {
        if (!bookId) return;

        if (isPurchased) {
            sessionStorage.removeItem(paywallKey);
            setIsLimitReached(false);
            return;
        }

        const reached = sessionStorage.getItem(paywallKey) === 'true';
        setIsLimitReached(reached);
    }, [bookId, isPurchased, paywallKey]);

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

    useEffect(() => {
        if (renditionRef.current) {
            injectEpubStyles(fontFamilyCss, fontSize, lineHeight, bgColor);
        }
    }, [fontFamilyCss, fontSize, lineHeight, bgColor, injectEpubStyles]);

  
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

 
    useEffect(() => {
        if (!userId || !bookId || !isPurchased) return;

        const saveProgress = () => {
            if (!initialLocationLoaded.current) return;
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
            saveProgress(); 
            if (saveProgressInterval.current) clearInterval(saveProgressInterval.current);
            window.removeEventListener('beforeunload', saveProgress);
        };
    }, [userId, bookId, isPurchased]);

    const handleReadAgain = () => {
        sessionStorage.removeItem(paywallKey);
        setIsLimitReached(false);
        setLocation(0); 
    };

    const ensureLocationsReady = useCallback(async (rend: Rendition): Promise<boolean> => {
        const bookLocations = (rend.book as any)?.locations;
        if (!bookLocations || locationsReadyRef.current) return true;

        const hasLocations = typeof bookLocations.length === "function" && bookLocations.length() > 0;
        if (hasLocations) {
            locationsReadyRef.current = true;
            return true;
        }

        if (typeof bookLocations.generate !== "function") return false;

        try {
            await bookLocations.generate(1024);
            locationsReadyRef.current = true;
            return true;
        } catch (err) {
            console.error("Không tạo được dữ liệu vị trí EPUB:", err);
            return false;
        }
    }, []);

    const calculatePositionPercent = useCallback((rend: Rendition, epubcfi: string): number => {
        const bookLocations = (rend.book as any)?.locations;
        if (bookLocations && typeof bookLocations.percentageFromCfi === "function") {
            const percent = bookLocations.percentageFromCfi(epubcfi);
            if (Number.isFinite(percent)) {
                return Math.min(Math.max(Math.round(percent * 1000) / 10, 0), 100);
            }
        }

        return latestPercentage.current;
    }, []);

    const updateProgressPercentage = useCallback((percent: number) => {
        const safePercent = Math.min(Math.max(percent, 0), 100);
        setProgressPercentage(safePercent);
        latestPercentage.current = safePercent;
    }, []);

    const handleLocationChanged = useCallback((epubcfi: string) => {
        setLocation(epubcfi);
        latestLocation.current = epubcfi;

        const rend = renditionRef.current;
        if (!rend) return;

        ensureLocationsReady(rend).then(() => {
            const percentValue = calculatePositionPercent(rend, epubcfi);
            updateProgressPercentage(percentValue);

            if (!isPurchased && book && book.previewPercentage != null) {
                const limit = book.previewPercentage < 1 ? book.previewPercentage * 100 : book.previewPercentage;
                if (percentValue > limit) {
                    setIsLimitReached(true);
                    sessionStorage.setItem(paywallKey, 'true');
                }
            }

            if (initialLocationLoaded.current && userId && bookId && isPurchased) {
                if (saveProgressDebounce.current) clearTimeout(saveProgressDebounce.current);
                saveProgressDebounce.current = setTimeout(() => {
                    bookService.saveReadingProgress(userId, Number(bookId), epubcfi, percentValue)
                        .catch(e => console.error("Lưu tiến độ thất bại (debounce):", e));
                }, 2000);
            }
        });
    }, [isPurchased, book, ensureLocationsReady, calculatePositionPercent, updateProgressPercentage, paywallKey, userId, bookId]);

    return {
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
        isSavingSettings,
        settingsLoaded,
        progressLoaded,
        injectEpubStyles,
        handleSaveSettings,
        handleReadAgain
    };
}
