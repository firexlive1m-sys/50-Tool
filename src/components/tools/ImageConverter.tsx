import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, Download, RefreshCw, FileImage, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [quality, setQuality] = useState<number>(90);
  const [isLockRatio, setIsLockRatio] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setupFile(e.target.files[0]);
    }
  };

  const setupFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    setDownloadUrl('');
    const url = URL.createObjectURL(uploadedFile);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ w: img.width, h: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setupFile(e.dataTransfer.files[0]);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (isLockRatio && originalDimensions.w > 0) {
      const ratio = originalDimensions.h / originalDimensions.w;
      setHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (isLockRatio && originalDimensions.h > 0) {
      const ratio = originalDimensions.w / originalDimensions.h;
      setWidth(Math.round(val * ratio));
    }
  };

  const convertImage = () => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width || img.width;
      canvas.height = height || img.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const mimeType = `image/${targetFormat}`;
        const outputQuality = quality / 100;
        
        try {
          const dataUrl = canvas.toDataURL(mimeType, outputQuality);
          setDownloadUrl(dataUrl);
        } catch (err) {
          console.error('Error during client conversion:', err);
        }
      }
      setIsProcessing(false);
    };
    img.src = previewUrl;
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    const originalName = file?.name.substring(0, file.name.lastIndexOf('.')) || 'converted';
    link.download = `${originalName}_resized.${targetFormat}`;
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-3xl p-8 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition duration-150 relative group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-500 group-hover:scale-110 transition duration-200">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base">Drag & drop your image here</h4>
            <p className="text-xs text-slate-400 mt-1">Supports PNG, JPEG, WEBP, and GIF up to 50MB</p>
          </div>
          <button className="text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition">
            Or select file from your system
          </button>
        </div>
      </div>

      {file && previewUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Column */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <FileImage className="w-5 h-5 text-indigo-500" /> Image Settings
            </h3>

            {/* Target format */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Convert Target Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => { setTargetFormat(fmt); setDownloadUrl(''); }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition uppercase ${
                      targetFormat === fmt
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Resizer */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600 block">Dimensions (Pixels)</label>
                <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLockRatio}
                    onChange={(e) => setIsLockRatio(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  Lock Aspect Ratio
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Width</span>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400">Height</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Quality Slider */}
            {targetFormat !== 'png' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Compression Quality</span>
                  <span className="font-mono text-indigo-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => { setQuality(Number(e.target.value)); setDownloadUrl(''); }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={convertImage}
                disabled={isProcessing}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>{isProcessing ? 'Converting...' : 'Process Image'}</span>
              </button>

              {downloadUrl && (
                <button
                  onClick={handleDownload}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-semibold py-3 px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>

          {/* Preview Column */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Live Preview</span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-3 min-h-[220px] max-h-[300px]">
                <img
                  ref={imageRef}
                  src={downloadUrl || previewUrl}
                  alt="Resizing preview"
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[280px] object-contain rounded-lg"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 text-xs font-mono text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <span>Original File:</span>
                <span className="text-slate-700 truncate max-w-[150px]">{file.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Original Size:</span>
                <span className="text-slate-700">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between">
                <span>Original Res:</span>
                <span className="text-slate-700">{originalDimensions.w} x {originalDimensions.h} px</span>
              </div>
              {downloadUrl && (
                <div className="flex justify-between font-bold text-indigo-600 pt-1">
                  <span>New Resolution:</span>
                  <span>{width} x {height} px ({targetFormat.toUpperCase()})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Safety Badge */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-indigo-900">100% Client-Side Privacy Guarantee</h5>
          <p className="text-[11px] text-indigo-700 leading-relaxed mt-0.5">
            This tool processes your images locally in your browser memory using HTML5 canvas streams. Your photos never leave your device and are never sent to any remote server or third-party storage.
          </p>
        </div>
      </div>
    </div>
  );
}
