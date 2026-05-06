import React from "react";
import type { TocItem } from "../../types";

interface TocSidebarProps {
    showTocSidebar: boolean;
    isDark: boolean;
    bgColor: { value: string; text: string };
    toc: TocItem[];
    onClose: () => void;
    onLocationChange: (href: string) => void;
}

const TocSidebar: React.FC<TocSidebarProps> = ({
    showTocSidebar,
    isDark,
    bgColor,
    toc,
    onClose,
    onLocationChange,
}) => {
    const renderTocItems = (items: TocItem[], level = 0) => {
        return items.map((item, index) => (
            <li key={`${level}-${index}`}>
                <button
                    onClick={() => {
                        onLocationChange(item.href);
                        onClose();
                    }}
                    className="w-full text-left py-3 px-4 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 text-[13.5px] truncate flex items-center gap-3 group"
                    style={{
                        color: bgColor.text,
                        paddingLeft: `${level * 16 + 16}px`
                    }}
                >
                    {level > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-20 group-hover:opacity-50 shrink-0 transition-opacity" />
                    )}
                    <span className="truncate">{item.label}</span>
                </button>
                {item.subitems && item.subitems.length > 0 && (
                    <ul className="space-y-0.5">
                        {renderTocItems(item.subitems, level + 1)}
                    </ul>
                )}
            </li>
        ));
    };

    return (
        <>
            <div className={`fixed inset-y-0 left-0 z-[60] w-[320px] shadow-2xl transform transition-transform duration-500 ease-in-out ${showTocSidebar ? "translate-x-0" : "-translate-x-full"}`}
                 style={{ 
                     background: bgColor.value, 
                     color: bgColor.text,
                     borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` 
                 }}>
                <div className="h-14 px-6 flex justify-between items-center" style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    <h2 className="font-bold text-[16px] tracking-tight opacity-90">Mục lục</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-56px)] px-4 py-4 custom-scrollbar">
                    {toc.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 opacity-40">
                            <span className="material-symbols-outlined mb-2 text-3xl">menu_book</span>
                            <p className="text-xs font-medium">Chưa tìm thấy mục lục</p>
                        </div>
                    ) : (
                        <ul className="space-y-1">
                            {renderTocItems(toc)}
                        </ul>
                    )}
                </div>
            </div>

            {showTocSidebar && (
                <div className="fixed inset-0 z-[55] backdrop-blur-[2px]" 
                     style={{ background: "rgba(0,0,0,0.3)" }} 
                     onClick={onClose} />
            )}
        </>
    );
};

export default TocSidebar;
