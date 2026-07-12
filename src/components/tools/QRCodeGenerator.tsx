import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Palette, Settings, Sparkles, AlertCircle } from 'lucide-react';

export default function QRCodeGenerator() {
  const [text, setText] = useState('https://google.com');
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [margin, setMargin] = useState(4);
  const [logoPreset, setLogoPreset] = useState<'none' | 'web' | 'email' | 'location'>('none');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);

    try {
      // 1. Generate core QR into offscreen canvas with customized settings
      const options = {
        width: size,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H' as const, // high recovery to permit central logo overlap
      };

      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, text, options);

        // 2. Draw logo overlay if requested
        if (logoPreset !== 'none') {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const logoSize = size * 0.18; // 18% of total size
            const logoPos = (size - logoSize) / 2;

            // Draw clean background pill under logo to prevent QR bleeding
            ctx.fillStyle = bgColor;
            ctx.beginPath();
            ctx.roundRect(logoPos - 4, logoPos - 4, logoSize + 8, logoSize + 8, 8);
            ctx.fill();

            // Draw predefined logo icon representation
            ctx.fillStyle = fgColor;
            ctx.strokeStyle = fgColor;
            ctx.lineWidth = 3;

            if (logoPreset === 'web') {
              // Web Globe
              ctx.beginPath();
              ctx.arc(size / 2, size / 2, logoSize / 2, 0, Math.PI * 2);
              ctx.stroke();
              // inner lines
              ctx.beginPath();
              ctx.ellipse(size / 2, size / 2, logoSize / 4, logoSize / 2, 0, 0, Math.PI * 2);
              ctx.stroke();
            } else if (logoPreset === 'email') {
              // Envelope
              ctx.strokeRect(logoPos + 4, logoPos + 8, logoSize - 8, logoSize - 16);
              ctx.beginPath();
              ctx.moveTo(logoPos + 4, logoPos + 8);
              ctx.lineTo(size / 2, size / 2 + 2);
              ctx.lineTo(logoPos + logoSize - 4, logoPos + 8);
              ctx.stroke();
            } else if (logoPreset === 'location') {
              // Location Pin
              ctx.beginPath();
              ctx.arc(size / 2, size / 2 - 4, logoSize / 4, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(size / 2, size / 2 + logoSize / 2 - 4);
              ctx.lineTo(size / 2 - logoSize / 3, size / 2);
              ctx.arc(size / 2, size / 2 - 4, logoSize / 3, Math.PI, 0);
              ctx.closePath();
              ctx.stroke();
            }
          }
        }

        // Convert the final rendered canvas structure to downloadable data URL
        const dataUrl = canvas.toDataURL('image/png');
        setQrImageUrl(dataUrl);
      }
    } catch (err) {
      console.error('Failed to generate QR Code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      generateQRCode();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [text, size, fgColor, bgColor, margin, logoPreset]);

  const handleDownload = () => {
    if (!qrImageUrl) return;
    const link = document.createElement('a');
    link.download = `custom_qr_code.png`;
    link.href = qrImageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Settings Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="qr-text" className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>Enter Link or Content Text</span>
            <span className="font-mono text-slate-400 text-xs">{text.length} chars</span>
          </label>
          <textarea
            id="qr-text"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type URL or text to encode... (e.g. https://mywebsite.com)"
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
          />
        </div>

        {/* Styling controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="fg-color" className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Code Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer overflow-hidden"
              />
              <span className="font-mono text-xs text-slate-600 uppercase">{fgColor}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="bg-color" className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Background
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 border border-slate-200 rounded-lg cursor-pointer overflow-hidden"
              />
              <span className="font-mono text-xs text-slate-600 uppercase">{bgColor}</span>
            </div>
          </div>
        </div>

        {/* Advanced settings */}
        <div className="space-y-4 pt-4 border-t border-slate-150">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-slate-500" /> Sizing & Padding
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="size" className="text-xs text-slate-500 flex justify-between font-medium">
                <span>QR Size</span>
                <span className="font-mono text-slate-700">{size}px</span>
              </label>
              <input
                id="size"
                type="range"
                min="150"
                max="600"
                step="25"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="margin" className="text-xs text-slate-500 flex justify-between font-medium">
                <span>Outer Margin</span>
                <span className="font-mono text-slate-700">{margin} blocks</span>
              </label>
              <input
                id="margin"
                type="range"
                min="1"
                max="8"
                step="1"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Brand Overlay logo */}
        <div className="space-y-2 pt-4 border-t border-slate-150">
          <label className="text-xs font-bold text-slate-600 block">Center Icon Overlay (Increases Trust & CTR)</label>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {([
              { key: 'none', label: 'None' },
              { key: 'web', label: 'Globe' },
              { key: 'email', label: 'Mail' },
              { key: 'location', label: 'Map Pin' },
            ] as const).map((logo) => (
              <button
                key={logo.key}
                onClick={() => setLogoPreset(logo.key)}
                className={`py-2 px-1 border rounded-xl font-medium transition text-[11px] ${
                  logoPreset === logo.key
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {logo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Display & Download Frame */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
        <div className="space-y-2 w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Custom QR Result</span>
          <p className="text-xs text-slate-500 truncate max-w-sm mx-auto">Target: {text || 'Empty Link'}</p>
        </div>

        {/* Canvas container with border frame */}
        <div className="my-6 p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm relative group">
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition rounded-3xl pointer-events-none" />
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-xl select-all" style={{ width: '220px', height: '220px' }} />
        </div>

        {/* Download Actions */}
        <div className="w-full space-y-3">
          <button
            onClick={handleDownload}
            disabled={!text.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PNG</span>
          </button>

          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Supports camera readers & scanning from print.
          </p>
        </div>
      </div>
    </div>
  );
}
