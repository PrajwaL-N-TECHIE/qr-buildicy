import { useState, useRef, type FC, type ChangeEvent } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Frame, 
  Sliders, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  EyeOff
} from 'lucide-react';

import type { QROptions, ErrorCorrectionLevel, FrameStyle } from '../types/qr';
import { LOGO_PRESETS, COLOR_PRESETS } from '../utils/presets';

interface StyleCustomizerProps {
  options: QROptions;
  onChange: (newOptions: Partial<QROptions>) => void;
}

type CustomizerTab = 'colors' | 'logo' | 'frame' | 'precision';

export const StyleCustomizer: FC<StyleCustomizerProps> = ({ options, onChange }) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('colors');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({
          logoUrl: reader.result as string,
          logoPreset: undefined,
          level: options.level === 'L' ? 'Q' : options.level,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = LOGO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onChange({
        logoUrl: preset.svgDataUri,
        logoPreset: presetId,
        level: options.level === 'L' ? 'Q' : options.level,
      });
    }
  };

  const clearLogo = () => {
    onChange({ logoUrl: undefined, logoPreset: undefined });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A10]/95 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5">
      {/* Studio Category Sub-tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-1 sm:gap-2">
          {[
            { id: 'colors', label: 'Color & Theme', icon: Palette },
            { id: 'logo', label: 'Brand Logo', icon: ImageIcon },
            { id: 'frame', label: 'Frame & Badge', icon: Frame },
            { id: 'precision', label: 'Precision', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as CustomizerTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick status badge */}
        <span className="text-[10px] font-mono text-zinc-500 uppercase">
          {activeTab}
        </span>
      </div>

      {/* 1. COLORS TAB */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Curated Palettes</span>
            <button
              type="button"
              onClick={() => onChange({ isTransparentBg: !options.isTransparentBg })}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                options.isTransparentBg
                  ? 'bg-purple-600/25 border-purple-500 text-purple-200'
                  : 'bg-[#12121D] border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <EyeOff className="w-3 h-3" />
              <span>Transparent BG</span>
            </button>
          </div>

          {/* Palette Swatches */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = options.fgColor === preset.fg && options.bgColor === preset.bg && !options.isTransparentBg;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onChange({ fgColor: preset.fg, bgColor: preset.bg, isTransparentBg: false })}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/15 text-white shadow-sm ring-1 ring-purple-500/50'
                      : 'border-white/[0.06] bg-[#111119] text-zinc-400 hover:text-zinc-200 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: preset.fg }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm" style={{ backgroundColor: preset.bg }} />
                  </div>
                  <span className="text-[11px] font-medium truncate">{preset.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Hex Color Controls */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#111119] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="block text-[10px] uppercase font-mono text-zinc-400">Foreground</span>
                <span className="text-xs font-mono font-semibold text-white uppercase">{options.fgColor}</span>
              </div>
              <input
                type="color"
                value={options.fgColor}
                onChange={(e) => onChange({ fgColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#111119] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="block text-[10px] uppercase font-mono text-zinc-400">Background</span>
                <span className="text-xs font-mono font-semibold text-white uppercase">
                  {options.isTransparentBg ? 'Transparent' : options.bgColor}
                </span>
              </div>
              <input
                type="color"
                disabled={options.isTransparentBg}
                value={options.bgColor}
                onChange={(e) => onChange({ bgColor: e.target.value, isTransparentBg: false })}
                className={`w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 outline-none ${
                  options.isTransparentBg ? 'opacity-30 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. LOGO TAB */}
      {activeTab === 'logo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Brand Icon / Watermark</span>
            {options.logoUrl && (
              <button
                type="button"
                onClick={clearLogo}
                className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove Logo</span>
              </button>
            )}
          </div>

          {/* Logo Presets Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {LOGO_PRESETS.map((preset) => {
              const isSelected = options.logoPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-600/20 shadow-md shadow-purple-900/30 ring-1 ring-purple-500/60'
                      : 'border-white/[0.06] bg-[#111119] hover:bg-[#161622] hover:border-white/10'
                  }`}
                  title={preset.name}
                >
                  <img src={preset.svgDataUri} alt={preset.name} className="w-5 h-5 object-contain" />
                  <span className="text-[10px] text-zinc-300 truncate max-w-full font-medium">{preset.name}</span>
                </button>
              );
            })}
          </div>

          {/* Upload Custom */}
          <div className="pt-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5 hover:bg-purple-500/10 text-xs font-semibold text-purple-300 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Upload Custom PNG / SVG Image</span>
            </button>
          </div>

          {/* Logo Sizing & Excavation */}
          {options.logoUrl && (
            <div className="p-3.5 rounded-xl bg-[#111119] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Logo Size Ratio:</span>
                <span className="text-purple-300 font-mono font-semibold">{Math.round(options.logoSizePercent * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.30"
                step="0.01"
                value={options.logoSizePercent}
                onChange={(e) => onChange({ logoSizePercent: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />

              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 pt-1">
                <input
                  type="checkbox"
                  checked={options.excavateLogo}
                  onChange={(e) => onChange({ excavateLogo: e.target.checked })}
                  className="rounded bg-[#0A0A10] border-white/10 text-purple-600"
                />
                <span>Excavate Background Behind Logo (Preserves Scannability)</span>
              </label>
            </div>
          )}
        </div>
      )}

      {/* 3. FRAME TAB */}
      {activeTab === 'frame' && (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-zinc-300">Badges & Outer Frames</span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'none', label: 'Clean QR' },
                { id: 'bottom-banner', label: 'Bottom Banner' },
                { id: 'top-banner', label: 'Top Banner' },
                { id: 'card', label: 'Event Card' },
              ] as { id: FrameStyle; label: string }[]
            ).map((frame) => {
              const isSelected = options.frameStyle === frame.id;
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => onChange({ frameStyle: frame.id })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-600/20 text-white ring-1 ring-purple-500/50'
                      : 'border-white/[0.06] bg-[#111119] text-zinc-400 hover:text-white hover:border-white/10'
                  }`}
                >
                  {frame.label}
                </button>
              );
            })}
          </div>

          {options.frameStyle !== 'none' && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Banner Heading</label>
                <input
                  type="text"
                  value={options.frameText}
                  onChange={(e) => onChange({ frameText: e.target.value })}
                  placeholder="SCAN ME"
                  className="w-full bg-[#111119] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none"
                />
              </div>

              {options.frameStyle === 'card' && (
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Instruction Subtitle</label>
                  <input
                    type="text"
                    value={options.frameSubtext}
                    onChange={(e) => onChange({ frameSubtext: e.target.value })}
                    placeholder="Point your smartphone camera to connect"
                    className="w-full bg-[#111119] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. PRECISION / SETTINGS TAB */}
      {activeTab === 'precision' && (
        <div className="space-y-4">
          <span className="text-xs font-semibold text-zinc-300">Error Correction & Quiet Zone</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Error correction */}
            <div className="p-3.5 rounded-xl bg-[#111119] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Redundancy Level:
                </span>
                <span className="text-purple-300 font-mono font-semibold">
                  {options.level === 'L' && 'L (7%)'}
                  {options.level === 'M' && 'M (15%)'}
                  {options.level === 'Q' && 'Q (25%)'}
                  {options.level === 'H' && 'H (30% - Best)'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onChange({ level: lvl })}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      options.level === lvl
                        ? 'bg-purple-600 text-white shadow'
                        : 'bg-[#181824] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiet zone slider */}
            <div className="p-3.5 rounded-xl bg-[#111119] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Quiet Zone Margin:</span>
                <span className="text-purple-300 font-mono font-semibold">{options.marginSize} Modules</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={options.marginSize}
                onChange={(e) => onChange({ marginSize: parseInt(e.target.value) })}
                className="w-full accent-purple-500 pt-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
