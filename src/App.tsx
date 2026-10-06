import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputTabs } from './components/InputTabs';
import { StyleCustomizer } from './components/StyleCustomizer';
import { QRPreviewCard } from './components/QRPreviewCard';
import { ProjectorModal } from './components/ProjectorModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import type { QROptions, QRType, SavedQRItem } from './types/qr';
import { LOGO_PRESETS } from './utils/presets';
import { Sparkles, ShieldCheck, Zap, Globe2 } from 'lucide-react';

const STORAGE_KEY = 'buildicy_qr_history';

const DEFAULT_OPTIONS: QROptions = {
  type: 'url',
  rawValue: 'https://buildicy.com',
  fgColor: '#000000',
  bgColor: '#ffffff',
  isTransparentBg: false,
  level: 'H',
  includeMargin: true,
  marginSize: 1,
  logoUrl: LOGO_PRESETS[0].svgDataUri, // Official Buildicy Logo
  logoPreset: 'buildicy',
  logoSizePercent: 0.22,
  excavateLogo: true,
  frameStyle: 'bottom-banner',
  frameText: 'SCAN ME',
  frameSubtext: 'Point camera to open link',
  cardTheme: 'dark',
};

export function App() {
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);
  const [derivedTitle, setDerivedTitle] = useState('Buildicy');
  const [isProjectorOpen, setIsProjectorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedQRItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const updateSavedItems = (items: SavedQRItem[]) => {
    setSavedItems(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const handleTypeChange = (type: QRType) => {
    setOptions((prev) => ({ ...prev, type }));
  };

  const handleValueChange = (val: string, title?: string) => {
    setOptions((prev) => ({ ...prev, rawValue: val }));
    if (title) setDerivedTitle(title);
  };

  const handleOptionChange = (newOpts: Partial<QROptions>) => {
    setOptions((prev) => ({ ...prev, ...newOpts }));
  };

  const handleSaveToHistory = () => {
    const existingIndex = savedItems.findIndex((item) => item.content === options.rawValue);
    if (existingIndex >= 0) {
      const updated = [...savedItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        options,
        title: derivedTitle || 'QR Code',
        createdAt: Date.now(),
      };
      updateSavedItems(updated);
    } else {
      const newItem: SavedQRItem = {
        id: Math.random().toString(36).substring(2, 9),
        title: derivedTitle || 'QR Code',
        content: options.rawValue,
        type: options.type,
        createdAt: Date.now(),
        options,
      };
      updateSavedItems([newItem, ...savedItems]);
    }
  };

  const handleDeleteHistory = (id: string) => {
    updateSavedItems(savedItems.filter((i) => i.id !== id));
  };

  const handleClearAllHistory = () => {
    updateSavedItems([]);
  };

  const handleSelectHistoryItem = (item: SavedQRItem) => {
    setOptions(item.options);
    setDerivedTitle(item.title);
  };

  const handleReset = () => {
    setOptions(DEFAULT_OPTIONS);
    setDerivedTitle('Buildicy');
  };

  const isCurrentSaved = savedItems.some((item) => item.content === options.rawValue);

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background radial atmosphere & subtle grid */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_5%,rgba(168,85,247,0.12),transparent_65%)]" />
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Header Bar */}
      <Header
        onOpenProjector={() => setIsProjectorOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={savedItems.length}
        onReset={handleReset}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        {/* Top Hero Banner */}
        <div className="mb-6 sm:mb-8 space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Vector QR Generation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Generate High-Resolution QR Codes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Convert links, Wi-Fi networks, and contact cards into custom QR codes with brand logos, high-res downloads, and stage presentation mode.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Form & Styling Studio */}
          <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
            {/* 1. Content Input Card */}
            <InputTabs
              currentType={options.type}
              onTypeChange={handleTypeChange}
              onValueChange={handleValueChange}
            />

            {/* 2. Visual Customizer Console */}
            <StyleCustomizer options={options} onChange={handleOptionChange} />

            {/* Security & Performance Checklist */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center pt-1">
              <div className="p-3 rounded-xl bg-[#0A0A10]/70 border border-white/[0.05]">
                <ShieldCheck className="w-4 h-4 mx-auto text-purple-400 mb-1" />
                <span className="text-[11px] font-semibold text-zinc-300 block">Error Proof</span>
                <span className="text-[10px] text-zinc-500">Up to 30% H-Level</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A10]/70 border border-white/[0.05]">
                <Zap className="w-4 h-4 mx-auto text-sky-400 mb-1" />
                <span className="text-[11px] font-semibold text-zinc-300 block">4K Print Ready</span>
                <span className="text-[10px] text-zinc-500">SVG & 4096px PNG</span>
              </div>

              <div className="p-3 rounded-xl bg-[#0A0A10]/70 border border-white/[0.05]">
                <Globe2 className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                <span className="text-[11px] font-semibold text-zinc-300 block">100% Client-Side</span>
                <span className="text-[10px] text-zinc-500">Zero data stored</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Sticky Preview */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
            <QRPreviewCard
              options={options}
              title={derivedTitle}
              onSaveToHistory={handleSaveToHistory}
              isSaved={isCurrentSaved}
              onOpenProjector={() => setIsProjectorOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Auditorium / Projector Fullscreen Modal */}
      <ProjectorModal
        isOpen={isProjectorOpen}
        onClose={() => setIsProjectorOpen(false)}
        options={options}
        defaultTitle={derivedTitle || 'Scan to Connect'}
      />

      {/* Local History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={savedItems}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
      />

      {/* Footer matching Buildicy Theme */}
      <footer className="border-t border-purple-500/15 bg-[#040406] py-8 sm:py-10 text-xs text-zinc-400 relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/40 flex items-center justify-center p-1.5 shrink-0 shadow-inner">
              <img src="/logo.png" alt="Buildicy" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">Buildicy QR</span>
                <span className="text-[10px] text-purple-400 font-mono font-medium px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  qr.buildicy.com
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Official Buildicy Venture Product</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <a
              href="https://buildicy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-300 transition-colors flex items-center gap-1.5"
            >
              <span>Buildicy Platform</span>
              <img src="/logo.png" alt="" className="w-3.5 h-3.5 object-contain opacity-70" />
            </a>
            <button
              onClick={() => setIsProjectorOpen(true)}
              className="hover:text-purple-300 transition-colors cursor-pointer"
            >
              Auditorium Stage Mode
            </button>
          </div>

          <div className="text-[11px] text-zinc-500">
            © {new Date().getFullYear()} Buildicy. Built with precision.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
