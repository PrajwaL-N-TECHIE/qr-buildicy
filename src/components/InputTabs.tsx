import { useState, useEffect, type FC } from 'react';
import { 
  Link2, 
  FileText, 
  Wifi, 
  UserSquare2, 
  Mail, 
  MessageSquare, 
  ClipboardPaste, 
  ExternalLink,
  Check,
  Lock,
  Globe
} from 'lucide-react';
import type { QRType, WiFiData, VCardData, EmailData, WhatsAppData } from '../types/qr';
import { formatWiFiString, formatVCardString, formatEmailString, formatWhatsAppString } from '../utils/qrTemplates';

interface InputTabsProps {
  currentType: QRType;
  onTypeChange: (type: QRType) => void;
  onValueChange: (val: string, derivedTitle?: string) => void;
}

export const InputTabs: FC<InputTabsProps> = ({
  currentType,
  onTypeChange,
  onValueChange,
}) => {
  const [urlInput, setUrlInput] = useState('https://buildicy.com');
  const [textInput, setTextInput] = useState('');
  
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: 'Buildicy-Guest-5G',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });

  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: 'Prajwal',
    lastName: 'N',
    organization: 'Buildicy Ventures',
    title: 'Founder & CEO',
    phone: '+91 9876543210',
    email: 'contact@buildicy.com',
    url: 'https://buildicy.com',
    note: 'Let us connect and build.',
  });

  const [emailData, setEmailData] = useState<EmailData>({
    email: 'team@buildicy.com',
    subject: 'Partnership Inquiry',
    body: 'Hi Buildicy team,\n\nI scanned your QR code and wanted to connect...',
  });

  const [whatsappData, setWhatsappData] = useState<WhatsAppData>({
    phone: '919876543210',
    message: 'Hello Buildicy, I scanned your QR code!',
  });

  const [copiedNotification, setCopiedNotification] = useState(false);

  useEffect(() => {
    switch (currentType) {
      case 'url': {
        const formatted = urlInput.trim();
        let title = 'Web Link';
        try {
          const parsed = new URL(formatted.startsWith('http') ? formatted : `https://${formatted}`);
          title = parsed.hostname.replace('www.', '');
        } catch {
          // ignore
        }
        onValueChange(formatted, title);
        break;
      }
      case 'text':
        onValueChange(textInput, textInput.slice(0, 24) || 'Plain Text');
        break;
      case 'wifi':
        onValueChange(formatWiFiString(wifiData), `Wi-Fi: ${wifiData.ssid}`);
        break;
      case 'vcard':
        onValueChange(formatVCardString(vcardData), `Contact: ${vcardData.firstName} ${vcardData.lastName}`);
        break;
      case 'email':
        onValueChange(formatEmailString(emailData), `Email: ${emailData.email}`);
        break;
      case 'whatsapp':
        onValueChange(formatWhatsAppString(whatsappData), `WhatsApp: ${whatsappData.phone}`);
        break;
    }
  }, [currentType, urlInput, textInput, wifiData, vcardData, emailData, whatsappData]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 1800);
      }
    } catch {
      // ignore
    }
  };

  const tabs: { id: QRType; label: string; icon: any }[] = [
    { id: 'url', label: 'Website Link', icon: Link2 },
    { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
    { id: 'text', label: 'Text Note', icon: FileText },
    { id: 'vcard', label: 'Contact Card', icon: UserSquare2 },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A10]/95 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5">
      {/* Segmented Mode Selector - Scrollable on mobile, compact pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#12121D] border border-white/[0.06] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTypeChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Fields */}
      <div>
        {currentType === 'url' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300 tracking-wide flex items-center gap-1.5 uppercase font-mono">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                Target Link / URL
              </label>

              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/20 transition-all cursor-pointer"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Pasted</span>
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full bg-[#111119] text-white text-sm sm:text-base px-4 py-3 rounded-xl border border-white/[0.08] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-zinc-600 font-mono"
              />
              {urlInput && (
                <a
                  href={urlInput.startsWith('http') ? urlInput : `https://${urlInput}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in new tab"
                  className="absolute right-3 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Quick Samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
              <span className="text-zinc-500">Presets:</span>
              {[
                { label: 'Buildicy', val: 'https://buildicy.com' },
                { label: 'LinkedIn', val: 'https://linkedin.com' },
                { label: 'Instagram', val: 'https://instagram.com' },
                { label: 'GitHub', val: 'https://github.com' },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setUrlInput(s.val)}
                  className="px-2 py-0.5 rounded-md bg-[#141420] hover:bg-[#1C1C2C] text-zinc-400 hover:text-zinc-200 border border-white/5 transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentType === 'wifi' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiData.ssid}
                  onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                  placeholder="Office-WiFi"
                  className="w-full bg-[#111119] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-400" />
                  Password
                </label>
                <input
                  type="text"
                  value={wifiData.password}
                  onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                  placeholder="Enter Wi-Fi password"
                  className="w-full bg-[#111119] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Security:</span>
                {(['WPA', 'WEP', 'nopass'] as const).map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setWifiData({ ...wifiData, encryption: sec })}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                      wifiData.encryption === sec
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-[#111119] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sec === 'nopass' ? 'Open' : sec}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={wifiData.hidden}
                  onChange={(e) => setWifiData({ ...wifiData, hidden: e.target.checked })}
                  className="rounded bg-[#111119] border-white/10 text-purple-600"
                />
                <span>Hidden Network</span>
              </label>
            </div>
          </div>
        )}

        {currentType === 'text' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase font-mono">
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Plain Text Payload
              </label>
              <span className="text-zinc-500">{textInput.length} characters</span>
            </div>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type any message, instructions, or raw code..."
              className="w-full bg-[#111119] text-white text-sm px-4 py-3 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none resize-none font-mono"
            />
          </div>
        )}

        {currentType === 'vcard' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={vcardData.firstName}
                  onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                  className="w-full bg-[#111119] text-white text-sm px-3 py-2 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={vcardData.lastName}
                  onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                  className="w-full bg-[#111119] text-white text-sm px-3 py-2 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Organization</label>
                <input
                  type="text"
                  value={vcardData.organization}
                  onChange={(e) => setVcardData({ ...vcardData, organization: e.target.value })}
                  className="w-full bg-[#111119] text-white text-sm px-3 py-2 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={vcardData.phone}
                  onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                  className="w-full bg-[#111119] text-white text-sm px-3 py-2 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {currentType === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address</label>
              <input
                type="email"
                value={emailData.email}
                onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                className="w-full bg-[#111119] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Subject</label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full bg-[#111119] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none"
              />
            </div>
          </div>
        )}

        {currentType === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                WhatsApp Phone (Country Code, no symbols)
              </label>
              <input
                type="tel"
                value={whatsappData.phone}
                onChange={(e) => setWhatsappData({ ...whatsappData, phone: e.target.value })}
                placeholder="14155552671"
                className="w-full bg-[#111119] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Pre-filled Message</label>
              <textarea
                rows={2}
                value={whatsappData.message}
                onChange={(e) => setWhatsappData({ ...whatsappData, message: e.target.value })}
                className="w-full bg-[#111119] text-white text-sm px-3.5 py-2 rounded-xl border border-white/[0.08] focus:border-purple-500 outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
