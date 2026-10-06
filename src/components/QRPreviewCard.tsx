import { useRef, useState, type FC } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { 
  Download, 
  Copy, 
  Check, 
  FileDown, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Maximize2, 
  FileText,
  ChevronDown
} from 'lucide-react';
import type { QROptions } from '../types/qr';
import { 
  downloadQRPNG, 
  downloadQRSVG, 
  copyQRImageToClipboard, 
  generatePrintablePDFFlyer 
} from '../utils/qrExporter';

interface QRPreviewCardProps {
  options: QROptions;
  title: string;
  onSaveToHistory: () => void;
  isSaved: boolean;
  onOpenProjector: () => void;
}

export const QRPreviewCard: FC<QRPreviewCardProps> = ({
  options,
  title,
  onSaveToHistory,
  isSaved,
  onOpenProjector,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const [copying, setCopying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadDropdown, setDownloadDropdown] = useState(false);

  const getSourceCanvas = (): HTMLCanvasElement | null => {
    return canvasContainerRef.current?.querySelector('canvas') || null;
  };

  const getSourceSVG = (): SVGSVGElement | null => {
    return svgContainerRef.current?.querySelector('svg') || null;
  };

  const handleCopyClipboard = async () => {
    const canvas = getSourceCanvas();
    if (!canvas) return;

    setCopying(true);
    const ok = await copyQRImageToClipboard(canvas, options);
    setTimeout(() => setCopying(false), ok ? 2000 : 800);
  };

  const handleDownloadPNG = async (res: number, label: string) => {
    const canvas = getSourceCanvas();
    if (!canvas) return;

    setDownloading(true);
    setDownloadDropdown(false);
    const safeTitle = (title || 'buildicy-qr').toLowerCase().replace(/[^a-z0-9]/g, '-');
    await downloadQRPNG(canvas, options, res, `${safeTitle}-${label}.png`);
    setDownloading(false);
  };

  const handleDownloadSVG = () => {
    const svg = getSourceSVG();
    if (!svg) return;

    setDownloadDropdown(false);
    const safeTitle = (title || 'buildicy-qr').toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadQRSVG(svg, `${safeTitle}-vector.svg`);
  };

  const handleDownloadPDFFlyer = async () => {
    const canvas = getSourceCanvas();
    if (!canvas) return;

    setDownloading(true);
    setDownloadDropdown(false);
    await generatePrintablePDFFlyer(
      canvas,
      options,
      options.frameText || title || 'Scan QR Code',
      options.frameSubtext || 'Point your camera to connect'
    );
    setDownloading(false);
  };

  const logoSettings = options.logoUrl
    ? {
        src: options.logoUrl,
        x: undefined,
        y: undefined,
        height: Math.round(260 * options.logoSizePercent),
        width: Math.round(260 * options.logoSizePercent),
        excavate: options.excavateLogo,
      }
    : undefined;

  return (
    <div className="space-y-4">
      {/* Matte Pedestal Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A10]/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center">
        {/* Subtle radial sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.08),transparent_60%)] pointer-events-none" />

        {/* Card Header */}
        <div className="w-full flex items-center justify-between mb-4 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">Live Preview</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onSaveToHistory}
              className={`p-1.5 px-2.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                  : 'bg-[#12121D] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-medium">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={onOpenProjector}
              title="Full Stage Mode"
              className="p-1.5 rounded-lg bg-[#12121D] hover:bg-[#181828] border border-white/5 text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Frame Wrapper */}
        <div className="z-10 w-full flex items-center justify-center py-2 sm:py-4">
          {options.frameStyle === 'none' && (
            <div
              className={`p-4 rounded-2xl shadow-xl transition-all duration-200 ${
                options.isTransparentBg ? 'border border-dashed border-white/20' : ''
              }`}
              style={{ backgroundColor: options.isTransparentBg ? 'transparent' : options.bgColor }}
            >
              <div ref={canvasContainerRef}>
                <QRCodeCanvas
                  value={options.rawValue || 'https://buildicy.com'}
                  size={240}
                  fgColor={options.fgColor}
                  bgColor={options.isTransparentBg ? 'rgba(0,0,0,0)' : options.bgColor}
                  level={options.level}
                  marginSize={options.marginSize}
                  imageSettings={logoSettings}
                />
              </div>
            </div>
          )}

          {options.frameStyle === 'bottom-banner' && (
            <div
              className="rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center border border-black/10"
              style={{ backgroundColor: options.isTransparentBg ? '#FFFFFF' : options.bgColor }}
            >
              <div className="p-4" ref={canvasContainerRef}>
                <QRCodeCanvas
                  value={options.rawValue || 'https://buildicy.com'}
                  size={230}
                  fgColor={options.fgColor}
                  bgColor={options.isTransparentBg ? '#FFFFFF' : options.bgColor}
                  level={options.level}
                  marginSize={options.marginSize}
                  imageSettings={logoSettings}
                />
              </div>
              <div
                className="w-full py-2.5 px-4 text-center font-bold tracking-wider text-xs uppercase"
                style={{ backgroundColor: options.fgColor, color: options.bgColor || '#FFFFFF' }}
              >
                {options.frameText || 'SCAN ME'}
              </div>
            </div>
          )}

          {options.frameStyle === 'top-banner' && (
            <div
              className="rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center border border-black/10"
              style={{ backgroundColor: options.isTransparentBg ? '#FFFFFF' : options.bgColor }}
            >
              <div
                className="w-full py-2.5 px-4 text-center font-bold tracking-wider text-xs uppercase"
                style={{ backgroundColor: options.fgColor, color: options.bgColor || '#FFFFFF' }}
              >
                {options.frameText || 'SCAN ME'}
              </div>
              <div className="p-4" ref={canvasContainerRef}>
                <QRCodeCanvas
                  value={options.rawValue || 'https://buildicy.com'}
                  size={230}
                  fgColor={options.fgColor}
                  bgColor={options.isTransparentBg ? '#FFFFFF' : options.bgColor}
                  level={options.level}
                  marginSize={options.marginSize}
                  imageSettings={logoSettings}
                />
              </div>
            </div>
          )}

          {options.frameStyle === 'card' && (
            <div
              className={`p-5 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-[290px] border transition-all ${
                options.cardTheme === 'dark'
                  ? 'bg-[#0E0E16] border-white/10 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              <h4 className="font-bold text-xs tracking-tight mb-2.5">
                {options.frameText || title || 'Scan QR Code'}
              </h4>
              <div className="p-3 rounded-xl bg-white shadow-inner mb-2" ref={canvasContainerRef}>
                <QRCodeCanvas
                  value={options.rawValue || 'https://buildicy.com'}
                  size={200}
                  fgColor={options.fgColor}
                  bgColor="#FFFFFF"
                  level={options.level}
                  marginSize={options.marginSize}
                  imageSettings={logoSettings}
                />
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                {options.frameSubtext || 'Point camera to open link'}
              </p>
            </div>
          )}
        </div>

        {/* Hidden SVG element for vector export */}
        <div ref={svgContainerRef} className="hidden">
          <QRCodeSVG
            value={options.rawValue || 'https://buildicy.com'}
            size={1024}
            fgColor={options.fgColor}
            bgColor={options.isTransparentBg ? 'none' : options.bgColor}
            level={options.level}
            marginSize={options.marginSize}
            imageSettings={logoSettings}
          />
        </div>

        {/* Technical specs readout */}
        <div className="w-full mt-2 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>{options.rawValue.length} bytes</span>
          <span>Redundancy: {options.level}</span>
          <span className="text-emerald-400 font-semibold">100% Scannable</span>
        </div>
      </div>

      {/* Action Controls: Compact & Responsive */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyClipboard}
            disabled={copying}
            className={`flex-1 py-3 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all active:scale-[0.98] cursor-pointer ${
              copying
                ? 'bg-emerald-600/25 border-emerald-500/50 text-emerald-300'
                : 'bg-[#0E0E16] hover:bg-[#151522] border-white/[0.08] text-white'
            }`}
          >
            {copying ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
            <span>{copying ? 'Copied!' : 'Copy Image'}</span>
          </button>

          {/* Primary Download Button with Dropdown Trigger */}
          <div className="relative flex-1">
            <button
              onClick={() => setDownloadDropdown(!downloadDropdown)}
              disabled={downloading}
              className="w-full py-3 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Dropdown Menu */}
            {downloadDropdown && (
              <div className="absolute right-0 bottom-full mb-2 w-56 rounded-xl bg-[#11111B] border border-white/10 shadow-2xl p-1.5 z-50 space-y-1 backdrop-blur-2xl">
                <button
                  onClick={() => handleDownloadPNG(2048, 'hd')}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-purple-400" />
                    <span>HD PNG (2048px)</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Standard</span>
                </button>

                <button
                  onClick={() => handleDownloadPNG(4096, '4k')}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>4K Ultra (4096px)</span>
                  </div>
                  <span className="text-[10px] text-purple-400 font-mono font-bold">Print</span>
                </button>

                <button
                  onClick={handleDownloadSVG}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileDown className="w-3.5 h-3.5 text-sky-400" />
                    <span>Vector SVG</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Lossless</span>
                </button>

                <div className="border-t border-white/5 my-1" />

                <button
                  onClick={handleDownloadPDFFlyer}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs text-purple-300 hover:text-white hover:bg-purple-600/20 flex items-center justify-between transition-colors font-medium cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>Printable PDF Flyer</span>
                  </div>
                  <span className="text-[10px] text-purple-400 font-mono">A4</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
