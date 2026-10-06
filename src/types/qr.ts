export type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'whatsapp';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type FrameStyle = 'none' | 'bottom-banner' | 'top-banner' | 'card' | 'neon';

export interface QROptions {
  type: QRType;
  rawValue: string;
  fgColor: string;
  bgColor: string;
  isTransparentBg: boolean;
  level: ErrorCorrectionLevel;
  includeMargin: boolean;
  marginSize: number;
  logoUrl?: string;
  logoPreset?: string;
  logoSizePercent: number; // 0.15 - 0.30
  excavateLogo: boolean;
  frameStyle: FrameStyle;
  frameText: string;
  frameSubtext: string;
  cardTheme: 'dark' | 'light' | 'purple';
}

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  url: string;
  note: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface WhatsAppData {
  phone: string;
  message: string;
}

export interface SavedQRItem {
  id: string;
  title: string;
  content: string;
  type: QRType;
  createdAt: number;
  options: QROptions;
}
