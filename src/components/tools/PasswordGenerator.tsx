import { useState, useEffect } from 'react';
import { Lock, Copy, Check, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      setPassword('Please select at least one character type!');
      return;
    }

    let generated = '';
    // Use high-grade Cryptographically Secure Random numbers (CSPRNG)
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
      const index = randomArray[i] % charset.length;
      generated += charset[index];
    }

    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const handleCopy = () => {
    if (password === 'Please select at least one character type!') return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Evaluate password strength
  const getStrength = () => {
    if (password.includes('Please select')) return { label: 'Empty', color: 'bg-slate-200 text-slate-600', score: 0 };
    
    let activeTypesCount = 0;
    if (useUpper) activeTypesCount++;
    if (useLower) activeTypesCount++;
    if (useNumbers) activeTypesCount++;
    if (useSymbols) activeTypesCount++;

    if (length < 8 || activeTypesCount <= 1) {
      return { label: 'Weak (Vulnerable)', color: 'bg-red-100 text-red-700', score: 1 };
    }
    if (length < 12 || activeTypesCount === 2) {
      return { label: 'Medium (Adequate)', color: 'bg-amber-100 text-amber-700', score: 2 };
    }
    if (length < 16 || activeTypesCount === 3) {
      return { label: 'Strong (Highly Secure)', color: 'bg-emerald-100 text-emerald-700', score: 3 };
    }
    return { label: 'Military-Grade (Impossible to Hack)', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', score: 4 };
  };

  const strength = getStrength();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Settings Frame */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-500" /> Security Configuration
        </h3>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Password Length</span>
            <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">{length} characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            step="1"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Checkbox settings */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Character Parameters</label>
          
          <div className="space-y-2">
            {[
              { id: 'upper', checked: useUpper, setChecked: setUseUpper, label: 'A-Z Uppercase Letters' },
              { id: 'lower', checked: useLower, setChecked: setUseLower, label: 'a-z Lowercase Letters' },
              { id: 'numbers', checked: useNumbers, setChecked: setUseNumbers, label: '0-9 Numerical Digits' },
              { id: 'symbols', checked: useSymbols, setChecked: setUseSymbols, label: 'Symbols (!@#$%^&*)' },
            ].map((opt) => (
              <label key={opt.id} className="flex items-center gap-2.5 text-sm font-semibold text-slate-750 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.setChecked(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Output Display */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
        <div className="space-y-2 w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Generated Secure Password</span>
          <p className="text-[11px] text-slate-500">Double click or tap to select. Ready to secure accounts.</p>
        </div>

        {/* Output frame */}
        <div className="my-6 w-full p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 overflow-hidden shadow-sm relative group">
          <span className="font-mono text-sm sm:text-base font-bold text-slate-800 break-all select-all flex-1 text-left pr-2">
            {password}
          </span>
          <button
            onClick={handleCopy}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition shrink-0 active:scale-95"
            title="Copy Password"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength indicators */}
        <div className="w-full space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Strength Classification</span>
            <div className={`py-1.5 px-4 rounded-xl text-xs font-bold ${strength.color}`}>
              {strength.label}
            </div>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  strength.score >= step
                    ? strength.score === 1
                      ? 'bg-red-500'
                      : strength.score === 2
                      ? 'bg-amber-500'
                      : strength.score === 3
                      ? 'bg-emerald-500'
                      : 'bg-indigo-600'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="pt-2 text-slate-400 text-[10px] flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Generates cryptographically secure keys locally.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
