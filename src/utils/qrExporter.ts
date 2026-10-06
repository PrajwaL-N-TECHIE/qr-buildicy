import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import type { QROptions } from '../types/qr';

export function fireConfetti() {
  try {
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#a855f7', '#38bdf8', '#ec4899', '#f59e0b'],
    });
  } catch {
    // ignore
  }
}

/**
 * Renders the QR code onto an offscreen canvas at specified target resolution,
 * applying frames/banners if configured.
 */
export async function renderCompositeQRCanvas(
  sourceCanvas: HTMLCanvasElement,
  options: QROptions,
  targetSize: number = 2048
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  const { frameStyle, frameText, frameSubtext, cardTheme } = options;

  if (frameStyle === 'none') {
    canvas.width = targetSize;
    canvas.height = targetSize;

    if (!options.isTransparentBg) {
      ctx.fillStyle = options.bgColor;
      ctx.fillRect(0, 0, targetSize, targetSize);
    }
    ctx.drawImage(sourceCanvas, 0, 0, targetSize, targetSize);
    return canvas;
  }

  if (frameStyle === 'bottom-banner' || frameStyle === 'top-banner') {
    const bannerHeight = Math.round(targetSize * 0.18);
    canvas.width = targetSize;
    canvas.height = targetSize + bannerHeight;

    // Fill background
    ctx.fillStyle = options.isTransparentBg ? '#FFFFFF' : options.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const isTop = frameStyle === 'top-banner';
    const qrY = isTop ? bannerHeight : 0;
    const bannerY = isTop ? 0 : targetSize;

    // Draw QR
    ctx.drawImage(sourceCanvas, 0, qrY, targetSize, targetSize);

    // Draw Banner Background
    const bannerBg = options.fgColor;
    ctx.fillStyle = bannerBg;
    ctx.fillRect(0, bannerY, targetSize, bannerHeight);

    // Draw Banner Text
    ctx.fillStyle = options.bgColor || '#FFFFFF';
    ctx.font = `bold ${Math.round(bannerHeight * 0.42)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameText || 'SCAN ME', targetSize / 2, bannerY + bannerHeight / 2);

    return canvas;
  }

  if (frameStyle === 'card') {
    const padding = Math.round(targetSize * 0.1);
    const headerHeight = Math.round(targetSize * 0.18);
    const footerHeight = Math.round(targetSize * 0.14);

    canvas.width = targetSize + padding * 2;
    canvas.height = targetSize + padding * 2 + headerHeight + footerHeight;

    // Card background
    const bgCard = cardTheme === 'dark' ? '#09090F' : cardTheme === 'purple' ? '#1E1035' : '#FFFFFF';
    const textPrimary = cardTheme === 'light' ? '#0F172A' : '#FFFFFF';
    const textSecondary = cardTheme === 'light' ? '#64748B' : '#94A3B8';

    // Rounded card background
    roundRect(ctx, 0, 0, canvas.width, canvas.height, Math.round(targetSize * 0.05), bgCard);

    // Title
    ctx.fillStyle = textPrimary;
    ctx.font = `bold ${Math.round(targetSize * 0.065)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameText || 'Scan QR Code', canvas.width / 2, padding + headerHeight / 2);

    // QR Code Container with subtle border
    const qrX = padding;
    const qrY = padding + headerHeight;
    ctx.drawImage(sourceCanvas, qrX, qrY, targetSize, targetSize);

    // Subtext
    ctx.fillStyle = textSecondary;
    ctx.font = `${Math.round(targetSize * 0.038)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frameSubtext || 'Point your smartphone camera to connect', canvas.width / 2, qrY + targetSize + footerHeight / 2);

    return canvas;
  }

  // Neon glow style
  const borderMargin = Math.round(targetSize * 0.08);
  canvas.width = targetSize + borderMargin * 2;
  canvas.height = targetSize + borderMargin * 2;

  ctx.fillStyle = '#06060A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Neon gradient frame
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#A855F7');
  grad.addColorStop(0.5, '#3B82F6');
  grad.addColorStop(1, '#EC4899');

  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.round(targetSize * 0.02);
  roundRectStroke(ctx, borderMargin / 2, borderMargin / 2, canvas.width - borderMargin, canvas.height - borderMargin, 24);

  ctx.drawImage(sourceCanvas, borderMargin, borderMargin, targetSize, targetSize);
  return canvas;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function roundRectStroke(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.stroke();
}

/**
 * Downloads PNG from rendered canvas
 */
export async function downloadQRPNG(sourceCanvas: HTMLCanvasElement, options: QROptions, resolution: number = 2048, filename = 'buildicy-qr.png') {
  const canvas = await renderCompositeQRCanvas(sourceCanvas, options, resolution);
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  fireConfetti();
}

/**
 * Copies the QR code image blob directly to user's system clipboard
 */
export async function copyQRImageToClipboard(sourceCanvas: HTMLCanvasElement, options: QROptions): Promise<boolean> {
  try {
    const canvas = await renderCompositeQRCanvas(sourceCanvas, options, 1024);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Blob creation failed');

    if (navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      fireConfetti();
      return true;
    }
    return false;
  } catch (err) {
    console.error('Copy to clipboard failed:', err);
    return false;
  }
}

/**
 * Generates and downloads SVG vector
 */
export function downloadQRSVG(svgElement: SVGSVGElement, filename = 'buildicy-qr.svg') {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  // Add namespaces if not present
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+xmlns\:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
  fireConfetti();
}

/**
 * Generates and downloads a clean printable PDF Flyer/Poster
 */
export async function generatePrintablePDFFlyer(
  sourceCanvas: HTMLCanvasElement,
  options: QROptions,
  title: string = 'Scan to Connect',
  subtitle: string = 'Point your phone camera to scan'
) {
  const canvas = await renderCompositeQRCanvas(sourceCanvas, { ...options, frameStyle: 'none' }, 1200);
  const imgData = canvas.toDataURL('image/png');

  // A4 portrait is 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Background subtle tint
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.roundedRect(12, 12, pageWidth - 24, pageHeight - 24, 6, 6, 'D');

  // Brand top header
  doc.setTextColor(147, 51, 234);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('BUILDICY QR STUDIO', pageWidth / 2, 28, { align: 'center' });

  // Main Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(title || 'SCAN ME', pageWidth / 2, 50, { align: 'center' });

  // Subtitle
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(subtitle || 'Open your camera and point it at the code below', pageWidth / 2, 60, { align: 'center' });

  // White Card for QR Code
  const qrBoxSize = 130;
  const qrX = (pageWidth - qrBoxSize) / 2;
  const qrY = 75;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.8);
  doc.roundedRect(qrX - 8, qrY - 8, qrBoxSize + 16, qrBoxSize + 16, 5, 5, 'FD');

  // Draw QR Image
  doc.addImage(imgData, 'PNG', qrX, qrY, qrBoxSize, qrBoxSize);

  // Link display box
  const targetUrl = options.rawValue || 'https://buildicy.com';
  const displayUrl = targetUrl.length > 55 ? targetUrl.substring(0, 52) + '...' : targetUrl;

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(30, 225, pageWidth - 60, 18, 4, 4, 'F');

  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(displayUrl, pageWidth / 2, 236, { align: 'center' });

  // Instructions
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Compatible with iOS Camera, Android Google Lens, & all modern QR scanners', pageWidth / 2, 258, { align: 'center' });

  // Footer
  doc.setTextColor(168, 85, 247);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Generated with qr.buildicy.com', pageWidth / 2, 276, { align: 'center' });

  doc.save('buildicy-qr-flyer.pdf');
  fireConfetti();
}
