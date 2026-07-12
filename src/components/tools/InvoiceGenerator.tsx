import { useState } from 'react';
import jsPDF from 'jspdf';
import { FileText, Plus, Trash2, Printer, Download, Sparkles, Receipt, HelpCircle } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

export default function InvoiceGenerator() {
  // Business details
  const [businessName, setBusinessName] = useState('My Business Ltd');
  const [businessEmail, setBusinessEmail] = useState('billing@mybusiness.com');
  const [businessAddress, setBusinessAddress] = useState('123 Innovation Way, Tech Suite 101');

  // Client details
  const [clientName, setClientName] = useState('Acme Corporation');
  const [clientEmail, setClientEmail] = useState('finance@acme.com');
  const [clientAddress, setClientAddress] = useState('456 Enterprise Boulevard');

  // Invoice parameters
  const [invoiceNo, setInvoiceNo] = useState('INV-2026-001');
  const [invoiceDate, setInvoiceDate] = useState('2026-07-12');
  const [invoiceDue, setInvoiceDue] = useState('2026-08-12');
  const [currency, setCurrency] = useState('$');

  // Line items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Advanced SEO Optimization Package', qty: 1, price: 850 },
    { id: '2', description: 'Web Application Design (UX/UI)', qty: 1, price: 1200 },
    { id: '3', description: 'Cloud Maintenance (Monthly Support)', qty: 3, price: 150 },
  ]);

  const [taxRate, setTaxRate] = useState(18); // %
  const [discountRate, setDiscountRate] = useState(5); // %

  // Calculations
  const subTotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const discountAmount = subTotal * (discountRate / 100);
  const taxAmount = (subTotal - discountAmount) * (taxRate / 100);
  const totalAmount = subTotal - discountAmount + taxAmount;

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'New service or item description',
      qty: 1,
      price: 100,
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return; // keep at least 1 row
    setItems(items.filter(item => item.id !== id));
  };

  // Generate vector PDF using jsPDF
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Color definitions
    const primaryColor = [15, 23, 42]; // dark slate #0f172a
    const accentColor = [79, 70, 229]; // Indigo #4f46e5
    const lightGray = [241, 245, 249]; // Slate #f1f5f9
    const textGray = [100, 116, 139]; // Slate #64748b

    // Helper to draw clean banners
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F'); // Header block

    // Invoice Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('INVOICE', 15, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${invoiceNo}`, 15, 25);
    doc.text(`Date: ${invoiceDate}`, 15, 30);
    doc.text(`Due: ${invoiceDue}`, 15, 35);

    // Business Name & details (Right Aligned in white banner)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(businessName, 195, 18, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(businessEmail, 195, 24, { align: 'right' });
    doc.text(businessAddress, 195, 29, { align: 'right' });

    // Client Info Header
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('BILLED TO:', 15, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(clientName, 15, 61);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.text(clientEmail, 15, 66);
    doc.text(clientAddress, 15, 71);

    // Dynamic items table columns layout
    let startY = 85;
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(15, startY, 180, 8, 'F'); // table header fill

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Description', 18, startY + 5.5);
    doc.text('Qty', 115, startY + 5.5, { align: 'center' });
    doc.text('Rate', 145, startY + 5.5, { align: 'right' });
    doc.text('Amount', 190, startY + 5.5, { align: 'right' });

    // Rows
    startY += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);

    items.forEach((item) => {
      // Draw bottom dividing line
      doc.setDrawColor(226, 232, 240);
      doc.line(15, startY + 8, 195, startY + 8);

      const amount = item.qty * item.price;
      doc.text(item.description, 18, startY + 5.5);
      doc.text(item.qty.toString(), 115, startY + 5.5, { align: 'center' });
      doc.text(`${currency}${item.price.toFixed(2)}`, 145, startY + 5.5, { align: 'right' });
      doc.text(`${currency}${amount.toFixed(2)}`, 190, startY + 5.5, { align: 'right' });

      startY += 8;
    });

    // Summary Calculations block
    startY += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);

    doc.text('Subtotal:', 140, startY + 5);
    doc.text(`${currency}${subTotal.toFixed(2)}`, 190, startY + 5, { align: 'right' });

    doc.text(`Discount (${discountRate}%):`, 140, startY + 11);
    doc.text(`-${currency}${discountAmount.toFixed(2)}`, 190, startY + 11, { align: 'right' });

    doc.text(`Tax (${taxRate}%):`, 140, startY + 17);
    doc.text(`${currency}${taxAmount.toFixed(2)}`, 190, startY + 17, { align: 'right' });

    // Total highlight block
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(130, startY + 22, 65, 10, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('Total Amount:', 135, startY + 28.5);
    doc.text(`${currency}${totalAmount.toFixed(2)}`, 190, startY + 28.5, { align: 'right' });

    // Terms & Conditions / Footer signature
    doc.setTextColor(textGray[0], textGray[1], textGray[2]);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your business!', 15, startY + 45);
    doc.text('Terms: Payment is required within 30 days of invoice issuance date.', 15, startY + 50);

    doc.save(`${invoiceNo}_invoice.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Dynamic invoice workspace */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-slate-50 border-b border-slate-150 p-4 sm:p-5 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-slate-800 text-sm sm:text-base">Interactive Invoice Workspace</span>
          </div>

          <div className="flex gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-mono focus:outline-indigo-600 cursor-pointer"
            >
              <option value="$">USD ($)</option>
              <option value="₹">INR (₹)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
            </select>

            <button
              onClick={generatePDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Invoice</span>
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Header block (Sender and Receiver) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-slate-100">
            {/* Sender (Business) Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sender Information</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Company/Business Name"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-indigo-600"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="Billing Email"
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-indigo-600"
                  />
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Company Address"
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Receiver (Client) Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client / Billed To</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client Name / Organization"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-indigo-600"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Client Email"
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-indigo-600"
                  />
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Client Address"
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Metadata (No, Dates) */}
          <div className="grid grid-cols-3 gap-4 pb-6 border-b border-slate-100 text-xs font-mono">
            <div className="space-y-1">
              <label htmlFor="inv-no" className="text-[10px] uppercase font-bold text-slate-400">Invoice #</label>
              <input
                id="inv-no"
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-600"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="inv-date" className="text-[10px] uppercase font-bold text-slate-400">Issue Date</label>
              <input
                id="inv-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-600"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="inv-due" className="text-[10px] uppercase font-bold text-slate-400">Due Date</label>
              <input
                id="inv-due"
                type="date"
                value={invoiceDue}
                onChange={(e) => setInvoiceDue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-indigo-600"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Line Items</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 w-7/12">Item / Service Description</th>
                    <th className="py-2.5 px-3 text-center w-1/12">Qty</th>
                    <th className="py-2.5 px-3 text-right w-2/12">Rate</th>
                    <th className="py-2.5 px-3 text-right w-2/12">Amount</th>
                    <th className="py-2.5 text-center w-1/12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/40 transition">
                      <td className="py-3 pr-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                          className="w-full px-3 py-1.5 border border-transparent hover:border-slate-200 focus:border-indigo-600 rounded-lg text-sm bg-transparent"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleUpdateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))}
                          className="w-full text-center px-2 py-1.5 border border-transparent hover:border-slate-200 focus:border-indigo-600 rounded-lg text-sm bg-transparent font-mono"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 justify-end font-mono">
                          <span>{currency}</span>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleUpdateItem(item.id, 'price', Math.max(0, Number(e.target.value)))}
                            className="w-20 text-right px-2 py-1.5 border border-transparent hover:border-slate-200 focus:border-indigo-600 rounded-lg text-sm bg-transparent"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-700">
                        {currency}{(item.qty * item.price).toFixed(2)}
                      </td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-slate-350 hover:text-red-500 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                          title="Delete Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleAddItem}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition duration-150"
            >
              <Plus className="w-4 h-4" /> Add Item Line
            </button>
          </div>

          {/* Calculation Bottom Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            {/* Notes & Dynamic settings */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adjustments (Tax & Discounts)</h4>
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label htmlFor="tax-r" className="text-slate-500 font-medium">VAT / Tax Rate (%)</label>
                  <input
                    id="tax-r"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="disc-r" className="text-slate-500 font-medium">Discount Rate (%)</label>
                  <input
                    id="disc-r"
                    type="number"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Subtotal blocks */}
            <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-150 text-xs space-y-3 font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">{currency}{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Discount ({discountRate}%):</span>
                <span className="font-semibold text-red-500">-{currency}{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>VAT / Tax ({taxRate}%):</span>
                <span className="font-semibold text-slate-800">+{currency}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-sm font-sans">
                <span className="font-bold text-slate-900">Total Invoice Due:</span>
                <span className="text-lg font-black text-indigo-600 font-mono">{currency}{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
