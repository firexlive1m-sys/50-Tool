import { useState } from 'react';
import { Calculator, Info, Landmark, Percent, CalendarRange } from 'lucide-react';

export default function LoanCalculator() {
  const [amount, setAmount] = useState(500000); // 5 Lacs / $500k
  const [rate, setRate] = useState(8.5); // %
  const [tenure, setTenure] = useState(5); // years

  // EMI Formula: E = P * r * (1+r)^n / ((1+r)^n - 1)
  // r = annual rate / 12 / 100
  // n = tenure * 12
  const r = (rate / 12) / 100;
  const n = tenure * 12;

  let emi = 0;
  if (r > 0 && n > 0) {
    emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else if (n > 0) {
    emi = amount / n;
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - amount;

  // Generate Year-by-Year Amortization Schedule
  const amortizationSchedule = [];
  let balance = amount;
  
  for (let year = 1; year <= tenure; year++) {
    let interestPaidYearly = 0;
    let principalPaidYearly = 0;

    for (let month = 1; month <= 12; month++) {
      const monthlyInterest = balance * r;
      const monthlyPrincipal = emi - monthlyInterest;

      interestPaidYearly += monthlyInterest;
      principalPaidYearly += monthlyPrincipal;
      balance -= monthlyPrincipal;
    }

    amortizationSchedule.push({
      year,
      interest: interestPaidYearly,
      principal: principalPaidYearly,
      balance: Math.max(0, balance),
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Settings Frame */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-500" /> Loan Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Amount */}
            <div className="space-y-1.5">
              <label htmlFor="amount" className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" /> Principal Amount
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono text-sm focus:outline-indigo-600"
              />
            </div>

            {/* Interest */}
            <div className="space-y-1.5">
              <label htmlFor="rate" className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" /> Interest Rate (p.a.)
              </label>
              <input
                id="rate"
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Math.max(0.1, Number(e.target.value)))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono text-sm focus:outline-indigo-600"
              />
            </div>

            {/* Tenure */}
            <div className="space-y-1.5">
              <label htmlFor="tenure" className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <CalendarRange className="w-3.5 h-3.5" /> Tenure (Years)
              </label>
              <input
                id="tenure"
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl font-mono text-sm focus:outline-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Amortization Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Yearly Repayment Amortization</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="py-2">Year</th>
                  <th className="py-2 text-right">Principal Paid</th>
                  <th className="py-2 text-right">Interest Paid</th>
                  <th className="py-2 text-right">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {amortizationSchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-slate-900">Year {row.year}</td>
                    <td className="py-2.5 text-right">{principalPaidYearlyFormatter(row.principal)}</td>
                    <td className="py-2.5 text-right text-red-500">-{row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="py-2.5 text-right font-bold">{row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary outputs */}
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-20 h-20 bg-indigo-500 opacity-5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Monthly Loan Installment</span>
            <span className="text-3xl font-black text-indigo-400 font-mono tracking-tight block">
              {emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-400 block">per month</span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 font-mono text-xs text-slate-400">
            <div>
              <span>Principal Amount</span>
              <p className="text-sm font-bold text-slate-100 mt-0.5">{amount.toLocaleString()}</p>
            </div>
            <div>
              <span>Total Interest</span>
              <p className="text-sm font-bold text-slate-100 mt-0.5 text-amber-400">{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Total Repayment Amount</span>
            <span className="text-lg font-bold text-slate-100 font-mono tracking-tight mt-1 block">
              {totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  function principalPaidYearlyFormatter(val: number) {
    return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}
