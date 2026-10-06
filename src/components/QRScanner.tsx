import { useState, useRef, useEffect, type FC, type DragEvent } from 'react';
import jsQR from 'jsqr';
import { 
  Camera, 
  Upload, 
  ScanLine, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle,
  VideoOff,
  RefreshCw
} from 'lucide-react';

interface QRScannerProps {
  onImportToGenerator: (content: string) => void;
}

export const QRScanner: FC<QRScannerProps> = ({ onImportToGenerator }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanningLive, setIsScanningLive] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop video stream on unmount
  useEffect(() => {
    return () => {
      stopLiveScanner();
    };
  }, []);

  const decodeImageFile = (file: File) => {
    setErrorMsg(null);
    setScanResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setScanResult(code.data);
        } else {
          setErrorMsg('No readable QR code found in this image. Please try a clearer or higher resolution picture.');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      decodeImageFile(file);
    }
  };

  const startLiveScanner = async () => {
    setErrorMsg(null);
    setScanResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanningLive(true);
        scanFrame();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setErrorMsg('Camera access was denied or is not supported by your browser.');
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          setScanResult(code.data);
          stopLiveScanner();
          return;
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  const stopLiveScanner = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanningLive(false);
  };

  const handleCopy = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isUrl = scanResult && /^https?:\/\//i.test(scanResult.trim());

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-white/8 bg-[#0D0D16]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-purple-400" />
            <span>QR Code Scanner & Decoder</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Upload an image, drag-and-drop any QR code screenshot, or use your camera to decode data instantly.
          </p>
        </div>

        {/* Live Camera View */}
        {isScanningLive ? (
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-purple-500/40 shadow-2xl">
            <video ref={videoRef} className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />

            {/* Target Reticle Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 border-2 border-purple-400/80 rounded-2xl relative animate-pulse shadow-lg">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-purple-300" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-purple-300" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-purple-300" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-purple-300" />
              </div>
            </div>

            <button
              onClick={stopLiveScanner}
              className="absolute bottom-4 px-4 py-2 rounded-xl bg-black/70 hover:bg-black text-xs font-semibold text-white border border-white/20 flex items-center gap-2 transition-all"
            >
              <VideoOff className="w-4 h-4 text-red-400" />
              <span>Stop Camera</span>
            </button>
          </div>
        ) : (
          /* File Dropzone & Camera Trigger */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-white/10 hover:border-purple-500/50 bg-[#12121E]/60 hover:bg-[#151524] rounded-2xl p-8 sm:p-10 text-center transition-all flex flex-col items-center justify-center gap-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) decodeImageFile(file);
              }}
            />

            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Drag and drop a QR code image here, or <span className="text-purple-400 underline">browse</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1">Supports PNG, JPEG, SVG, WebP</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startLiveScanner();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Scan with Camera</span>
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Decoded Result Card */}
        {scanResult && (
          <div className="p-5 rounded-2xl bg-[#141424] border border-purple-500/30 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Decoded Content
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                {isUrl ? 'Web URL' : 'Data Payload'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0B12] border border-white/5 text-sm font-mono text-zinc-200 break-all select-all">
              {scanResult}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {isUrl && (
                <a
                  href={scanResult}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Website</span>
                </a>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{copied ? 'Copied!' : 'Copy Content'}</span>
              </button>

              <button
                onClick={() => onImportToGenerator(scanResult)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/20 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-style in Generator</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
