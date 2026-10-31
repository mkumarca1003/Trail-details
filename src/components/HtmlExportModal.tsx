import React, { useState, useMemo } from 'react';
import { Download, Copy, Check, Eye, Code, FileCheck, Monitor, Smartphone } from 'lucide-react';
import { ToolConfig } from '../types';
import { generateSingleFileHtml } from '../utils/singleFileHtmlGenerator';

interface HtmlExportPanelProps {
  config: ToolConfig;
  onDownload: () => void;
}

export const HtmlExportPanel: React.FC<HtmlExportPanelProps> = ({ config, onDownload }) => {
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [deviceFrame, setDeviceFrame] = useState<'desktop' | 'mobile'>('desktop');

  const singleFileHtml = useMemo(() => generateSingleFileHtml(config), [config]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(singleFileHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-6">
      
      {/* Header and Download CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <FileCheck className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Deliverable: Standalone Single-File .html
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            100% self-contained file with embedded HTML, CSS, and JS. Zero external scripts or CDNs. Double-click ready.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Preview vs Code toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveSubTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeSubTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={() => setActiveSubTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeSubTab === 'code'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Source</span>
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied HTML!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .html File</span>
          </button>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 block">Single Self-Contained File</strong>
            <span className="text-slate-500">All CSS in &lt;style&gt; and JS in &lt;script&gt;. No external requests.</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 block">Double-Click Ready</strong>
            <span className="text-slate-500">Launches instantly in any web browser without needing a local server.</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-800 block">Documented Functions</strong>
            <span className="text-slate-500">Includes inline comments detailing validation, state, and rendering logic.</span>
          </div>
        </div>
      </div>

      {/* Main Viewport: Live Sandbox Preview or HTML Code Block */}
      {activeSubTab === 'preview' ? (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 text-xs text-slate-500">
            <span className="font-mono font-medium">Single-File Sandbox Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDeviceFrame('desktop')}
                className={`p-1 rounded ${deviceFrame === 'desktop' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceFrame('mobile')}
                className={`p-1 rounded ${deviceFrame === 'mobile' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 flex justify-center bg-slate-100 min-h-[560px]">
            <div
              className={`transition-all duration-300 w-full bg-white rounded-lg shadow-sm overflow-hidden ${
                deviceFrame === 'mobile' ? 'max-w-[420px]' : 'max-w-full'
              }`}
            >
              <iframe
                title="Standalone HTML Tool Preview"
                srcDoc={singleFileHtml}
                className="w-full h-[620px] border-0"
                sandbox="allow-scripts allow-downloads"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>index.html (complete file)</span>
            <span>{(singleFileHtml.length / 1024).toFixed(1)} KB</span>
          </div>
          <div className="p-4 max-h-[580px] overflow-y-auto">
            <pre className="font-mono text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
              {singleFileHtml}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
