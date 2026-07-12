import { useState } from 'react';
import { RefreshCw, Copy, Check, FileText, ArrowLeftRight, HelpCircle } from 'lucide-react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = (textValue: string, currentMode: 'encode' | 'decode') => {
    setInput(textValue);
    setError('');

    if (!textValue.trim()) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        // Safe base64 encoding supporting unicode/hindi/etc
        const codeUnits = new Uint16Array(textValue.length);
        for (let i = 0; i < codeUnits.length; i++) {
          codeUnits[i] = textValue.charCodeAt(i);
        }
        const charCodes = new Uint8Array(codeUnits.buffer);
        let binString = '';
        for (let i = 0; i < charCodes.byteLength; i++) {
          binString += String.fromCharCode(charCodes[i]);
        }
        setOutput(btoa(binString));
      } else {
        // Safe base64 decoding supporting unicode
        try {
          const binString = atob(textValue.trim());
          const charCodes = new Uint8Array(binString.length);
          for (let i = 0; i < binString.length; i++) {
            charCodes[i] = binString.charCodeAt(i);
          }
          const codeUnits = new Uint16Array(charCodes.buffer);
          let decodedResult = '';
          for (let i = 0; i < codeUnits.length; i++) {
            decodedResult += String.fromCharCode(codeUnits[i]);
          }
          setOutput(decodedResult);
        } catch {
          // Fallback to basic window.atob if unicode buffer alignment is off
          setOutput(decodeURIComponent(escape(atob(textValue.trim()))));
        }
      }
    } catch (err) {
      if (currentMode === 'decode') {
        setError('Invalid Base64 string. Please verify your input characters.');
      } else {
        setError('Error encoding input characters.');
      }
      setOutput('');
    }
  };

  const handleModeSwitch = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    // Swap inputs/outputs safely
    setInput(output);
    handleConvert(output, newMode);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Title Header area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
            <FileText className="w-5.5 h-5.5 text-indigo-500" />
            <span>Base64 Encoder & Decoder</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Convert plain text to base64 encoding or decode base64 strings instantly with complete offline safety.
          </p>
        </div>

        {/* Converter Selector Pill */}
        <button
          onClick={handleModeSwitch}
          className="inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-xl text-xs font-bold transition duration-250 active:scale-95 shrink-0"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Switch to: {mode === 'encode' ? 'Base64 Decode' : 'Base64 Encode'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Text Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            {mode === 'encode' ? 'Plain Text Input' : 'Base64 Encoded Input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => handleConvert(e.target.value, mode)}
            placeholder={mode === 'encode' ? 'Enter text you want to encode here...' : 'Paste your base64 string here (e.g. U2VuZCBmZWVkYmFjaw==)...'}
            className="w-full h-64 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl p-4 text-sm outline-none transition font-mono resize-none"
          />
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Characters: {input.length}</span>
            {input && (
              <button
                onClick={handleClear}
                className="text-red-500 hover:text-red-700 font-bold hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Output Text Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
            {mode === 'encode' ? 'Base64 Encoded Output' : 'Decoded Plain Text Output'}
          </label>
          <div className="relative">
            <textarea
              readOnly
              value={output}
              placeholder="Conversion output will automatically display here..."
              className={`w-full h-64 bg-slate-950 text-slate-100 border border-slate-900 rounded-2xl p-4 text-sm outline-none font-mono resize-none ${
                error ? 'text-red-400 focus:border-red-500' : ''
              }`}
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition duration-200 active:scale-95 flex items-center gap-1 text-[10px] font-bold font-mono"
                title="Copy output to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Characters: {output.length}</span>
            {error && <span className="text-red-500 font-semibold">{error}</span>}
          </div>
        </div>
      </div>

      {/* Helpful Hint banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 text-xs">How does Base64 tool protect my data?</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Unlike other online convert utilities that upload text strings to remote logging servers, our Base64 Encoder/Decoder utilizes standard browser-level APIs. Your data never touches any internet pipeline, making it 100% confidential and safe for APIs, passwords, or keys.
          </p>
        </div>
      </div>
    </div>
  );
}
