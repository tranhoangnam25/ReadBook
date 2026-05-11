import React from "react";

interface BgColor {
    id: string;
    label: string;
    value: string;
    text: string;
}

interface FontOption {
    id: string;
    label: string;
    value: string;
}

interface ReaderSettingsPanelProps {
    showPanel: boolean;
    isDark: boolean;
    fontFamilyId: string;
    fontSize: number;
    lineHeight: number;
    bgColor: BgColor;
    fontFamilies: FontOption[];
    bgColors: BgColor[];
    onFontFamilyChange: (id: string) => void;
    onFontSizeChange: (value: number) => void;
    onLineHeightChange: (value: number) => void;
    onBgColorChange: (color: BgColor) => void;
    onSaveSettings: () => void;
    isSaving: boolean;
}

const ReaderSettingsPanel = React.forwardRef((props: ReaderSettingsPanelProps, ref: React.Ref<HTMLDivElement>) => {
    const {
        showPanel,
        isDark,
        fontFamilyId,
        fontSize,
        lineHeight,
        bgColor,
        fontFamilies,
        bgColors,
        onFontFamilyChange,
        onFontSizeChange,
        onLineHeightChange,
        onBgColorChange,
        onSaveSettings,
        isSaving,
    } = props;
    const labelStyle: React.CSSProperties = {
        fontSize: 12,
        color: isDark ? "#aaa" : "#888",
        marginBottom: 6,
        fontWeight: 500,
        letterSpacing: 0.5,
        textTransform: "uppercase",
    };

    return (
        <div 
            ref={ref}
            className={`settings-panel absolute right-4 z-[100] transition-all duration-300 ease-out origin-top-right ${showPanel ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
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
            
            <div className="mb-5">
                <div style={labelStyle}>Phông chữ</div>
                <div className="flex flex-col gap-1.5">
                    {fontFamilies.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => onFontFamilyChange(f.id)}
                            className="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
                            style={{
                                background: fontFamilyId === f.id ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "transparent",
                                fontFamily: f.value,
                                fontSize: 14,
                                color: fontFamilyId === f.id ? (isDark ? "#fff" : "#000") : (isDark ? "#bbb" : "#555"),
                                fontWeight: fontFamilyId === f.id ? 600 : 400,
                            }}
                        >
                            {f.label}
                            {fontFamilyId === f.id && <span className="material-symbols-outlined text-[16px]">check</span>}
                        </button>
                    ))}
                </div>
            </div>

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
                    onChange={(e) => onFontSizeChange(Number(e.target.value))}
                    className="w-full mb-1"
                    style={{ accentColor: isDark ? "#fff" : "#000" }}
                />
                <div className="flex justify-between text-[10px] opacity-50 px-1">
                    <span>A-</span>
                    <span>A+</span>
                </div>
            </div>

            <div className="mb-5">
                <div className="flex justify-between items-end mb-2">
                    <div style={{...labelStyle, marginBottom: 0}}>Giãn dòng</div>
                    <span className="text-xs font-bold" style={{ color: isDark ? "#fff" : "#000" }}>{lineHeight}</span>
                </div>
                <input
                    type="range"
                    min={1.2}
                    max={2.5}
                    step={0.1}
                    value={lineHeight}
                    onChange={(e) => onLineHeightChange(Number(e.target.value))}
                    className="w-full mb-1"
                    style={{ accentColor: isDark ? "#fff" : "#000" }}
                />
            </div>

            <div className="mb-5">
                <div style={labelStyle}>Màu nền & Giao diện</div>
                <div className="flex gap-2 flex-wrap mt-2">
                    {bgColors.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => onBgColorChange(c)}
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

            <button
                onClick={onSaveSettings}
                disabled={isSaving}
                className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSaving 
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
                        : (isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800")
                }`}
            >
                {isSaving ? (
                    <>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Đã lưu!
                    </>
                ) : (
                    "Lưu cài đặt"
                )}
            </button>
        </div>
    );
});

export default ReaderSettingsPanel;
