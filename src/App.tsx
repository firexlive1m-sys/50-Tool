import { useState, useEffect } from 'react';
import { 
  Image, 
  FileText, 
  Receipt, 
  QrCode, 
  Lock, 
  Calculator, 
  Activity, 
  ArrowRight, 
  Star, 
  Compass, 
  HelpCircle,
  Home,
  CheckCircle2,
  Search,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

import { Tool, ToolCategory } from './types';
import { TOOLS_DATA } from './data/tools';

// Components
import Footer from './components/Footer';

// Tool Workspaces
import ImageConverter from './components/tools/ImageConverter';
import QRCodeGenerator from './components/tools/QRCodeGenerator';
import InvoiceGenerator from './components/tools/InvoiceGenerator';
import PDFUtility from './components/tools/PDFUtility';
import TextCounter from './components/tools/TextCounter';
import PasswordGenerator from './components/tools/PasswordGenerator';
import LoanCalculator from './components/tools/LoanCalculator';
import BMICalculator from './components/tools/BMICalculator';
import Base64Tool from './components/tools/Base64Tool';

function getToolIcon(iconName: string) {
  switch (iconName) {
    case 'Image': return <Image className="w-5 h-5 text-blue-600 shrink-0" />;
    case 'FilePdf': return <FileText className="w-5 h-5 text-rose-600 shrink-0" />;
    case 'Receipt': return <Receipt className="w-5 h-5 text-emerald-600 shrink-0" />;
    case 'QrCode': return <QrCode className="w-5 h-5 text-indigo-600 shrink-0" />;
    case 'FileText': return <FileText className="w-5 h-5 text-cyan-600 shrink-0" />;
    case 'Lock': return <Lock className="w-5 h-5 text-purple-600 shrink-0" />;
    case 'Calculator': return <Calculator className="w-5 h-5 text-amber-600 shrink-0" />;
    case 'Activity': return <Activity className="w-5 h-5 text-rose-600 shrink-0" />;
    default: return <FileText className="w-5 h-5 text-slate-600 shrink-0" />;
  }
}

export default function App() {
  const [activeToolId, setActiveToolId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('All');

  // Synchronize hash routing and update dynamic SEO Metadata in real time
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const matched = TOOLS_DATA.find(t => t.id === hash);
      
      let title = '';
      let description = '';
      let keywords = '';
      let schemaMarkup = {};

      if (matched) {
        setActiveToolId(matched.id);
        title = `${matched.title} - Free Online Web Tools Hub`;
        description = matched.description;
        keywords = matched.keywords.join(', ') + ', web tools, free online utilities';
        
        schemaMarkup = {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": matched.name,
          "description": matched.description,
          "applicationCategory": "UtilityAndTool",
          "operatingSystem": "All",
          "browserRequirements": "Requires HTML5 and JavaScript enabled.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          }
        };
      } else {
        setActiveToolId('');
        title = 'Free Online Web Tools Hub - 100% Free Browser-Native Utilities';
        description = 'A comprehensive, ultra-fast collection of free web utilities including an Image Converter, PDF tools, Invoice Generator, QR Code Generator, and text processing utilities designed for maximum speed and offline safety.';
        keywords = 'web tools, online utilities, free tools hub, image converter, qr generator, pdf utilities, password generator, loan emi calculator, invoice generator, online bmi calculator';
        
        schemaMarkup = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Free Online Web Tools Hub",
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/#?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        };
      }

      // Apply dynamic on-page SEO
      document.title = title;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      }

      // Update schema markup script tag dynamically for SEO indexers
      const existingScript = document.getElementById('dynamic-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement('script');
      script.id = 'dynamic-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaMarkup);
      document.head.appendChild(script);
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial load sync
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectTool = (id: string) => {
    window.location.hash = id;
    setActiveToolId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeTool = TOOLS_DATA.find(t => t.id === activeToolId);

  // Filter tools based on search query AND category selection
  const filteredTools = TOOLS_DATA.filter(tool => {
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    const cleanQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = !cleanQuery || 
      tool.name.toLowerCase().includes(cleanQuery) ||
      tool.title.toLowerCase().includes(cleanQuery) ||
      tool.description.toLowerCase().includes(cleanQuery) ||
      tool.keywords.some(kw => kw.toLowerCase().includes(cleanQuery)) ||
      tool.category.toLowerCase().includes(cleanQuery);

    return matchesCategory && matchesSearch;
  });

  const categories: ToolCategory[] = ['All', 'Images', 'PDF', 'Text', 'Finance', 'Utility', 'Health'];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between font-sans selection:bg-indigo-600 selection:text-white antialiased">
      
      {/* Main Body with no upper global header bar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        
        {/* Dynamic content rendering */}
        {activeToolId && activeTool ? (
          
          /* 1. TOOL WORKSPACE VIEW WITH SIDEBAR & LOCAL SEO ANCHORS */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start animate-fade-in text-left">
            
            {/* Left/Middle Column: Active Interactive Workspace */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Tool Metadata bar with dynamic breadcrumbs instead of a page header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    {getToolIcon(activeTool.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span>Home</span>
                      <ChevronRight className="w-3 h-3" />
                      <span>{activeTool.category}</span>
                    </div>
                    <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl mt-0.5">{activeTool.name}</h2>
                  </div>
                </div>

                <button
                  onClick={() => selectTool('')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2 px-3.5 rounded-xl transition"
                >
                  <Home className="w-3.5 h-3.5 text-slate-500" /> Back to Dashboard
                </button>
              </div>

              {/* Workspace */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                {activeTool.id === 'image-converter' && <ImageConverter />}
                {activeTool.id === 'qr-generator' && <QRCodeGenerator />}
                {activeTool.id === 'invoice-generator' && <InvoiceGenerator />}
                {activeTool.id === 'pdf-converter' && <PDFUtility />}
                {activeTool.id === 'text-analyzer' && <TextCounter />}
                {activeTool.id === 'password-generator' && <PasswordGenerator />}
                {activeTool.id === 'emi-calculator' && <LoanCalculator />}
                {activeTool.id === 'bmi-calculator' && <BMICalculator />}
                {activeTool.id === 'base64-tool' && <Base64Tool />}
              </div>

              {/* Tool FAQ Section (High-Value Search snippets) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3 font-mono">
                  <HelpCircle className="w-4 h-4 text-indigo-500" /> Google Search FAQ Integration
                </h4>
                <div className="divide-y divide-slate-100 space-y-4">
                  {activeTool.faq.map((faq, idx) => (
                    <div key={idx} className={`${idx > 0 ? 'pt-4' : ''}`}>
                      <h5 className="font-bold text-slate-800 text-sm">{faq.question}</h5>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Custom Info Sidebar (Replaced SEOInspector dashboard with user-friendly index info) */}
            <div className="space-y-6">
              
              {/* About this tool info box */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-150 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 text-sm">Offline Local Privacy</h3>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  This utility runs entirely inside your browser's sandboxed environment. Your files, documents, passwords, or data are never transmitted, saved, or uploaded to any cloud server.
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant Execution Speed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>No Limits or Account Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Works Completely Offline</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">INDEX TARGET KEYWORDS</span>
                  <div className="flex flex-wrap gap-1">
                    {activeTool.keywords.map((kw) => (
                      <span key={kw} className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg font-mono">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Switch Utility Sidebar */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-150 pb-3">Explore Other Utilities</h3>
                <div className="space-y-2">
                  {TOOLS_DATA.filter(t => t.id !== activeToolId).slice(0, 5).map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => selectTool(tool.id)}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-150 transition group text-left"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="p-1.5 bg-slate-50 group-hover:bg-indigo-50 rounded-xl border border-slate-100 group-hover:border-indigo-100 shrink-0 transition">
                          {getToolIcon(tool.icon)}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-800 text-xs block truncate group-hover:text-indigo-600 transition">{tool.name}</span>
                          <span className="text-[9px] text-slate-400 block font-mono mt-0.5">{tool.category}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          
          /* 2. THE NEW STUNNING HERO-INTEGRATED HOME DASHBOARD VIEW */
          <div className="space-y-8 animate-fade-in text-left">
            
            {/* Top Integrated Header Hero Block with Search, Logo, Description */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border border-indigo-950/50">
              {/* Decorative dynamic background nodes */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

              <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                
                {/* Visual Brand Title Badge */}
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>FREE BROWSER-NATIVE SUITE</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    Free Online Web Tools Hub
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    Instantly compile, convert, and format digital assets. All processing runs 100% locally in secure web storage with no registration, no files uploaded, and maximum search engine speed.
                  </p>
                </div>

                {/* Centered High-Performance Interactive Search Box */}
                <div className="max-w-xl mx-auto relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search any tools (e.g. image converter, qr, invoice, pdf, bmi)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950/60 text-white placeholder-slate-400 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl py-4.5 pl-12 pr-4 text-sm outline-none transition shadow-inner font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-white font-mono"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Integrated Category Pill Nav Filters */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-xs px-3.5 py-1.5 rounded-xl border transition font-mono font-semibold ${
                        activeCategory === cat
                          ? 'bg-white text-slate-900 border-white shadow-md'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Directory Index Listing Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  <span>Available Browser Utilities</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {searchQuery 
                    ? `Found ${filteredTools.length} matching tools for "${searchQuery}"`
                    : `Explore our collection of ${filteredTools.length} dynamic browser utility tools`}
                </p>
              </div>

              {/* Status anchors */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Google Search Index Ready
                </span>
              </div>
            </div>

            {/* Grid structure */}
            {filteredTools.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-sm">No tools matched your criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try searching for keywords like "pdf", "invoice", "qr", or "bmi".</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-4 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => selectTool(tool.id)}
                    className="group bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 rounded-3xl p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden text-left"
                  >
                    {/* Corner accent glow on hover */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition rounded-bl-3xl pointer-events-none" />

                    <div className="space-y-4">
                      {/* Icon and Category Label */}
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-2xl group-hover:bg-indigo-50 group-hover:border-indigo-100 transition duration-300">
                          {getToolIcon(tool.icon)}
                        </div>
                        <span className="text-[10px] font-bold font-mono tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg">
                          {tool.category}
                        </span>
                      </div>

                      {/* Info description */}
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition text-base leading-snug">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      {/* Keywords labels (Google index helper) */}
                      <div className="flex flex-wrap gap-1">
                        {tool.keywords.slice(0, 3).map((kw) => (
                          <span key={kw} className="text-[9px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-mono">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status Details */}
                    <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span>Search Volume: <strong className="text-slate-700">{tool.searchRankScore}%</strong></span>
                      </div>

                      <span className="flex items-center gap-0.5 text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
                        Launch Tool <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Safe Local Execution Callout panel */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  Your Privacy is Our Guarantee
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-3xl">
                  Since all applications are loaded natively as Javascript routines inside your browser environment, they require <strong>zero transmission to any server</strong>. You can safely generate, convert, calculate, and compile confidential data without any worry of leakages!
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono font-extrabold text-emerald-700 bg-emerald-100/60 border border-emerald-200 px-3 py-1.5 rounded-full">
                  🛡️ 100% Client-Side Safe
                </span>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer with dynamic link selections */}
      <Footer tools={TOOLS_DATA} onSelectTool={selectTool} />

    </div>
  );
}
