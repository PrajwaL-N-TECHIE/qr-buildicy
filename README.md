# Buildicy QR Studio (`b-qr`)

> **Next-Generation, Real-Time Link to Pro QR Code Generator**
> Built for [Buildicy](https://buildicy.com) and hosted at **qr.buildicy.com**.

![Buildicy QR Studio](https://buildicy.com/og-image.png)

---

## 🚀 Key Features

- **⚡ Instant Real-Time Generation**: Paste any website URL, plain text, Wi-Fi network credentials, vCard contact, email, or WhatsApp message and watch the QR code adapt live with zero delay.
- **🎨 Custom Styling & Gradients**:
  - Custom foreground and background color pickers.
  - Transparent background toggle.
  - Curated brand color presets (Buildicy Violet, Pure Dark, Cyber Cyan, Emerald, Gold Luxury).
- **🛡️ Custom Logo & Watermark Embedding**:
  - Built-in SVG presets: Buildicy Emblem, Link, GitHub, X (Twitter), Instagram, WhatsApp, Wi-Fi.
  - One-click upload for custom PNG/SVG/WebP brand logos.
  - Automatic error-correction level boosting (up to 30% H-Level) and background excavation to maintain 100% scan reliability.
- **🖼️ Sleek Badges & Frames**:
  - "SCAN ME" bottom and top banners.
  - Modern Event / Polaroid Card frame with custom title and subtext.
  - Neon glow cyber frame.
- **📥 Multi-Format Ultra-HD Export**:
  - **HD PNG (1024 × 1024)**: Instant web and social sharing.
  - **4K Ultra PNG (4096 × 4096)**: High-resolution print-ready asset.
  - **Vector SVG**: Infinite lossless scalability for Figma, Adobe Illustrator, or signage.
  - **Printable PDF Flyer / Poster**: Automatically formatted A4 flyer with QR code, instructions, and branded framing ready for office or event printing.
  - **Direct Image Clipboard Copy**: Copy actual image bytes straight to the OS clipboard.
- **📽️ Auditorium & Stage Projector Mode**:
  - Fullscreen high-contrast presentation mode with beacon radar rings, designed for conferences, hackathons, and classroom auditoriums. Press <kbd>ESC</kbd> or <kbd>F</kbd> for native fullscreen.
- **🔍 Built-in QR Scanner & Decoder**:
  - Drag-and-drop or upload any QR image screenshot to decode its contents via `jsQR`.
  - Live webcam scanner with viewport reticle.
  - 1-click import decoded content back into the studio for re-styling!
- **💾 Local History & Privacy**:
  - Automatically saves generated codes in `localStorage`.
  - Zero server tracking — 100% client-side privacy.

---

## 🛠️ Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **QR Rendering**: `qrcode.react` (Canvas & SVG engines)
- **PDF Generation**: `jspdf`
- **QR Decoding**: `jsqr`
- **Icons & Motion**: `lucide-react`, `framer-motion`, `canvas-confetti`

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/PrajwaL-N-TECHIE/qr-buildicy.git

# Navigate to project directory
cd b-qr

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🏗️ Production Build

```bash
npm run build
```

The output bundle will be created inside the `dist/` directory.

---

## 🌐 Deploy to `qr.buildicy.com` on Vercel

1. Import this repository into **[Vercel](https://vercel.com/)**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Go to **Settings > Domains** and add `qr.buildicy.com`.
6. Add the CNAME record in your DNS provider pointing `qr` to `cname.vercel-dns.com`.

---

© Buildicy. All rights reserved.
