import React, { useState } from 'react';
import { Header } from './components/Header';
import { GoalSection } from './components/GoalSection';
import { InputsBuilder } from './components/InputsBuilder';
import { OutputsBuilder } from './components/OutputsBuilder';
import { PromptViewer } from './components/PromptViewer';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { HtmlExportPanel } from './components/HtmlExportModal';
import { GitHubTransferModal } from './components/GitHubTransferModal';
import { ToolConfig } from './types';
import { STARTER_PRESETS } from './utils/presets';
import { generateSingleFileHtml } from './utils/singleFileHtmlGenerator';
import { Sparkles, Play, Code2, ArrowRight, GitBranch } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<ToolConfig>(() => STARTER_PRESETS[0].config);
  const [activeTab, setActiveTab] = useState<'designer' | 'prompt' | 'simulator' | 'export'>('designer');
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  const handleUpdateConfig = (updated: Partial<ToolConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleLoadPreset = (presetId: string) => {
    const found = STARTER_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setConfig(JSON.parse(JSON.stringify(found.config)));
    }
  };

  const handleDownloadSingleHtml = () => {
    const htmlContent = generateSingleFileHtml(config);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const filename = `${(config.toolTitle || 'html_tool').toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Header Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadHtml={handleDownloadSingleHtml}
        onOpenGitHub={() => setIsGitHubModalOpen(true)}
        inputCount={config.inputs.length}
        outputCount={config.outputs.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: TOOL DESIGNER */}
        {activeTab === 'designer' && (
          <div className="space-y-6">
            
            {/* Quick Overview Hero Strip */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xs">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-md mb-3">
                  <span>Session Participant Studio</span>
                  <span aria-hidden="true">·</span>
                  <span>Standalone HTML Generator</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                  Build Custom HTML Tools & AI Prompts
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Configure your tool’s goal, select the exact number of inputs (defining Name, Type, Placeholder, and Validation dropdown), define your desired outputs, and export a 100% self-contained single-file <code className="text-blue-300 font-mono">.html</code> ready to open on double-click.
                </p>
              </div>

              {/* Action shortcuts */}
              <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>View AI Prompt</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('simulator')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test Run Tool</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('export')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Inspect HTML Source</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  onClick={() => setIsGitHubModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Transfer to GitHub</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 1. Goal Section */}
            <GoalSection
              config={config}
              onChange={handleUpdateConfig}
              onLoadPreset={handleLoadPreset}
            />

            {/* 2. Inputs Specification Section */}
            <InputsBuilder
              inputs={config.inputs}
              onChange={(updatedInputs) => handleUpdateConfig({ inputs: updatedInputs })}
            />

            {/* 3. Outputs Specification Section */}
            <OutputsBuilder
              outputs={config.outputs}
              onChange={(updatedOutputs) => handleUpdateConfig({ outputs: updatedOutputs })}
            />

            {/* Bottom Action Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-xs text-slate-500">
                Configured: <strong className="text-slate-800">{config.inputs.length} Inputs</strong> with validations · <strong className="text-slate-800">{config.outputs.length} Outputs</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Generate Prompt</span>
                </button>

                <button
                  onClick={handleDownloadSingleHtml}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <span>Export Single .html File</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MASTER PROMPT GENERATOR */}
        {activeTab === 'prompt' && (
          <div>
            <PromptViewer config={config} />
          </div>
        )}

        {/* TAB 3: LIVE RUNNER / SIMULATOR */}
        {activeTab === 'simulator' && (
          <div>
            <InteractiveSimulator config={config} />
          </div>
        )}

        {/* TAB 4: SINGLE-FILE HTML EXPORT */}
        {activeTab === 'export' && (
          <div>
            <HtmlExportPanel
              config={config}
              onDownload={handleDownloadSingleHtml}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">HTML Tool & Prompt Studio</span>
            <span aria-hidden="true">·</span>
            <span>Single-File Offline Architecture</span>
          </div>
          <div>
            All HTML, CSS, and JS embedded in one standalone file · Double-click to run anywhere
          </div>
        </div>
      </footer>

      {/* GitHub Transfer Modal */}
      <GitHubTransferModal
        config={config}
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

    </div>
  );
}
