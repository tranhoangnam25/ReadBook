import { useState, useEffect } from 'react';
import './ReadingView.css';

export default function ReadingView() {
    const [activeTab, setActiveTab] = useState('notes');
    const [focusMode, setFocusMode] = useState(false);
    const [documentUrl, setDocumentUrl] = useState('');
    const [displayUrl, setDisplayUrl] = useState('');
    const [fileType, setFileType] = useState(''); // 'pdf' or 'epub'

    // Font customization states
    const [fontSize, setFontSize] = useState(18);
    const [fontFamily, setFontFamily] = useState('georgia');
    const [lineHeight, setLineHeight] = useState(1.8);
    const [theme, setTheme] = useState('light'); // 'light' or 'dark'
    const [showSettings, setShowSettings] = useState(false);

    // Text content states
    const [textContent, setTextContent] = useState('');
    const [showTextInput, setShowTextInput] = useState(false);
    const [pastedText, setPastedText] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionError, setExtractionError] = useState('');

    // PDF viewer states
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pdfError, setPdfError] = useState('');

    // Load PDF.js library from CDN
    const getPdfJs = async () => {
        if (typeof (window as any).pdfjsLib === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            await new Promise((resolve) => {
                script.onload = resolve;
                document.head.appendChild(script);
            });
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        return (window as any).pdfjsLib;
    };

    // Load and display PDF with PDF.js
    const loadPdfForDisplay = async (url: string) => {
        try {
            setPdfError('');
            const pdfJs = await getPdfJs();

            const pdf = await pdfJs.getDocument({ url }).promise;
            setPdfDoc(pdf);
            setTotalPages(pdf.numPages);
            setCurrentPage(1);
            console.log(`PDF loaded: ${pdf.numPages} pages`);
        } catch (error: any) {
            console.error('Error loading PDF:', error);
            setPdfError(error.message || 'Failed to load PDF');
        }
    };

    // Render a specific PDF page to canvas
    const renderPdfPage = async (pageNum: number) => {
        if (!pdfDoc) return;

        try {
            const page = await pdfDoc.getPage(pageNum);
            const canvas = document.getElementById(`pdf-canvas-${pageNum}`) as HTMLCanvasElement;
            if (!canvas) return;

            const viewport = page.getViewport({ scale: 1.5 });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const context = canvas.getContext('2d');
            if (!context) return;

            await page.render({ canvasContext: context, viewport }).promise;
        } catch (error) {
            console.error(`Error rendering page ${pageNum}:`, error);
        }
    };

    const extractTextFromPdf = async (url: string): Promise<string> => {
        try {
            const pdfJs = await getPdfJs();

            // Check if URL is Google Drive - needs special handling
            const isGoogleDrive = url.includes('drive.google.com') || url.includes('docs.google.com');
            let finalUrl = url;

            // Convert Google Drive preview links to direct download & viewable formats
            if (isGoogleDrive) {
                // Extract file ID - handle various URL formats
                let fileId: string | null = null;

                // Try /d/FILE_ID format (most common)
                const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (fileIdMatch) {
                    fileId = fileIdMatch[1];
                } else {
                    // Try ?id=FILE_ID format
                    const idMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
                    if (idMatch) {
                        fileId = idMatch[1];
                    }
                }

                if (!fileId) {
                    throw new Error('Invalid Google Drive URL. Make file public and try again.');
                }

                // Store the preview URL for fallback display
                setDisplayUrl(`https://drive.google.com/file/d/${fileId}/preview`);

                // Try direct download URL
                finalUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                console.log('Converted Google Drive URL to:', finalUrl);
            }

            // Try to load PDF with CORS enabled
            let pdf;
            let lastError: any = null;

            try {
                pdf = await pdfJs.getDocument({
                    url: finalUrl,
                    corsEnabled: true,
                    withCredentials: false
                }).promise;
            } catch (corsError: any) {
                lastError = corsError;

                // Try without CORS flag
                try {
                    pdf = await pdfJs.getDocument({
                        url: finalUrl,
                        corsEnabled: false
                    }).promise;
                } catch (error2) {
                    // If Google Drive, show preview instead
                    if (isGoogleDrive) {
                        console.warn('PDF.js extraction failed for Google Drive, will show preview');
                        throw new Error('GDRIVE_PREVIEW_FALLBACK');
                    }

                    // Try CORS proxy for other URLs
                    try {
                        const proxyUrl = `https://cors-anywhere.herokuapp.com/${finalUrl}`;
                        pdf = await pdfJs.getDocument({ url: proxyUrl }).promise;
                    } catch (error3) {
                        throw lastError;
                    }
                }
            }

            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                try {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    fullText += pageText + '\n\n';
                } catch (pageError) {
                    console.warn(`Failed to extract page ${i}:`, pageError);
                    fullText += `[Unable to extract text from page ${i}]\n\n`;
                }
            }

            if (!fullText.trim()) {
                throw new Error('PDF loaded but no text content found. The PDF may be image-only.');
            }

            return fullText;
        } catch (error: any) {
            console.error('PDF extraction error:', error);
            const errorMsg = error?.message || String(error);
            const errorCode = error?.code;

            // Special case: Google Drive fallback to preview
            if (errorMsg === 'GDRIVE_PREVIEW_FALLBACK') {
                throw new Error('GDRIVE_USE_PREVIEW');
            }

            // More specific error detection
            if (errorMsg.includes('CORS') || errorMsg.includes('cors') || errorCode === 'CORS') {
                throw new Error('For Google Drive PDFs:\n\n📌 EASIEST SOLUTION:\n1. Right-click the PDF → Open with → Google Docs\n2. Copy the text directly from Google Docs\n3. Paste it in the "Paste Text" box below\n\nAlternative: Use CloudConvert.com');
            } else if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('net::ERR')) {
                throw new Error('Cannot extract from Google Drive. No worries!\n\n✨ SIMPLE SOLUTION:\n1. Open file on Google Drive\n2. Right-click → "Open with" → Google Docs\n3. Select all text (Ctrl+A) and copy\n4. Paste here in the text box');
            } else if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('Unauthorized') || errorMsg.includes('Forbidden')) {
                throw new Error('File not accessible. Make sure:\n1. File is shared publicly\n2. OR convert to Google Docs first:\n   Right-click → "Open with" → Google Docs\n   Then copy text from there');
            } else if (errorMsg.includes('image') || errorMsg.includes('scanned')) {
                throw new Error('This PDF is image-only (scanned). Try:\n1. Use OnlineOCR.net (free)\n2. Or paste text manually');
            } else {
                throw new Error('Cannot extract text from this PDF.\n\n💡 BEST SOLUTION:\n1. Right-click PDF on Google Drive\n2. "Open with" → "Google Docs"\n3. Copy text from Google Docs\n4. Paste in the text box below');
            }
        }
    };

    // Load JSZip library from CDN
    const getJSZip = async () => {
        if (typeof (window as any).JSZip === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            await new Promise((resolve) => {
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }
        return (window as any).JSZip;
    };

    const extractTextFromEpub = async (url: string): Promise<string> => {
        try {
            // Fetch EPUB file (which is a ZIP archive)
            const response = await fetch(url, { mode: 'cors' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            // Load JSZip
            const JSZip = await getJSZip();
            const zip = new JSZip();

            // Load the EPUB file
            await zip.loadAsync(arrayBuffer);

            let epubContent = '📚 EPUB CONTENT\n';
            epubContent += '==============\n\n';

            // Get all XHTML/HTML files
            const contentFiles: string[] = [];
            zip.forEach((relativePath, file) => {
                if (relativePath.endsWith('.xhtml') || relativePath.endsWith('.html')) {
                    if (!relativePath.includes('nav') && !relativePath.includes('toc')) {
                        contentFiles.push(relativePath);
                    }
                }
            });

            // Extract text from content files
            contentFiles.sort();
            for (const filePath of contentFiles.slice(0, 10)) { // Limit to first 10 files
                try {
                    const fileContent = await zip.file(filePath).async('string');
                    // Strip HTML tags
                    const textContent = fileContent
                        .replace(/<[^>]*>/g, ' ')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&')
                        .replace(/\n\n+/g, '\n\n')
                        .trim();

                    if (textContent.length > 0) {
                        epubContent += textContent + '\n\n---\n\n';
                    }
                } catch (err) {
                    console.warn(`Could not read ${filePath}:`, err);
                }
            }

            if (epubContent.length < 50) {
                throw new Error('No readable content found in EPUB');
            }

            return epubContent;
        } catch (error: any) {
            console.error('EPUB extraction error:', error);
            const errorMsg = error?.message || String(error);

            if (errorMsg.includes('CORS')) {
                throw new Error('EPUB has CORS restrictions. Download locally first, then:\n1. Use Calibre (free)\n2. Or CloudConvert.com\n3. Or convert to text manually');
            } else if (errorMsg.includes('HTTP 403') || errorMsg.includes('HTTP 401')) {
                throw new Error('Access denied to EPUB file. Make sure it\'s publicly accessible or download it locally.');
            } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
                throw new Error('Cannot download EPUB. Check:\n1. URL is correct\n2. Internet connection\n3. File is publicly accessible');
            } else if (errorMsg.includes('No readable')) {
                throw new Error('EPUB file is empty or corrupted. Try re-downloading or using a different source.');
            } else {
                throw new Error('EPUB extraction failed. The file may be:\n1. Corrupted\n2. In an unsupported format\n3. Try CloudConvert.com (free online converter)');
            }
        }
    };

    const extractTextFromUrl = async (url: string, type: string) => {
        setExtractionError('');
        setIsExtracting(true);

        try {
            let extractedText = '';

            if (type === 'pdf') {
                extractedText = await extractTextFromPdf(url);
            } else if (type === 'epub') {
                extractedText = await extractTextFromEpub(url);
            } else if (type === 'text') {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP ${response.status} error`);
                    extractedText = await response.text();
                } catch (textError: any) {
                    throw new Error(`Failed to load TXT file: ${textError.message}. Check the URL is correct and accessible.`);
                }
            }

            if (extractedText.trim()) {
                setTextContent(extractedText);
            }
            return extractedText;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
            setExtractionError(errorMsg);
            console.error('Text extraction failed:', error);
            throw error;
        } finally {
            setIsExtracting(false);
        }
    };

    const fontFamilyOptions = [
        { value: 'georgia', label: 'Georgia (Serif)' },
        { value: 'inter', label: 'Inter (Sans-serif)' },
        { value: 'courier', label: 'Courier (Monospace)' },
        { value: 'garamond', label: 'Garamond (Classic)' },
    ];

    const handleTextUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setTextContent(text);
            setShowTextInput(false);
        };
        reader.readAsText(file);
    };

    const handlePasteText = () => {
        if (pastedText.trim()) {
            setTextContent(pastedText);
            setPastedText('');
            setShowTextInput(false);
        }
    };

    const parseTextToParagraphs = (text: string) => {
        return text
            .split(/\n\n+/)
            .filter(para => para.trim().length > 0)
            .map((para, idx) => (
                <p key={idx}>{para.trim()}</p>
            ));
    };

    const handleAddDocument = async () => {
        if (!documentUrl.trim()) return;

        setIsExtracting(true);
        setExtractionError('');
        let detectedType = '';
        let downloadUrl = '';

        try {
            // Check for Google Drive links
            if (documentUrl.includes('drive.google.com') || documentUrl.includes('docs.google.com')) {
                const gdriveLinkMatch = documentUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (!gdriveLinkMatch) {
                    throw new Error('Invalid Google Drive link. Make sure URL has /d/FILE_ID format');
                }

                const fileId = gdriveLinkMatch[1];
                downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

                // Try to detect file type - check if URL contains hints
                let isEpub = documentUrl.toLowerCase().includes('epub');
                let isPdf = documentUrl.toLowerCase().includes('pdf');

                // If no extension hint, try PDF first (most common)
                if (!isEpub && !isPdf) {
                    isPdf = true;
                }

                if (isPdf) {
                    detectedType = 'pdf';
                    try {
                        await extractTextFromUrl(downloadUrl, 'pdf');
                    } catch (textError: any) {
                        // Try to load PDF with PDF.js viewer instead
                        console.log('Text extraction failed, trying PDF.js viewer...');
                        try {
                            await loadPdfForDisplay(downloadUrl);
                            setFileType('pdf');
                            setIsExtracting(false);
                            setExtractionError('✅ PDF loaded with PDF.js viewer!\n\n💡 To extract text:\n1️⃣ Right-click PDF → "Open with" → Google Docs\n2️⃣ Copy text from Google Docs\n3️⃣ Click "Paste Text"');
                            return;
                        } catch (pdfError) {
                            throw textError; // Use original error if PDF.js also fails
                        }
                    }
                } else if (isEpub) {
                    detectedType = 'epub';
                    throw new Error('⚠️ Google Drive EPUB Not Supported\n\n❌ Direct extraction not available for EPUB files on Google Drive.\n\n✨ SOLUTIONS:\n1. Download the EPUB locally\n2. Paste your local EPUB link (file:// URL) OR\n3. Use Google Drive for PDF files instead\n\nAlternative: Convert EPUB to PDF on http://cloudconvert.com and Re-upload to Google Drive');
                }
            }
            // Check for EPUB files
            else if (documentUrl.includes('.epub')) {
                detectedType = 'epub';
                await extractTextFromUrl(documentUrl, 'epub');
            }
            // Check for PDF files
            else if (documentUrl.includes('.pdf')) {
                detectedType = 'pdf';
                downloadUrl = documentUrl;
                try {
                    await extractTextFromUrl(documentUrl, 'pdf');
                } catch (textError: any) {
                    // Try PDF.js viewer as fallback
                    console.log('Text extraction failed, trying PDF.js viewer...');
                    try {
                        await loadPdfForDisplay(downloadUrl);
                        setFileType('pdf');
                        setIsExtracting(false);
                        setExtractionError('✅ PDF loaded! Use PDF.js viewer to read.\n\n💡 To copy text: Right-click in PDF → Select & Copy');
                        return;
                    } catch (pdfError) {
                        throw textError;
                    }
                }
            }
            // Check for TXT files
            else if (documentUrl.includes('.txt')) {
                detectedType = 'text';
                await extractTextFromUrl(documentUrl, 'text');
            }
            else {
                throw new Error('Unsupported file type. Supported: .pdf, .epub, .txt, or Google Drive links');
            }

            setFileType(detectedType);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
            setExtractionError(errorMsg);
            console.error('Document loading failed:', error);
        } finally {
            setIsExtracting(false);
        }
    };

    // Render PDF page when it changes
    useEffect(() => {
        if (pdfDoc && currentPage) {
            renderPdfPage(currentPage);
        }
    }, [pdfDoc, currentPage]);

    return (
        <div className="scholar-bg text-text-main antialiased overflow-hidden h-screen flex flex-col">
            {/* TopNavBar */}
            <header className="flex items-center justify-between border-b border-primary/10 px-6 py-3 bg-background-light shrink-0">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="size-6 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-3xl">auto_stories</span>
                        </div>
                        <h2 className="text-primary text-lg font-bold leading-tight tracking-tight uppercase">Lumina Books</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={() => setFocusMode(!focusMode)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span className="text-xs font-semibold uppercase tracking-wider">Focus Mode</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                            <span className="material-symbols-outlined text-sm">library_books</span>
                            <span className="text-xs font-semibold uppercase tracking-wider">Library</span>
                        </button>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-4">
                    <label className="flex items-center bg-white/50 border border-primary/10 rounded-lg px-3 py-1.5 w-96 group relative">
                        <span className="material-symbols-outlined text-primary/60 text-lg">link</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-primary/40"
                            placeholder="Paste Google Drive or PDF link..."
                            value={documentUrl}
                            onChange={(e) => setDocumentUrl(e.target.value)}
                            title="For Google Drive: Right-click → Share → Change to 'Anyone with link' → Copy link"
                        />
                        <button
                            onClick={handleAddDocument}
                            disabled={isExtracting}
                            className="ml-2 px-3 py-1 bg-accent text-white rounded text-xs font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                            {isExtracting ? (
                                <>
                                    <span className="material-symbols-outlined text-xs animate-spin">load</span>
                                    Loading...
                                </>
                            ) : (
                                'Load & Extract'
                            )}
                        </button>
                        {/* Tooltip for Google Drive sharing */}
                        <div className="absolute left-0 bottom-full mb-2 bg-primary text-white text-xs rounded px-3 py-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <p className="font-semibold mb-1">📌 Google Drive Tip:</p>
                            <p>1. Right-click the PDF file</p>
                            <p>2. Click "Share"</p>
                            <p>3. Change to "Anyone with the link"</p>
                            <p>4. Copy and paste the link here</p>
                        </div>
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowTextInput(!showTextInput)}
                            title="Load text content"
                            className="flex items-center justify-center rounded-lg h-9 w-9 bg-white/50 border border-primary/10 text-primary hover:bg-white transition-colors">
                            <span className="material-symbols-outlined text-lg">text_snippet</span>
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="flex items-center justify-center rounded-lg h-9 w-9 bg-white/50 border border-primary/10 text-primary hover:bg-white transition-colors">
                            <span className="material-symbols-outlined text-lg">settings</span>
                        </button>
                        <div
                            className="bg-primary/10 rounded-full size-9 flex items-center justify-center border border-primary/20 overflow-hidden"
                            title="User profile avatar circular portrait">
                            <span className="material-symbols-outlined text-primary">person</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Typography Settings Panel */}
            {showSettings && (
                <div className="bg-background-light border-b border-primary/10 px-6 py-4 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl">
                        {/* Font Size */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest">Font Size</label>
                            <div className="flex items-center gap-3">
                                <span className="text-lg">A</span>
                                <input
                                    type="range"
                                    min="12"
                                    max="32"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-primary/20 rounded-lg cursor-pointer"
                                />
                                <span className="text-lg font-bold">A</span>
                                <span className="text-sm font-bold text-primary/60">{fontSize}px</span>
                            </div>
                        </div>

                        {/* Font Family */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest">Font Style</label>
                            <select
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className="px-3 py-2 bg-white border border-primary/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50">
                                {fontFamilyOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Line Height */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest">Line Height</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="1"
                                    max="2.5"
                                    step="0.1"
                                    value={lineHeight}
                                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                                    className="flex-1 h-2 bg-primary/20 rounded-lg cursor-pointer"
                                />
                                <span className="text-sm font-bold text-primary/60 w-8">{lineHeight.toFixed(1)}</span>
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest">Theme</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all ${theme === 'light'
                                        ? 'bg-accent text-white'
                                        : 'bg-white border border-primary/10 text-primary hover:bg-primary/5'
                                        }`}>
                                    <span className="material-symbols-outlined text-sm">light_mode</span>
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all ${theme === 'dark'
                                        ? 'bg-primary text-white'
                                        : 'bg-white border border-primary/10 text-primary hover:bg-primary/5'
                                        }`}>
                                    <span className="material-symbols-outlined text-sm">dark_mode</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Extraction Error Alert */}
            {extractionError && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5 mx-6 mt-4 flex items-start gap-3">
                    <span className="material-symbols-outlined text-amber-600 mt-0.5 flex-shrink-0 text-2xl">lightbulb</span>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-amber-900 mb-2 text-base">
                            {extractionError.includes('Google') ? '💡 Google Drive Not Supported for Direct Extract' : '⚠️ Unable to Extract Text'}
                        </p>
                        <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-wrap break-words font-medium">{extractionError}</p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 flex-wrap">
                            {/* Paste Text Button - Always show */}
                            <button
                                onClick={() => setShowTextInput(true)}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">content_paste</span>
                                Paste Text Instead
                            </button>

                            {/* Google Drive Specific Help */}
                            {extractionError.includes('Google') && (
                                <a
                                    href="https://drive.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">drive_file_move</span>
                                    Open Google Drive
                                </a>
                            )}

                            {/* CloudConvert */}
                            <a
                                href="https://cloudconvert.com/pdf-to-txt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">open_in_new</span>
                                CloudConvert (Free)
                            </a>
                        </div>

                        {/* Quick Tips Box */}
                        <div className="mt-4 bg-white rounded p-3 border border-amber-200">
                            <p className="text-xs font-bold text-amber-900 mb-2">💡 Quick Solutions:</p>
                            <ul className="text-xs text-amber-800 space-y-1">
                                {extractionError.includes('Google') ? (
                                    <>
                                        <li>✅ <strong>Google Docs Method (EASIEST):</strong> Right-click PDF in Drive → Open with Google Docs → Copy text</li>
                                        <li>✅ <strong>CloudConvert:</strong> Drag & drop PDF → Download text</li>
                                        <li>✅ <strong>Local:</strong> Download PDF → Use CloudConvert locally</li>
                                    </>
                                ) : (
                                    <>
                                        <li>✅ Copy text manually and paste in box below</li>
                                        <li>✅ Use CloudConvert.com (supports PDFs)</li>
                                        <li>✅ Download file locally first</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                    <button
                        onClick={() => setExtractionError('')}
                        className="text-amber-400 hover:text-amber-600 flex-shrink-0 text-2xl">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            {/* Text Content Input Modal */}
            {showTextInput && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-primary">Load Text Content</h3>
                            <button
                                onClick={() => setShowTextInput(false)}
                                className="text-primary/60 hover:text-primary">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Upload File Tab */}
                            <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                <label className="flex flex-col items-center cursor-pointer">
                                    <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">upload_file</span>
                                    <span className="text-primary font-semibold mb-1">Upload TXT file</span>
                                    <span className="text-sm text-primary/60">or drag and drop</span>
                                    <input
                                        type="file"
                                        accept=".txt"
                                        onChange={handleTextUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-primary/10"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-primary/60">OR</span>
                                </div>
                            </div>

                            {/* Paste Text Tab */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-bold text-primary uppercase tracking-widest">Paste Text Content</label>
                                <textarea
                                    value={pastedText}
                                    onChange={(e) => setPastedText(e.target.value)}
                                    placeholder="Paste your text content here (extracted from PDF, EPUB, or any document)..."
                                    className="w-full h-48 p-4 border border-primary/10 rounded-lg focus:ring-2 focus:ring-accent/50 focus:border-transparent resize-none text-sm"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handlePasteText}
                                    disabled={!pastedText.trim()}
                                    className="flex-1 bg-accent text-white font-bold py-3 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    <span className="material-symbols-outlined text-lg mr-2 inline">check</span>
                                    Load Text
                                </button>
                                <button
                                    onClick={() => setShowTextInput(false)}
                                    className="flex-1 bg-primary/10 text-primary font-bold py-3 rounded-lg hover:bg-primary/20 transition-colors">
                                    Cancel
                                </button>
                            </div>

                            <p className="text-xs text-primary/60 text-center">
                                <strong>How to extract text:</strong> Use free online tools like:
                                <div className="mt-2 flex flex-wrap justify-center gap-2">
                                    <a href="https://cloudconvert.com/pdf-to-txt" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">CloudConvert</a>
                                    <span>•</span>
                                    <a href="https://www.zamzar.com/convert/pdf-to-txt/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">Zamzar</a>
                                    <span>•</span>
                                    <a href="https://online2pdf.com/convert-pdf-to-txt" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">Online2PDF</a>
                                </div>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex flex-1 overflow-hidden">
                {/* Left Pane: Book Reader */}
                <section
                    className="flex-1 overflow-y-auto px-16 py-12 scroll-smooth border-r border-primary/5"
                    style={{
                        backgroundColor: theme === 'dark' ? '#1a1a1a' : 'rgba(255, 255, 255, 0.3)',
                    }}>
                    {textContent ? (
                        <div className="max-w-2xl mx-auto">
                            {!textContent.startsWith('Plato') && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-600 mt-0.5">check_circle</span>
                                    <div className="text-sm text-green-800">
                                        <p className="font-semibold">✓ Text Extracted Successfully!</p>
                                        <p className="text-xs text-green-700 mt-1">Automatically converted from PDF to text using PDF.js</p>
                                    </div>
                                </div>
                            )}
                            <header className="mb-12">
                                <p className="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-2">Text Content</p>
                                <h1 className="text-primary text-4xl font-serif font-bold leading-tight italic">Your Document</h1>
                                <button
                                    onClick={() => setTextContent('')}
                                    className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-semibold">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                    Clear Text
                                </button>
                            </header>
                            <article
                                className="text-reading text-lg text-text-main/90 space-y-8"
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: lineHeight,
                                    fontFamily: fontFamily === 'georgia' ? 'Georgia, serif'
                                        : fontFamily === 'inter' ? 'Inter, sans-serif'
                                            : fontFamily === 'courier' ? 'Courier New, monospace'
                                                : 'Garamond, serif',
                                    color: theme === 'dark' ? '#f4f1ea' : '#1a1a1a',
                                    backgroundColor: theme === 'dark' ? '#2c3e50' : 'transparent',
                                    padding: theme === 'dark' ? '2rem' : '0',
                                    borderRadius: theme === 'dark' ? '0.5rem' : '0',
                                }}>
                                {parseTextToParagraphs(textContent)}
                            </article>
                        </div>
                    ) : pdfDoc && fileType === 'pdf' ? (
                        <div className="h-full w-full flex flex-col bg-gray-100">
                            {/* PDF Toolbar */}
                            <div className="bg-white border-b border-primary/10 px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage <= 1}
                                        className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 text-sm font-semibold">
                                        ← Previous
                                    </button>
                                    <span className="text-sm font-semibold text-primary">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage >= totalPages}
                                        className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 text-sm font-semibold">
                                        Next →
                                    </button>
                                </div>
                                <button
                                    onClick={() => setShowTextInput(true)}
                                    className="px-3 py-2 bg-accent text-white rounded hover:bg-accent/90 text-sm font-semibold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base">content_paste</span>
                                    Copy & Paste Text
                                </button>
                            </div>

                            {/* PDF Canvas */}
                            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                                <div className="bg-white shadow-lg rounded">
                                    <canvas
                                        id={`pdf-canvas-${currentPage}`}
                                        className="max-w-full"
                                        onLoad={() => renderPdfPage(currentPage)}
                                    />
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
                                <p className="text-xs text-blue-800">
                                    <strong>💡 Tip:</strong> Use browser's built-in text selection and copy to extract text from the PDF. Or click "Copy & Paste Text" for manual input.
                                </p>
                            </div>
                        </div>
                    ) : displayUrl ? (
                        <div className="h-full w-full flex flex-col">
                            <div className="bg-accent/20 border border-accent/30 rounded-lg p-4 mb-4 flex items-start gap-3">
                                <span className="material-symbols-outlined text-accent mt-0.5">info</span>
                                <div className="text-sm text-primary">
                                    <p className="font-semibold">Want to read as text?</p>
                                    <p className="text-xs text-primary/70 mt-1">
                                        Extract text from this document using
                                        <button
                                            onClick={() => setShowTextInput(true)}
                                            className="text-accent hover:underline font-semibold ml-1">
                                            the text input tool
                                        </button>
                                    </p>
                                </div>
                            </div>
                            {fileType === 'pdf' ? (
                                <iframe
                                    src={displayUrl}
                                    className="flex-1 rounded-lg shadow-lg"
                                    title="PDF Viewer"
                                />
                            ) : fileType === 'epub' ? (
                                <div className="flex-1 flex items-center justify-center bg-white/50 rounded-lg">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">description</span>
                                        <p className="text-primary/60">EPUB Viewer</p>
                                        <p className="text-sm text-primary/40 mt-2">
                                            <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                                Open in external viewer
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <header className="mb-12">
                                <p className="text-accent font-bold tracking-[0.2em] text-xs uppercase mb-2">Plato • Book VII</p>
                                <h1 className="text-primary text-4xl font-serif font-bold leading-tight italic">The Republic</h1>
                            </header>
                            <article
                                className="text-reading text-lg text-text-main/90 space-y-8"
                                style={{
                                    fontSize: `${fontSize}px`,
                                    lineHeight: lineHeight,
                                    fontFamily: fontFamily === 'georgia' ? 'Georgia, serif'
                                        : fontFamily === 'inter' ? 'Inter, sans-serif'
                                            : fontFamily === 'courier' ? 'Courier New, monospace'
                                                : 'Garamond, serif',
                                    color: theme === 'dark' ? '#f4f1ea' : '#1a1a1a',
                                    backgroundColor: theme === 'dark' ? '#2c3e50' : 'transparent',
                                    padding: theme === 'dark' ? '2rem' : '0',
                                    borderRadius: theme === 'dark' ? '0.5rem' : '0',
                                }}>
                                <p>
                                    And now, I said, let me show in a figure how far our nature is enlightened or unenlightened:
                                    —Behold! <span className="highlight-active cursor-help">human beings living in a underground
                                        den</span>, which has a mouth open towards the light and reaching all along the den; here
                                    they have been from their childhood, and have their legs and necks chained so that they cannot
                                    move, and can only see before them, being prevented by the chains from turning round their
                                    heads.
                                </p>
                                <p>
                                    Above and behind them a fire is blazing at a distance, and between the fire and the prisoners
                                    there is a raised way; and you will see, if you look, a low wall built along the way, like the
                                    screen which marionette players have in front of them, over which they show the puppets.
                                </p>
                                <p>
                                    I see.
                                </p>
                                <p>
                                    And do you see, I said, men passing along the wall carrying all sorts of vessels, and statues
                                    and figures of animals made of wood and stone and various materials, which appear over the wall?
                                    Some of them are talking, others silent.
                                </p>
                                <p>
                                    <span className="highlight-active cursor-help">You have shown me a strange image, and they are
                                        strange prisoners.</span>
                                </p>
                                <p>
                                    Like ourselves, I replied; and they see only their own shadows, or the shadows of one another,
                                    which the fire throws on the opposite wall of the cave?
                                </p>
                                <p>
                                    True, he said; how could they see anything but the shadows if they were never allowed to move
                                    their heads?
                                </p>
                                <p>
                                    And of the objects which are being carried in like manner they would only see the shadows?
                                </p>
                                <p>
                                    Yes, he said.
                                </p>
                            </article>
                        </div>
                    )}
                </section>

                {/* Right Pane: Interactive Workspace */}
                <aside className="w-[420px] flex flex-col bg-background-light shadow-2xl border-l border-primary/10">
                    {/* Workspace Navigation */}
                    <nav className="flex border-b border-primary/10 bg-white/20">
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'notes'
                                ? 'text-primary border-primary'
                                : 'text-primary/40 hover:text-primary border-transparent'
                                }`}>
                            Notes
                        </button>
                        <button
                            onClick={() => setActiveTab('lexicon')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'lexicon'
                                ? 'text-primary border-primary'
                                : 'text-primary/40 hover:text-primary border-transparent'
                                }`}>
                            Lexicon
                        </button>
                        <button
                            onClick={() => setActiveTab('entities')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'entities'
                                ? 'text-primary border-primary'
                                : 'text-primary/40 hover:text-primary border-transparent'
                                }`}>
                            Entities
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'history'
                                ? 'text-primary border-primary'
                                : 'text-primary/40 hover:text-primary border-transparent'
                                }`}>
                            History
                        </button>
                    </nav>

                    {/* Notes Workspace Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Annotation Card 1 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-accent/20 group hover:border-accent/50 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">Reference: Page
                                    142</span>
                                <span
                                    className="material-symbols-outlined text-primary/30 text-sm group-hover:text-accent cursor-pointer">push_pin</span>
                            </div>
                            <p className="text-xs italic text-primary/60 border-l-2 border-accent/30 pl-3 mb-3">"...human beings
                                living in a underground den..."</p>
                            <textarea
                                className="w-full bg-background-light/50 border-none focus:ring-accent/20 text-sm p-3 rounded-lg min-h-[80px] resize-none"
                                placeholder="Add your synthesis..."
                                defaultValue="The Allegory of the Cave: This represents the initial state of human ignorance. The 'den' is the world of sensory perception."
                            />
                            <div className="mt-3 flex gap-2">
                                <span
                                    className="px-2 py-0.5 bg-primary/5 text-[10px] text-primary/60 rounded uppercase font-bold tracking-tighter">Metaphor</span>
                                <span
                                    className="px-2 py-0.5 bg-primary/5 text-[10px] text-primary/60 rounded uppercase font-bold tracking-tighter">Ontology</span>
                            </div>
                        </div>

                        {/* Annotation Card 2 */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-primary/5 group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-tighter">Reference: Page
                                    143</span>
                                <span
                                    className="material-symbols-outlined text-primary/30 text-sm group-hover:text-accent cursor-pointer">push_pin</span>
                            </div>
                            <p className="text-xs italic text-primary/60 border-l-2 border-primary/10 pl-3 mb-3">"You have shown me
                                a strange image, and they are strange prisoners."</p>
                            <textarea
                                className="w-full bg-background-light/30 border-none focus:ring-accent/20 text-sm p-3 rounded-lg min-h-[60px] resize-none"
                                placeholder="Add your synthesis..."
                                defaultValue="Glaucon's reaction highlights the radical nature of Socrates' pedagogical method."
                            />
                        </div>

                        {/* Empty State for prompt */}
                        <div className="border-2 border-dashed border-primary/10 rounded-xl p-8 flex flex-col items-center justify-center text-center opacity-60">
                            <span className="material-symbols-outlined text-3xl mb-2 text-primary/20">edit_note</span>
                            <p className="text-xs font-medium text-primary/40 uppercase tracking-widest">Select text to create a new
                                note</p>
                        </div>
                    </div>

                    {/* Workspace Footer / Action Bar */}
                    <div className="p-4 border-t border-primary/10 bg-white/40 flex gap-2">
                        <button
                            className="flex-1 bg-primary text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg">
                            <span className="material-symbols-outlined text-sm">export_notes</span>
                            Export Annotations
                        </button>
                        <button
                            className="aspect-square bg-white border border-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-background-light">
                            <span className="material-symbols-outlined">add</span>
                        </button>
                    </div>
                </aside>
            </main>
            {/* Progress & Location Bar */}
            <footer className="h-12 bg-white border-t border-primary/10 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        Location 2,451 of 8,920
                    </div>
                    <div className="w-px h-3 bg-primary/10"></div>
                    <div>27% Complete</div>
                </div>
                <div className="flex-1 max-w-md mx-8">
                    <div className="w-full bg-primary/5 rounded-full h-1.5 relative">
                        <div className="absolute left-0 top-0 h-full bg-accent rounded-full" style={{ width: '27%' }}></div>
                        {/* Bookmark markers */}
                        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 size-1.5 bg-primary rounded-full border border-white"></div>
                        <div className="absolute left-[27%] top-1/2 -translate-y-1/2 size-2 bg-accent rounded-full border-2 border-white ring-2 ring-accent/20"></div>
                        <div className="absolute left-[60%] top-1/2 -translate-y-1/2 size-1.5 bg-primary/20 rounded-full"></div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="material-symbols-outlined text-primary/60 hover:text-primary">chevron_left</button>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Chapter VII</span>
                    <button className="material-symbols-outlined text-primary/60 hover:text-primary">chevron_right</button>
                    <div className="w-px h-3 bg-primary/10 mx-2"></div>
                    <button className="material-symbols-outlined text-primary/60 hover:text-primary">bookmark</button>
                </div>
            </footer>
        </div>
    );
}