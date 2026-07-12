import { Tool } from '../types';
import { HelpCircle, Terminal, Laptop, Globe, Flame } from 'lucide-react';

interface FooterProps {
  tools: Tool[];
  onSelectTool: (id: string) => void;
}

export default function Footer({ tools, onSelectTool }: FooterProps) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-12 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Dynamic grid links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* About Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-white font-extrabold text-sm">
              <Laptop className="w-4 h-4 text-indigo-400" />
              <span>Web Tools Hub</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              A 100% free, fast, and secure suite of browser-native micro-tools optimized for daily digital chores, image operations, PDF compilations, and financial estimations. No files ever leave your local machine.
            </p>
          </div>

          {/* Popular Tools Sitemap links (Extremely critical for search crawler links) */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Popular Utilities</h4>
            <ul className="space-y-2 text-[11px]">
              {tools.slice(0, 5).map((tool) => (
                <li key={tool.id}>
                  <a
                    href={`#${tool.id}`}
                    onClick={(e) => { e.preventDefault(); onSelectTool(tool.id); }}
                    className="hover:text-indigo-400 transition"
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Sitemap links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">Dynamic Pages</h4>
            <ul className="space-y-2 text-[11px]">
              {tools.slice(5).map((tool) => (
                <li key={tool.id}>
                  <a
                    href={`#${tool.id}`}
                    onClick={(e) => { e.preventDefault(); onSelectTool(tool.id); }}
                    className="hover:text-indigo-400 transition"
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* SEO Structured Rich-data info block */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide">SEO & Google Indexing</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-1 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] text-indigo-400">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span>XML Sitemap: /sitemap.xml</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] text-emerald-400">
                <Flame className="w-3.5 h-3.5 shrink-0" />
                <span>SEO Index Score: 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global FAQs (Optimizes search terms for FAQ schema markup) */}
        <div className="space-y-4 pt-8 border-t border-slate-800">
          <h4 className="text-white font-bold text-sm tracking-wide flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-400" /> Frequently Asked Questions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-bold text-slate-200">Are the generated PDFs and images high-resolution?</h5>
              <p className="mt-1 leading-normal">
                Yes! All operations (whether image conversion or PDF merging) maintain vector precision or maximum source pixels directly through client-side HTML5 canvas pipelines.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-slate-200">Do I need to sign up or purchase anything?</h5>
              <p className="mt-1 leading-normal">
                No, all tools are 100% free with no limits, no registration, and no premium gates. All computations are handled locally inside your web browser for maximum security, speed, and privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
          <p>© 2026 Free Online Web Tools Hub. All rights reserved. Developed with local safety standards.</p>
          <div className="flex gap-4">
            <span className="text-slate-600">Privacy Policy</span>
            <span className="text-slate-600">Terms of Service</span>
            <span className="text-slate-600">Contact Webmaster</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
