import type { FC } from 'react';
import { MonitorPlay, History, ScanLine, Sparkles, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'generate' | 'scan';
  setActiveTab: (tab: 'generate' | 'scan') => void;
  onOpenProjector: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
}

export const Header: FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenProjector,
  onOpenHistory,
  historyCount,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07070B]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/40 flex items-center justify-center shadow-inner overflow-hidden p-1.5 shrink-0 group cursor-pointer transition-all hover:border-purple-500/70 hover:shadow-purple-500/20"
            onClick={onReset}
            title="Reset to Default"
          >
            <img src="/logo.png" alt="Buildicy" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                Buildicy <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">QR</span>
                <img src="/logo.png" alt="Buildicy Logo" className="w-5 h-5 object-contain inline-block shrink-0 drop-shadow-sm" />
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 hidden sm:inline-block">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 tracking-normal hidden md:block">
              Vector QR code generator for links, Wi-Fi, and live events
            </p>
          </div>
        </div>

        {/* Central Switch: Generate vs Scan */}
        <div className="flex items-center p-1 rounded-xl bg-[#12121D] border border-white/8">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>

          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'scan'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scan / Decode</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenProjector}
            title="Stage / Projector Mode for Live Audiences"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 transition-all active:scale-95"
          >
            <MonitorPlay className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Stage Mode</span>
          </button>

          <button
            onClick={onOpenHistory}
            title="Saved QR Codes History"
            className="relative p-2 rounded-xl text-zinc-400 hover:text-white bg-[#141420] hover:bg-[#1A1A2A] border border-white/6 transition-all active:scale-95"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-[9px] font-bold text-white flex items-center justify-center shadow">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onReset}
            title="Create New QR Code"
            className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#141420] hover:bg-[#1A1A2A] border border-white/6 transition-all active:scale-95 hidden sm:flex items-center justify-center"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
