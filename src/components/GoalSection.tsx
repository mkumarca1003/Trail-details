import React from 'react';
import { Target, Users, BookOpen, RotateCcw, Bookmark } from 'lucide-react';
import { ToolConfig } from '../types';
import { STARTER_PRESETS } from '../utils/presets';

interface GoalSectionProps {
  config: ToolConfig;
  onChange: (updated: Partial<ToolConfig>) => void;
  onLoadPreset: (presetId: string) => void;
}

export const GoalSection: React.FC<GoalSectionProps> = ({
  config,
  onChange,
  onLoadPreset
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-6">
      
      {/* Header with Title and Preset Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">1. Goal & Session Context</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Define the primary objective of the HTML tool to orient participants and guide prompt generation.
          </p>
        </div>

        {/* Quick Presets Menu */}
        <div className="flex items-center gap-2">
          <Bookmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            onChange={(e) => {
              if (e.target.value) onLoadPreset(e.target.value);
            }}
            defaultValue=""
            className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="" disabled>Load Workshop Preset...</option>
            {STARTER_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onLoadPreset('workshop_prompt_generator')}
            title="Reset to default template"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inputs for Title, Audience, and Goal Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            HTML Tool Title
          </label>
          <input
            type="text"
            value={config.toolTitle}
            onChange={(e) => onChange({ toolTitle: e.target.value })}
            placeholder="e.g. Session Prompt Generator for HTML Tools"
            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Participants / Audience</span>
          </label>
          <input
            type="text"
            value={config.participantAudience}
            onChange={(e) => onChange({ participantAudience: e.target.value })}
            placeholder="e.g. Session Participants, Product Builders, Analysts"
            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Core Goal & Problem Statement (Expected Requirement)</span>
        </label>
        <textarea
          rows={2}
          value={config.goalDescription}
          onChange={(e) => onChange({ goalDescription: e.target.value })}
          placeholder="To create a file, an HTML file that can help participants of my session to develop their own prompt for HTML tool, which can generate their requirement..."
          className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all resize-y"
        />
      </div>

    </div>
  );
};
