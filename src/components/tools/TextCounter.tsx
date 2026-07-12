import { useState } from 'react';
import { FileText, Copy, Trash2, ArrowUpDown, AlignLeft, Clock } from 'lucide-react';

export default function TextCounter() {
  const [text, setText] = useState('Type or paste your text here for instant word analysis & formatting options...');

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
  
  // Benchmark adults: ~200 WPM
  const readingTime = Math.ceil(wordCount / 200);

  const handleCaseChange = (mode: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (mode === 'upper') {
      setText(text.toUpperCase());
    } else if (mode === 'lower') {
      setText(text.toLowerCase());
    } else if (mode === 'title') {
      const converted = text
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      setText(converted);
    } else if (mode === 'sentence') {
      const converted = text
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
      setText(converted);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Form Column */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" /> Enter Text Block
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-xl border border-slate-200 transition"
                title="Copy to clipboard"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setText('')}
                className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-xl border border-slate-200 transition"
                title="Clear content"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-2xl text-sm leading-relaxed focus:outline-indigo-600"
            placeholder="Start typing..."
          />

          {/* Quick converters */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Text Formatter & Case Converters</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCaseChange('upper')}
                className="py-1.5 px-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-indigo-200 transition"
              >
                UPPERCASE
              </button>
              <button
                onClick={() => handleCaseChange('lower')}
                className="py-1.5 px-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-indigo-200 transition"
              >
                lowercase
              </button>
              <button
                onClick={() => handleCaseChange('title')}
                className="py-1.5 px-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-indigo-200 transition"
              >
                Title Case
              </button>
              <button
                onClick={() => handleCaseChange('sentence')}
                className="py-1.5 px-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-indigo-200 transition"
              >
                Sentence case
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics stats column */}
      <div className="space-y-4">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <AlignLeft className="w-4 h-4 text-slate-400" /> Live Text Analytics
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 border border-slate-150 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-mono block">Characters</span>
              <span className="text-xl font-bold text-slate-800 font-mono block mt-1">{charCount}</span>
            </div>
            <div className="bg-white p-3 border border-slate-150 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-mono block">Words</span>
              <span className="text-xl font-bold text-slate-800 font-mono block mt-1">{wordCount}</span>
            </div>
            <div className="bg-white p-3 border border-slate-150 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-mono block">Sentences</span>
              <span className="text-xl font-bold text-slate-800 font-mono block mt-1">{sentenceCount}</span>
            </div>
            <div className="bg-white p-3 border border-slate-150 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-mono block">Paragraphs</span>
              <span className="text-xl font-bold text-slate-800 font-mono block mt-1">{paragraphCount}</span>
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
            <div className="text-left">
              <span className="text-[10px] text-indigo-600 font-bold block uppercase tracking-wider">Estimated Read Time</span>
              <span className="text-sm font-bold text-indigo-900 font-mono mt-0.5 block">{readingTime} {readingTime === 1 ? 'minute' : 'minutes'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
