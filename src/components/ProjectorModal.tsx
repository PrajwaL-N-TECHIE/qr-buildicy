import { useEffect, useState, useRef, type FC } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Maximize, Minimize, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';
import type { QROptions } from '../types/qr';

interface ProjectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: QROptions;
  defaultTitle: string;
}

export const ProjectorModal: FC<ProjectorModalProps> = ({
  isOpen,
  onClose,
  options,
  defaultTitle,
}) => {
  const [stageTitle, setStageTitle] = useState(defaultTitle || 'Scan to Connect');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStageTitle(defaultTitle || 'Scan to Connect');
  }, [defaultTitle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCopyLink = () => {
    if (options.rawValue) {
      navigator.clipboard.writeText(options.rawValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const logoSettings = options.logoUrl
    ? {
        src: options.logoUrl,
        x: undefined,
        y: undefined,
        height: Math.round(380 * options.logoSizePercent),
        width: Math.round(380 * options.logoSizePercent),
        excavate: options.excavateLogo,
      }
    : undefined;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 bg-[#06060A]/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-300 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span className="text-xs font-bold text-purple-300 tracking-wider uppercase">Stage / Projector Mode</span>
          </div>
          <span className="text-xs text-zinc-500 hidden sm:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">ESC</kbd> to exit</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Stage Content */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto z-10 text-center max-w-4xl mx-auto w-full">
        {/* Editable Presentation Title */}
        <div className="mb-8 w-full max-w-2xl">
          <input
            type="text"
            value={stageTitle}
            onChange={(e) => setStageTitle(e.target.value)}
            className="w-full text-center bg-transparent text-white font-extrabold text-3xl sm:text-5xl tracking-tight border-b border-transparent hover:border-white/20 focus:border-purple-500 focus:outline-none transition-all py-1 placeholder:text-zinc-600"
            placeholder="Type Event or Presentation Title"
          />
          <p className="text-sm sm:text-base text-zinc-400 mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Point your smartphone camera at the screen to join</span>
          </p>
        </div>

        {/* Large Centered QR Code with Beacon Rings */}
        <div className="relative group">
          {/* Radar Beacon Ring effect */}
          <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-r from-purple-600/30 via-sky-500/30 to-pink-500/30 blur-xl opacity-70 beacon-pulse pointer-events-none" />

          {/* QR Code Container */}
          <div className="relative p-6 sm:p-8 rounded-[36px] bg-white shadow-2xl shadow-purple-500/20 border border-white/40">
            <QRCodeCanvas
              value={options.rawValue || 'https://buildicy.com'}
              size={360}
              fgColor={options.fgColor || '#000000'}
              bgColor="#FFFFFF"
              level="H"
              marginSize={1}
              imageSettings={logoSettings}
            />
          </div>
        </div>

        {/* URL Pill Display */}
        <div className="mt-8 flex items-center gap-2 max-w-xl">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 font-mono truncate">
            <span className="truncate max-w-[320px] sm:max-w-md">{options.rawValue}</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {options.rawValue.startsWith('http') && (
            <a
              href={options.rawValue}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
              title="Open Link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Bottom Brand Watermark */}
      <div className="w-full text-center text-xs text-zinc-600 z-10 flex items-center justify-center gap-2">
        <span>Buildicy QR Studio</span>
        <span>•</span>
        <span>qr.buildicy.com</span>
      </div>
    </div>
  );
};
