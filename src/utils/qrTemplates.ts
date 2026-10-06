import type { WiFiData, VCardData, EmailData, WhatsAppData } from '../types/qr';

export function formatWiFiString(data: WiFiData): string {
  const ssidEscaped = escapeSpecialChars(data.ssid);
  const passwordEscaped = escapeSpecialChars(data.password);
  const auth = data.encryption === 'nopass' ? 'nopass' : data.encryption;
  const hidden = data.hidden ? 'H:true;' : '';
  return `WIFI:T:${auth};S:${ssidEscaped};P:${passwordEscaped};${hidden};`;
}

export function formatVCardString(data: VCardData): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`.trim(),
  ];

  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
  if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
  if (data.url) lines.push(`URL:${data.url.startsWith('http') ? data.url : `https://${data.url}`}`);
  if (data.note) lines.push(`NOTE:${data.note}`);

  lines.push('END:VCARD');
  return lines.join('\n');
}

export function formatEmailString(data: EmailData): string {
  const params: string[] = [];
  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `mailto:${data.email}${query}`;
}

export function formatWhatsAppString(data: WhatsAppData): string {
  const cleanPhone = data.phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(data.message || '');
  return `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}

function escapeSpecialChars(str: string): string {
  return str.replace(/([\\;,":])/g, '\\$1');
}
