import React, { useEffect, useState, useRef } from 'react';
import {
  Printer,
  ExternalLink,
  Download,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy
} from 'lucide-react';

export interface PrintDocumentPayload {
  title: string;
  html: string;
  orientation: 'portrait' | 'landscape';
  blobUrl: string;
}

export const UniversalPrintModal: React.FC = () => {
  const [docData, setDocData] = useState<PrintDocumentPayload | null>(null);
  const [copied, setCopied] = useState(false);
  const [printNotice, setPrintNotice] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handleOpenPrint = (e: Event) => {
      const customEvent = e as CustomEvent<PrintDocumentPayload>;
      if (customEvent.detail) {
        setDocData(customEvent.detail);
        setPrintNotice(null);
      }
    };

    window.addEventListener('samura:open-print-preview', handleOpenPrint);
    return () => {
      window.removeEventListener('samura:open-print-preview', handleOpenPrint);
    };
  }, []);

  if (!docData) return null;

  const isLandscape = docData.orientation === 'landscape';

  const handlePrint = () => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
      } else {
        window.print();
      }
    } catch (err) {
      console.warn('Direct print inside preview blocked by iframe sandbox:', err);
      setPrintNotice(
        'Embedded preview security policy restricts direct print dialog. Click "Open in New Tab" to print directly with system dialog.'
      );
    }
  };

  const handleOpenNewTab = () => {
    try {
      if (docData.blobUrl) {
        const opened = window.open(docData.blobUrl, '_blank');
        if (!opened) {
          // Fallback: create temporary link element
          const link = document.createElement('a');
          link.href = docData.blobUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      }
    } catch (e) {
      console.error('Failed to open document in new tab', e);
    }
  };

  const handleDownloadHtml = () => {
    try {
      const blob = new Blob([docData.html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${docData.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download document HTML', e);
    }
  };

  const handleCopyText = () => {
    try {
      // Strip HTML tags to get plain text representation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = docData.html;
      const plainText = tempDiv.innerText || tempDiv.textContent || '';
      navigator.clipboard.writeText(plainText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (e) {
      console.error('Failed to copy text', e);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col bg-black/75 backdrop-blur-xs text-[#18211F] font-['Inter',sans-serif] animate-in fade-in duration-150">
      {/* Top Action Header Bar */}
      <header className="px-4 sm:px-6 py-3 bg-[#073F37] text-white border-b border-[#0E5A4F] flex items-center justify-between shadow-lg shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#0E5A4F] border border-[#22A06B]/40 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-[#22A06B]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {docData.title}
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#0E5A4F] text-[#E6F4ED] border border-[#22A06B]/30 uppercase tracking-wider">
                {docData.orientation} A4
              </span>
            </div>
            <p className="text-[11px] text-[#A3B8B0] truncate">
              AL SAMURA GROUP Enterprise Official Print Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="print-modal-print-btn"
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-[#22A06B] hover:bg-[#1E8E5E] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Send to Printer (Ctrl+P)"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button
            id="print-modal-newtab-btn"
            type="button"
            onClick={handleOpenNewTab}
            className="px-3 py-1.5 rounded-lg bg-[#0E5A4F] hover:bg-[#136C5F] text-white font-semibold text-xs border border-[#22A06B]/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Open in new browser tab to print directly with system dialog"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#22A06B]" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </button>

          <button
            id="print-modal-download-btn"
            type="button"
            onClick={handleDownloadHtml}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs border border-white/15 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Download Document HTML"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            id="print-modal-copy-btn"
            type="button"
            onClick={handleCopyText}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs border border-white/15 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Copy document text"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22A06B]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          <button
            id="print-modal-close-btn"
            type="button"
            onClick={() => setDocData(null)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close Print Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Info Notice if iframe sandbox restricts direct modal dialog */}
      {printNotice && (
        <div className="bg-[#FFF8E6] border-b border-[#FAD382] px-4 py-2 text-xs text-[#946300] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>{printNotice}</span>
          </div>
          <button
            onClick={handleOpenNewTab}
            className="underline font-bold text-[#0E5A4F] hover:text-[#073F37] ml-3 shrink-0 cursor-pointer"
          >
            Open in New Tab Now →
          </button>
        </div>
      )}

      {/* Main Document Preview Stage */}
      <main className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center items-start bg-[#E2E8F0]">
        <div
          className={`bg-white shadow-2xl rounded-sm overflow-hidden my-auto transition-all ${
            isLandscape
              ? 'w-full max-w-[1100px] min-h-[750px]'
              : 'w-full max-w-[850px] min-h-[900px]'
          }`}
          style={{
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.08)'
          }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={docData.html}
            title={docData.title}
            className="w-full h-full min-h-[850px] border-none"
            style={{ display: 'block', width: '100%', minHeight: isLandscape ? '750px' : '950px' }}
          />
        </div>
      </main>
    </div>
  );
};
