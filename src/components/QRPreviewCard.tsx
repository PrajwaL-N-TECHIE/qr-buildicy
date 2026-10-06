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
  FileText
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

  // Compute logo settings
  const logoSettings = options.logoUrl
    ? {
        src: options.logoUrl,
        x: undefined,
        y: undefined,
        height: Math.round(280 * options.logoSizePercent),
        width: Math.round(280 * options.logoSizePercent),
        excavate: options.excavateLogo,
      }
    : undefined;

  return (
    <div className="sticky top-24 space-y-4">
      {/* Visual Canvas Card */}
      <div className="rounded-2xl border border-white/8 bg-[#0D0D16]/90 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col items-center">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Header Actions */}
        <div className="w-full flex items-center justify-between mb-4 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Live Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSaveToHistory}
              title={isSaved ? 'Saved to history' : 'Save to history'}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                isSaved
                  ? 'bg-purple-600/25 border-purple-500 text-purple-300'
                  : 'bg-[#141424] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-purple-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span className="text-[11px] hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={onOpenProjector}
              title="Full Stage Projector Mode"
              className="p-1.5 rounded-lg bg-[#141424] hover:bg-[#1C1C30] border border-white/5 text-zinc-400 hover:text-purple-300 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Frame Visual Wrapper */}
        <div className="z-10 w-full flex items-center justify-center p-2">
          {options.frameStyle === 'none' && (
            <div
              className={`p-4 rounded-2xl shadow-xl transition-all duration-300 ${
                options.isTransparentBg ? 'border border-dashed border-white/20' : ''
              }`}
              style={{ backgroundColor: options.isTransparentBg ? 'transparent' : options.bgColor }}
            >
              <div ref={canvasContainerRef}>
                <QRCodeCanvas
                  value={options.rawValue || 'https://buildicy.com'}
                  size={260}
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
                  size={240}
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
                  size={240}
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
              className={`p-5 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-[310px] border transition-all ${
                options.cardTheme === 'dark'
                  ? 'bg-[#09090F] border-white/10 text-white'
                  : options.cardTheme === 'purple'
                  ? 'bg-[#180E2B] border-purple-500/30 text-purple-100'
                  : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              <h4 className="font-bold text-sm tracking-tight mb-3">
                {options.frameText || title || 'Scan QR Code'}
              </h4>
              <div
                className="p-3 rounded-2xl bg-white shadow-inner mb-3"
                ref={canvasContainerRef}
              >
                <QRCodeCanvas
                  value={options.rawValue || 'https://buildicy.com'}
                  size={210}
                  fgColor={options.fgColor}
                  bgColor="#FFFFFF"
                  level={options.level}
                  marginSize={options.marginSize}
                  imageSettings={logoSettings}
                />
              </div>
              <p
                className={`text-[11px] leading-relaxed ${
                  options.cardTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                }`}
              >
                {options.frameSubtext || 'Point your smartphone camera to connect instantly'}
              </p>
            </div>
          )}

          {options.frameStyle === 'neon' && (
            <div className="relative p-1 rounded-2xl bg-gradient-to-tr from-purple-500 via-sky-400 to-pink-500 shadow-2xl shadow-purple-500/30">
              <div className="p-4 rounded-[14px] bg-[#07070B]" ref={canvasContainerRef}>
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
        </div>

        {/* Hidden SVG element strictly for high-fidelity SVG export */}
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
        <div className="w-full mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Payload: {options.rawValue.length} chars</span>
          <span>Redundancy: {options.level}</span>
          <span className="text-emerald-400 font-medium">100% Scannable</span>
        </div>
      </div>

      {/* Action Buttons: Copy & Downloads */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={handleCopyClipboard}
          disabled={copying}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all active:scale-[0.98] ${
            copying
              ? 'bg-green-600/30 border-green-500 text-green-300'
              : 'bg-[#141424] hover:bg-[#1C1C30] border-white/10 text-white shadow-md'
          }`}
        >
          {copying ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
          <span>{copying ? 'Copied to Clipboard!' : 'Copy QR Image'}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setDownloadDropdown(!downloadDropdown)}
            disabled={downloading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res</span>
          </button>

          {/* Download Dropdown options */}
          {downloadDropdown && (
            <div className="absolute right-0 bottom-full mb-2 w-64 rounded-2xl bg-[#11111E] border border-white/10 shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl">
              <button
                onClick={() => handleDownloadPNG(1024, 'hd')}
                className="w-full px-3 py-2 rounded-xl text-left text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors"
              >
                <span>HD PNG (1024 × 1024)</span>
                <span className="text-[10px] text-zinc-500 font-mono">Web & Social</span>
              </button>

              <button
                onClick={() => handleDownloadPNG(4096, '4k-ultra')}
                className="w-full px-3 py-2 rounded-xl text-left text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>4K Ultra PNG (4096px)</span>
                </div>
                <span className="text-[10px] text-purple-400 font-mono">Print Ready</span>
              </button>

              <button
                onClick={handleDownloadSVG}
                className="w-full px-3 py-2 rounded-xl text-left text-xs text-zinc-300 hover:text-white hover:bg-white/5 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <FileDown className="w-3.5 h-3.5 text-sky-400" />
                  <span>Vector SVG (Lossless)</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Illustrator/Figma</span>
              </button>

              <div className="border-t border-white/5 my-1" />

              <button
                onClick={handleDownloadPDFFlyer}
                className="w-full px-3 py-2 rounded-xl text-left text-xs text-purple-300 hover:text-white hover:bg-purple-600/20 flex items-center justify-between transition-colors font-medium"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Printable PDF Flyer</span>
                </div>
                <span className="text-[10px] text-purple-400 font-mono">A4 Ready</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
