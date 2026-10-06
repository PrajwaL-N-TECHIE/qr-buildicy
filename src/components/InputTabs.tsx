import { useState, useEffect, type FC, type ReactNode } from 'react';
import { 
  Link2, 
  FileText, 
  Wifi, 
  UserSquare2, 
  Mail, 
  MessageSquare, 
  ClipboardPaste, 
  ExternalLink,
  CheckCircle2,
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
  // Mode specific states
  const [urlInput, setUrlInput] = useState('https://buildicy.com');
  const [textInput, setTextInput] = useState('');
  
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: 'Office-HighSpeed-5G',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });

  const [vcardData, setVcardData] = useState<VCardData>({
    firstName: 'Prajwal',
    lastName: 'N',
    organization: 'Buildicy Ventures',
    title: 'Founder & Architect',
    phone: '+91 9876543210',
    email: 'contact@buildicy.com',
    url: 'https://buildicy.com',
    note: 'Let us connect and build the future.',
  });

  const [emailData, setEmailData] = useState<EmailData>({
    email: 'hello@buildicy.com',
    subject: 'Inquiry via Buildicy QR',
    body: 'Hi Buildicy team,\n\nI scanned your QR code and wanted to connect regarding...',
  });

  const [whatsappData, setWhatsappData] = useState<WhatsAppData>({
    phone: '919876543210',
    message: 'Hello, I scanned your Buildicy QR code!',
  });

  const [copiedNotification, setCopiedNotification] = useState(false);

  // Sync value changes based on active type
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
        setTimeout(() => setCopiedNotification(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const tabs: { id: QRType; label: string; icon: ReactNode }[] = [
    { id: 'url', label: 'URL / Link', icon: <Link2 className="w-4 h-4" /> },
    { id: 'text', label: 'Text Note', icon: <FileText className="w-4 h-4" /> },
    { id: 'wifi', label: 'Wi-Fi Network', icon: <Wifi className="w-4 h-4" /> },
    { id: 'vcard', label: 'vCard Contact', icon: <UserSquare2 className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="rounded-2xl border border-white/8 bg-[#0D0D16]/90 p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-xl">
      {/* Decorative ambient background accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Tabs list */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {tabs.map((tab) => {
          const isActive = currentType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTypeChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-b from-purple-500/20 to-purple-700/30 border-purple-500/50 text-purple-200 shadow-md shadow-purple-900/20 scale-[1.02]'
                  : 'bg-[#131320]/60 border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-[#181828]'
              }`}
            >
              <div className={isActive ? 'text-purple-400' : 'text-zinc-400'}>{tab.icon}</div>
              <span className="truncate max-w-full text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content based on currentType */}
      <div className="space-y-4">
        {currentType === 'url' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                Target Website / URL Link
              </label>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="flex items-center gap-1 text-[11px] font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/20 transition-colors"
              >
                {copiedNotification ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">Pasted!</span>
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste Clipboard</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://yourwebsite.com or https://instagram.com/..."
                className="w-full bg-[#141424] text-white text-sm sm:text-base px-4 py-3.5 pr-12 rounded-xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-zinc-600 font-mono"
              />
              {urlInput && (
                <a
                  href={urlInput.startsWith('http') ? urlInput : `https://${urlInput}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Test link in new tab"
                  className="absolute right-3 p-1.5 rounded-lg text-zinc-400 hover:text-purple-300 hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Quick Preset Links */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-zinc-500">Quick Samples:</span>
              {[
                { label: 'Buildicy', val: 'https://buildicy.com' },
                { label: 'B-Forms', val: 'https://forms.buildicy.com' },
                { label: 'GitHub', val: 'https://github.com' },
                { label: 'LinkedIn', val: 'https://linkedin.com' },
                { label: 'YouTube', val: 'https://youtube.com' },
              ].map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => setUrlInput(sample.val)}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 border border-white/5 transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentType === 'text' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              Plain Text or Secret Note
            </label>
            <textarea
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type any message, serial code, Wi-Fi token, or instructions here..."
              className="w-full bg-[#141424] text-white text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all placeholder:text-zinc-600 resize-none font-mono"
            />
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Plain text encoding</span>
              <span>{textInput.length} characters</span>
            </div>
          </div>
        )}

        {currentType === 'wifi' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiData.ssid}
                  onChange={(e) => setWifiData({ ...wifiData, ssid: e.target.value })}
                  placeholder="MyHome-WiFi"
                  className="w-full bg-[#141424] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-purple-400" />
                  Password
                </label>
                <input
                  type="text"
                  value={wifiData.password}
                  onChange={(e) => setWifiData({ ...wifiData, password: e.target.value })}
                  placeholder="Enter Wi-Fi password"
                  className="w-full bg-[#141424] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-purple-500 outline-none font-mono"
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
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      wifiData.encryption === sec
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-[#141424] border-white/5 text-zinc-400 hover:text-white'
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
                  className="rounded bg-[#141424] border-white/10 text-purple-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Hidden Network</span>
              </label>
            </div>
          </div>
        )}

        {currentType === 'vcard' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={vcardData.firstName}
                  onChange={(e) => setVcardData({ ...vcardData, firstName: e.target.value })}
                  className="w-full bg-[#141424] text-white text-sm px-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={vcardData.lastName}
                  onChange={(e) => setVcardData({ ...vcardData, lastName: e.target.value })}
                  className="w-full bg-[#141424] text-white text-sm px-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Organization / Company</label>
                <input
                  type="text"
                  value={vcardData.organization}
                  onChange={(e) => setVcardData({ ...vcardData, organization: e.target.value })}
                  className="w-full bg-[#141424] text-white text-sm px-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Job Title</label>
                <input
                  type="text"
                  value={vcardData.title}
                  onChange={(e) => setVcardData({ ...vcardData, title: e.target.value })}
                  className="w-full bg-[#141424] text-white text-sm px-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={vcardData.phone}
                  onChange={(e) => setVcardData({ ...vcardData, phone: e.target.value })}
                  className="w-full bg-[#141424] text-white text-sm px-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  value={vcardData.email}
                  onChange={(e) => setVcardData({ ...vcardData, email: e.target.value })}
                  className="w-full bg-[#141424] text-white text-sm px-3 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentType === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Recipient Email</label>
              <input
                type="email"
                value={emailData.email}
                onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                placeholder="team@buildicy.com"
                className="w-full bg-[#141424] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Subject Line</label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="w-full bg-[#141424] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Pre-filled Body Message</label>
              <textarea
                rows={3}
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                className="w-full bg-[#141424] text-white text-sm px-3.5 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none resize-none"
              />
            </div>
          </div>
        )}

        {currentType === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Phone Number (with Country Code, no symbols)
              </label>
              <input
                type="tel"
                value={whatsappData.phone}
                onChange={(e) => setWhatsappData({ ...whatsappData, phone: e.target.value })}
                placeholder="14155552671"
                className="w-full bg-[#141424] text-white text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-purple-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Pre-filled Greeting Message</label>
              <textarea
                rows={3}
                value={whatsappData.message}
                onChange={(e) => setWhatsappData({ ...whatsappData, message: e.target.value })}
                className="w-full bg-[#141424] text-white text-sm px-3.5 py-2 rounded-xl border border-white/10 focus:border-purple-500 outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
