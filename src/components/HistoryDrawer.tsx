import { useState, type FC } from 'react';
import { X, Trash2, ArrowRight, Clock, Search, FolderDown, QrCode } from 'lucide-react';
import type { SavedQRItem } from '../types/qr';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: SavedQRItem[];
  onSelect: (item: SavedQRItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportHistoryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'buildicy-qr-history.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D0D16] border-l border-white/10 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Saved QR Codes</h3>
                <p className="text-[11px] text-zinc-400">{items.length} codes stored locally</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-4 border-b border-white/5">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-zinc-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history by title or link..."
                className="w-full bg-[#141424] text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 space-y-2">
                <QrCode className="w-8 h-8 mx-auto text-zinc-600 opacity-60" />
                <p className="text-xs">No saved QR codes found</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group p-3.5 rounded-xl bg-[#141424] hover:bg-[#1A1A2E] border border-white/5 hover:border-purple-500/30 transition-all flex items-center justify-between gap-3"
                >
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-xs text-white truncate">{item.title}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 font-mono">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">{item.content}</p>
                    <span className="text-[10px] text-zinc-600 mt-1 block">
                      {new Date(item.createdAt).toLocaleDateString()} at{' '}
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 transition-colors"
                      title="Load in Studio"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-white/8 bg-[#090910] flex items-center justify-between">
              <button
                onClick={exportHistoryJSON}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <FolderDown className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
