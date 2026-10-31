import React, { useState } from 'react';
import { Copy, Check, Download, Sparkles, Terminal } from 'lucide-react';
import { ToolConfig } from '../types';
import { generatePromptForLLM } from '../utils/promptGenerator';

interface PromptViewerProps {
  config: ToolConfig;
}

export const PromptViewer: React.FC<PromptViewerProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const promptText = generatePromptForLLM(config);

  const wordCount = promptText.trim().split(/\s+/).length;
  const estimatedTokens = Math.round(wordCount * 1.33);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([promptText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(config.toolTitle || 'html_tool').toLowerCase().replace(/\s+/g, '_')}_prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-6">
      
      {/* Header with Title and Copy / Download Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Generated Master Prompt for AI Models
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Feed this comprehensive prompt into Gemini, ChatGPT, or Claude to build the exact single-file HTML tool.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Metadata counts */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono mr-2">
            <span>{config.inputs.length} Inputs</span>
            <span aria-hidden="true">·</span>
            <span>{config.outputs.length} Outputs</span>
            <span aria-hidden="true">·</span>
            <span>~{estimatedTokens} Tokens</span>
          </div>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Download prompt as markdown file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save .md</span>
          </button>

          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Master Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Display Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>prompt_specification.md</span>
          </div>
          <span>{wordCount} words</span>
        </div>

        <div className="p-4 sm:p-5 max-h-[520px] overflow-y-auto">
          <pre className="font-mono text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap selection:bg-blue-600 selection:text-white">
            {promptText}
          </pre>
        </div>
      </div>

    </div>
  );
};
