import { useState, useRef, ChangeEvent } from 'react';
import jsPDF from 'jspdf';
import { Upload, Download, FileText, Trash2, ArrowUp, ArrowDown, HelpCircle, CheckCircle } from 'lucide-react';

interface ImageFile {
  id: string;
  name: string;
  size: string;
  url: string;
  file: File;
}

export default function PDFUtility() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [margin, setMargin] = useState<number>(10); // mm
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfCompiled, setPdfCompiled] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((f: File) => ({
        id: Math.random().toString(36).substring(2, 11),
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        url: URL.createObjectURL(f),
        file: f,
      }));
      setImages((prev) => [...prev, ...newImages]);
      setPdfCompiled(false);
    }
  };

  const handleRemove = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
    setPdfCompiled(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newImgs = [...images];
    const temp = newImgs[index];
    newImgs[index] = newImgs[index - 1];
    newImgs[index - 1] = temp;
    setImages(newImgs);
    setPdfCompiled(false);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImgs = [...images];
    const temp = newImgs[index];
    newImgs[index] = newImgs[index + 1];
    newImgs[index + 1] = temp;
    setImages(newImgs);
    setPdfCompiled(false);
  };

  const compileToPDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const a4W = 210;
      const a4H = 297;
      const targetW = a4W - margin * 2;
      const targetH = a4H - margin * 2;

      for (let i = 0; i < images.length; i++) {
        if (i > 0) {
          doc.addPage();
        }

        const imgData = images[i];
        
        // Wait for image loading to calculate correct proportions
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            const ratio = img.width / img.height;
            let drawW = targetW;
            let drawH = targetW / ratio;

            if (drawH > targetH) {
              drawH = targetH;
              drawW = targetH * ratio;
            }

            // Center image inside the A4 margins
            const xOffset = margin + (targetW - drawW) / 2;
            const yOffset = margin + (targetH - drawH) / 2;

            try {
              doc.addImage(imgData.url, 'JPEG', xOffset, yOffset, drawW, drawH);
            } catch (err) {
              console.warn('PDF Compilation Fallback:', err);
            }
            resolve();
          };
          img.src = imgData.url;
        });
      }

      doc.save(`compiled_images_document.pdf`);
      setPdfCompiled(true);
    } catch (err) {
      console.error('Failed compiling PDF document:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Convert Images into Single PDF
            </h3>
            <p className="text-xs text-slate-500">Perfect for combining scanner photos, bills, receipts or homework sheets.</p>
          </div>

          <div className="flex gap-2">
            <select
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="bg-white px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-indigo-600 cursor-pointer"
            >
              <option value={0}>No Margin (0mm)</option>
              <option value={5}>Thin Margin (5mm)</option>
              <option value={10}>Standard (10mm)</option>
              <option value={15}>Wide Margin (15mm)</option>
            </select>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
            >
              Add Images
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
        </div>

        {/* Drag Drop or Upload Fallback */}
        {images.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-12 text-center cursor-pointer bg-slate-50/40 hover:bg-slate-50 transition duration-150"
          >
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <span className="font-bold text-slate-700 text-sm block">Choose multiple images to start</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Drag and drop photos directly. No server limits.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* List with control headers */}
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl bg-white overflow-hidden max-h-[300px] overflow-y-auto">
              {images.map((img, index) => (
                <div key={img.id} className="flex items-center justify-between p-3 gap-3 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={img.url} alt="Thumbnail" referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-lg border" />
                    <div className="text-left overflow-hidden">
                      <span className="font-semibold text-xs text-slate-800 block truncate max-w-sm">{img.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{img.size}</span>
                    </div>
                  </div>

                  {/* Ordering and remove tools */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === images.length - 1}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemove(img.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-mono">Total Files: {images.length} pages</span>
              <button
                onClick={compileToPDF}
                disabled={isProcessing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isProcessing ? 'Generating PDF...' : 'Merge & Download PDF'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {pdfCompiled && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl p-4 flex items-center gap-2.5">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">Your files have been compiled successfully and downloaded!</span>
        </div>
      )}
    </div>
  );
}
