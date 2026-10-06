export interface LogoPreset {
  id: string;
  name: string;
  svgDataUri: string;
}

// Crisp inline SVGs encoded as data URLs for robust rendering inside qrcode.react
export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: 'buildicy',
    name: 'Buildicy',
    svgDataUri: '/logo.png',
  },
  {
    id: 'link',
    name: 'Link',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%231E293B"/><path d="M42 58a14 14 0 010-20l12-12a14 14 0 1120 20l-7 7m-11 5a14 14 0 010 20l-12 12a14 14 0 01-20-20l7-7" stroke="%2338BDF8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'github',
    name: 'GitHub',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%2318181B"/><path fill-rule="evenodd" clip-rule="evenodd" d="M50 20C33.4 20 20 33.4 20 50c0 13.3 8.6 24.5 20.6 28.5 1.5.3 2-.6 2-1.4v-5.5c-8.4 1.8-10.1-4-10.1-4-1.4-3.5-3.4-4.4-3.4-4.4-2.7-1.9.2-1.8.2-1.8 3 .2 4.6 3.1 4.6 3.1 2.7 4.6 7.1 3.3 8.8 2.5.3-2 1.1-3.3 2-4-6.7-.8-13.7-3.3-13.7-14.8 0-3.3 1.2-6 3.1-8.1-.3-.8-1.3-3.8.3-8 0 0 2.5-.8 8.2 3.1 2.4-.7 5-1 7.5-1s5.1.3 7.5 1c5.7-3.9 8.2-3.1 8.2-3.1 1.6 4.2.6 7.2.3 8 1.9 2.1 3.1 4.8 3.1 8.1 0 11.6-7.1 14-13.8 14.8 1.1 1 2.1 2.8 2.1 5.7v8.5c0 .9.6 1.8 2.1 1.4C71.4 74.5 80 63.3 80 50c0-16.6-13.4-30-30-30z" fill="%23FFFFFF"/></svg>`,
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%23000000"/><path d="M68 26h8L58 46l21 28H63l-13-17-15 17h-8l19-22L26 26h14l11 15 17-15zm-3 43h5L41 30h-5l29 39z" fill="%23FFFFFF"/></svg>`,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="url(%23ig-grad)"/><rect x="28" y="28" width="44" height="44" rx="12" stroke="%23FFFFFF" stroke-width="6"/><circle cx="50" cy="50" r="11" stroke="%23FFFFFF" stroke-width="6"/><circle cx="63" cy="37" r="3" fill="%23FFFFFF"/><defs><linearGradient id="ig-grad" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse"><stop stop-color="%23F58529"/><stop offset="0.5" stop-color="%23DD2A7B"/><stop offset="1" stop-color="%238134AF"/></linearGradient></defs></svg>`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%2325D366"/><path fill-rule="evenodd" clip-rule="evenodd" d="M50 24C35.6 24 24 35.6 24 50c0 5 .1 9.4 3.7 13.8L24 76l12.7-3.3c4.2 2.3 8.7 3.5 13.3 3.5 14.4 0 26-11.6 26-26s-11.6-26-26-26zm13 36.6c-.6 1.6-3.2 3-4.4 3.2-1.1.2-2.5.3-7.5-1.7-6-2.5-10-8.5-10.3-8.9-.3-.4-2.4-3.2-2.4-6.1s1.5-4.3 2.1-4.9c.5-.6 1.2-.8 1.6-.8s.8 0 1.2.1c.4.1.9.2 1.3 1.2.5 1.1 1.7 4.2 1.8 4.5.1.4.2.8-.1 1.3s-.4.8-.8 1.2c-.4.4-.8.9-.3 1.8.5.9 2.2 3.6 4.8 5.8 3.3 2.9 6 3.8 6.9 4.2.9.4 1.4.4 1.9-.3.6-.7 2.4-2.8 3-3.8.7-.9 1.3-.8 2.2-.4.9.3 5.8 2.7 6.8 3.2 1 .5 1.7.8 1.9 1.2.2.4.2 2.5-.4 4.1z" fill="%23FFFFFF"/></svg>`,
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="24" fill="%234338CA"/><path d="M26 40c13.3-13.3 34.7-13.3 48 0M34 49c8.8-8.8 23.2-8.8 32 0M42 58c4.4-4.4 11.6-4.4 16 0" stroke="%23FFFFFF" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="68" r="5" fill="%23FFFFFF"/></svg>`,
  },
];

export const COLOR_PRESETS = [
  { name: 'Pure Dark', fg: '#000000', bg: '#ffffff' },
  { name: 'Buildicy Violet', fg: '#7c3aed', bg: '#ffffff' },
  { name: 'Dark Glow', fg: '#a855f7', bg: '#09090f' },
  { name: 'Cyber Cyan', fg: '#06b6d4', bg: '#080d14' },
  { name: 'Emerald', fg: '#059669', bg: '#ffffff' },
  { name: 'Midnight Blue', fg: '#2563eb', bg: '#ffffff' },
  { name: 'Sunset Coral', fg: '#e11d48', bg: '#ffffff' },
  { name: 'Gold Luxury', fg: '#d97706', bg: '#0f0e0a' },
];
