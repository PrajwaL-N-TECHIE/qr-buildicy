import { useRef, type FC, type ChangeEvent } from 'react';
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

export const StyleCustomizer: FC<StyleCustomizerProps> = ({ options, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange({
          logoUrl: reader.result as string,
          logoPreset: undefined,
          // Boost error correction when logo is added
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
    <div className="rounded-2xl border border-white/8 bg-[#0D0D16]/90 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-6">
      {/* 1. Colors & Palettes */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            Color Theme & Contrast
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange({ isTransparentBg: !options.isTransparentBg })}
              className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                options.isTransparentBg
                  ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <EyeOff className="w-3 h-3" />
              <span>Transparent BG</span>
            </button>
          </div>
        </div>

        {/* Color Presets */}
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = options.fgColor === preset.fg && options.bgColor === preset.bg && !options.isTransparentBg;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => onChange({ fgColor: preset.fg, bgColor: preset.bg, isTransparentBg: false })}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/20 text-white shadow-sm'
                    : 'border-white/5 bg-[#141424] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center -space-x-1">
                  <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: preset.fg }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-black/40" style={{ backgroundColor: preset.bg }} />
                </div>
                <span className="text-[11px] font-medium">{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Hex Inputs */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[#141424] border border-white/5 flex items-center justify-between">
            <div>
              <span className="block text-[11px] text-zinc-400">Foreground</span>
              <span className="text-xs font-mono font-semibold text-white uppercase">{options.fgColor}</span>
            </div>
            <input
              type="color"
              value={options.fgColor}
              onChange={(e) => onChange({ fgColor: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#141424] border border-white/5 flex items-center justify-between">
            <div>
              <span className="block text-[11px] text-zinc-400">Background</span>
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

      <hr className="border-white/5" />

      {/* 2. Center Logo Embedding */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            Center Logo & Watermark
          </label>
          {options.logoUrl && (
            <button
              type="button"
              onClick={clearLogo}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-0.5 rounded-lg transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}
        </div>

        {/* Logo Presets */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {LOGO_PRESETS.map((preset) => {
            const isSelected = options.logoPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset.id)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-600/25 shadow-md shadow-purple-900/30 ring-1 ring-purple-500'
                    : 'border-white/5 bg-[#141424] hover:bg-[#1A1A2E]'
                }`}
                title={preset.name}
              >
                <img src={preset.svgDataUri} alt={preset.name} className="w-5 h-5 object-contain" />
                <span className="text-[10px] text-zinc-400 truncate max-w-full">{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Upload Button */}
        <div className="flex items-center gap-3">
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
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5 hover:bg-purple-500/10 text-xs font-semibold text-purple-300 transition-all"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload Custom Logo / Icon</span>
          </button>
        </div>

        {/* Logo size & excavation controls if logo present */}
        {options.logoUrl && (
          <div className="p-3.5 rounded-xl bg-[#141424] border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Logo Scale Ratio:</span>
              <span className="text-purple-300 font-mono font-medium">{Math.round(options.logoSizePercent * 100)}%</span>
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

            <div className="flex items-center justify-between pt-1">
              <label className="text-xs text-zinc-300 cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.excavateLogo}
                  onChange={(e) => onChange({ excavateLogo: e.target.checked })}
                  className="rounded bg-[#0D0D16] border-white/10 text-purple-600 focus:ring-0"
                />
                <span>Excavate Background (Enhances Scannability)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <hr className="border-white/5" />

      {/* 3. Framing & Badges */}
      <div className="space-y-3.5">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Frame className="w-3.5 h-3.5 text-purple-400" />
          Frames & "Scan Me" Badges
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(
            [
              { id: 'none', label: 'No Frame' },
              { id: 'bottom-banner', label: 'Bottom Banner' },
              { id: 'top-banner', label: 'Top Banner' },
              { id: 'card', label: 'Event Card' },
              { id: 'neon', label: 'Neon Glow' },
            ] as { id: FrameStyle; label: string }[]
          ).map((frame) => {
            const isSelected = options.frameStyle === frame.id;
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => onChange({ frameStyle: frame.id })}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-600/25 text-white ring-1 ring-purple-500/50'
                    : 'border-white/5 bg-[#141424] text-zinc-400 hover:text-white'
                }`}
              >
                {frame.label}
              </button>
            );
          })}
        </div>

        {options.frameStyle !== 'none' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">Banner Title</label>
              <input
                type="text"
                value={options.frameText}
                onChange={(e) => onChange({ frameText: e.target.value })}
                placeholder="SCAN ME"
                className="w-full bg-[#141424] text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
              />
            </div>

            {options.frameStyle === 'card' && (
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Footer Subtext</label>
                <input
                  type="text"
                  value={options.frameSubtext}
                  onChange={(e) => onChange({ frameSubtext: e.target.value })}
                  placeholder="Point camera to connect"
                  className="w-full bg-[#141424] text-white text-xs px-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <hr className="border-white/5" />

      {/* 4. Fine-Tuning & Error Correction */}
      <div className="space-y-3.5">
        <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          Error Correction & Margin
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Error correction */}
          <div className="p-3 rounded-xl bg-[#141424] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                Redundancy Level:
              </span>
              <span className="text-purple-300 font-mono font-medium">
                {options.level === 'L' && 'L (7%)'}
                {options.level === 'M' && 'M (15%)'}
                {options.level === 'Q' && 'Q (25%)'}
                {options.level === 'H' && 'H (30% - Best)'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChange({ level: lvl })}
                  className={`py-1 rounded-lg text-xs font-semibold transition-all ${
                    options.level === lvl
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#1C1C2E] text-zinc-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Quiet Zone Padding */}
          <div className="p-3 rounded-xl bg-[#141424] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Quiet Zone (Margin):</span>
              <span className="text-purple-300 font-mono font-medium">{options.marginSize} Modules</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={options.marginSize}
              onChange={(e) => onChange({ marginSize: parseInt(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
