import { useState } from 'react';
import { Activity, ShieldAlert, Heart, RefreshCw } from 'lucide-react';

export default function BMICalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState(70); // kg or lbs
  const [height, setHeight] = useState(175); // cm or inches

  // Calculations
  let bmi = 0;
  if (unit === 'metric' && height > 0) {
    bmi = weight / Math.pow(height / 100, 2);
  } else if (unit === 'imperial' && height > 0) {
    bmi = (weight / Math.pow(height, 2)) * 703;
  }

  const getStatus = () => {
    if (bmi <= 0) return { label: 'Empty', color: 'text-slate-400 bg-slate-50', desc: '' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600 bg-blue-50 border-blue-100', desc: 'You are below the standard weight category. It is recommended to consult a nutritionist for guidance on healthy caloric intake.' };
    if (bmi < 25) return { label: 'Normal / Healthy Range', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', desc: 'Congratulations! You are within the ideal medical weight parameters. Maintain your balanced diet and active routine.' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-600 bg-amber-50 border-amber-100', desc: 'You are slightly above the standard range. Small modifications like regular walking and portion control can bring you back to the ideal bracket.' };
    return { label: 'Obese', color: 'text-red-600 bg-red-50 border-red-100', desc: 'Your index points to the obese bracket. It is highly advisable to seek professional clinical advice to organize a sustainable fitness plan.' };
  };

  const status = getStatus();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Parameter inputs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
            <Activity className="w-5 h-5 text-indigo-500" /> Physical Parameters
          </h3>
          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => { setUnit('metric'); setWeight(70); setHeight(175); }}
              className={`px-3 py-1 rounded-lg transition ${unit === 'metric' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Metric
            </button>
            <button
              onClick={() => { setUnit('imperial'); setWeight(150); setHeight(68); }}
              className={`px-3 py-1 rounded-lg transition ${unit === 'imperial' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Imperial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Height */}
          <div className="space-y-1.5">
            <label htmlFor="height" className="text-xs font-bold text-slate-600">Height ({unit === 'metric' ? 'cm' : 'inches'})</label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono text-sm focus:outline-indigo-600"
            />
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <label htmlFor="weight" className="text-xs font-bold text-slate-600">Weight ({unit === 'metric' ? 'kg' : 'lbs'})</label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-mono text-sm focus:outline-indigo-600"
            />
          </div>
        </div>

        {/* Dynamic tips banner based on calculations */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
          <strong>Tip:</strong> An ideal BMI for average adult parameters ranges between 18.5 and 24.9. Drinking plenty of water and walking 10,000 steps daily contributes heavily to a healthy index.
        </div>
      </div>

      {/* Index gauge outputs */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center">
        <div className="space-y-1 w-full">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Body Mass Index (BMI)</span>
          <span className="text-4xl sm:text-5xl font-black text-indigo-600 font-mono tracking-tight block my-4">
            {bmi > 0 ? bmi.toFixed(1) : '0.0'}
          </span>
        </div>

        {/* Diagnostic Status Box */}
        {bmi > 0 && (
          <div className="w-full space-y-4">
            <div className={`p-4 border rounded-2xl text-xs font-medium space-y-1 text-left ${status.color}`}>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Heart className="w-4 h-4 shrink-0" />
                <span>Status: {status.label}</span>
              </div>
              <p className="opacity-90 leading-relaxed pt-1 font-sans">{status.desc}</p>
            </div>

            {/* Custom linear scale index bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div className="bg-blue-400 h-full w-[35%]" title="Underweight" />
                <div className="bg-emerald-400 h-full w-[25%]" title="Normal" />
                <div className="bg-amber-400 h-full w-[20%]" title="Overweight" />
                <div className="bg-red-400 h-full w-[20%]" title="Obese" />
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 text-slate-400 text-[10px]">
          Calculate parameters instantly client-side. Protects your personal fitness details.
        </div>
      </div>
    </div>
  );
}
