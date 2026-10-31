import React from 'react';
import { Download, Sparkles, Sliders, Play, Code2, GitBranch } from 'lucide-react';

interface HeaderProps {
  activeTab: 'designer' | 'prompt' | 'simulator' | 'export';
  setActiveTab: (tab: 'designer' | 'prompt' | 'simulator' | 'export') => void;
  onDownloadHtml: () => void;
  onOpenGitHub: () => void;
  inputCount: number;
  outputCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onDownloadHtml,
  onOpenGitHub,
  inputCount,
  outputCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-lg tracking-tight text-slate-900 whitespace-nowrap">
              HTML Tool Studio
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-400">
              · Single-File Builder
            </span>
          </div>

          {/* Zone 2: Navigation Links / Workspace Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('designer')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'designer'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>1. Tool Designer</span>
              <span className="text-[11px] opacity-75 font-mono">({inputCount}in/{outputCount}out)</span>
            </button>

            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'prompt'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Master Prompt</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>3. Live Runner</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'export'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>4. HTML File</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenGitHub}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Transfer or push this tool to GitHub"
            >
              <GitBranch className="w-4 h-4 text-slate-800" />
              <span className="hidden sm:inline">Transfer to GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </button>

            <button
              onClick={onDownloadHtml}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
              title="Download standalone .html file that runs on double-click"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">Download .html</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
