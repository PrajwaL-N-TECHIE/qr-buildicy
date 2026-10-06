import type { FC } from 'react';
import { MonitorPlay, History, RotateCcw, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenProjector: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
}

export const Header: FC<HeaderProps> = ({
  onOpenProjector,
  onOpenHistory,
  historyCount,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050507]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center p-1.5 shrink-0 shadow-inner group cursor-pointer transition-all hover:border-purple-500/60"
            onClick={onReset}
            title="Reset to Default"
          >
            <img
              src="/logo.png"
              alt="Buildicy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base sm:text-lg text-white tracking-tight flex items-center gap-1.5">
              Buildicy <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">QR</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25">
              Studio
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenProjector}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 transition-all active:scale-95 cursor-pointer"
            title="Auditorium Presentation Mode"
          >
            <MonitorPlay className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Stage Mode</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-[#0E0E16] hover:bg-[#151522] border border-white/[0.08] transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Saved QR Codes History"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-600 text-[10px] font-bold text-white leading-none">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onReset}
            title="Reset Form"
            className="p-2 sm:p-2.5 rounded-xl text-zinc-400 hover:text-zinc-200 bg-[#0E0E16] hover:bg-[#151522] border border-white/[0.08] transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <a
            href="https://buildicy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <span>buildicy.com</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>
      </div>
    </header>
  );
};
