import React from 'react';
import { Plus, Trash2, Copy, MoveDown, MoveUp } from 'lucide-react';
import { ToolOutput, OutputFormatType, OutputActionType, ProcessingLogicType } from '../types';
import { OUTPUT_FORMAT_OPTIONS, OUTPUT_ACTION_OPTIONS, PROCESSING_LOGIC_OPTIONS } from '../utils/presets';

interface OutputsBuilderProps {
  outputs: ToolOutput[];
  onChange: (outputs: ToolOutput[]) => void;
}

export const OutputsBuilder: React.FC<OutputsBuilderProps> = ({ outputs, onChange }) => {
  const handleSetCount = (targetCount: number) => {
    const clamped = Math.max(1, Math.min(10, targetCount));
    const current = outputs.length;
    if (clamped === current) return;

    if (clamped > current) {
      const added: ToolOutput[] = [];
      for (let i = current; i < clamped; i++) {
        added.push({
          id: `out-${Date.now()}-${i + 1}`,
          name: `Output Section ${i + 1}`,
          format: 'data_table',
          action: 'on_screen_card',
          logic: 'text_transformation',
          logicDetails: 'Format processed records into clean tabular layout.'
        });
      }
      onChange([...outputs, ...added]);
    } else {
      onChange(outputs.slice(0, clamped));
    }
  };

  const handleAddOutput = () => {
    handleSetCount(outputs.length + 1);
  };

  const handleRemoveOutput = (index: number) => {
    if (outputs.length <= 1) {
      return;
    }
    const updated = outputs.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleDuplicateOutput = (index: number) => {
    const target = outputs[index];
    const clone: ToolOutput = {
      ...target,
      id: `out-${Date.now()}`,
      name: `${target.name} (Copy)`
    };
    const updated = [...outputs];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= outputs.length) return;
    const updated = [...outputs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleUpdateOutput = (index: number, key: keyof ToolOutput, value: unknown) => {
    const updated = outputs.map((out, idx) => {
      if (idx === index) {
        return { ...out, [key]: value };
      }
      return out;
    });
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-6">
      
      {/* Header & Number of Outputs Selection Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold font-mono">
              3
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Tool Outputs Specification
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select the number of outputs and configure the 4 sections (Title, Display Format, Destination Action, and Processing Rule).
          </p>
        </div>

        {/* Stepper + Number Selector + Add Button */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            <span className="text-xs font-semibold text-slate-600 px-2">Count:</span>
            <button
              onClick={() => handleSetCount(outputs.length - 1)}
              disabled={outputs.length <= 1}
              className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              title="Decrease output count"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={10}
              value={outputs.length}
              onChange={(e) => handleSetCount(parseInt(e.target.value) || 1)}
              className="w-10 text-center font-bold text-xs font-mono text-slate-900 bg-transparent focus:outline-none"
            />
            <button
              onClick={() => handleSetCount(outputs.length + 1)}
              disabled={outputs.length >= 10}
              className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              title="Increase output count"
            >
              +
            </button>
          </div>

          {/* Quick presets for number of outputs */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleSetCount(num)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                  outputs.length === num
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddOutput}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Output</span>
          </button>
        </div>
      </div>

      {/* Cards List for Each Output */}
      <div className="space-y-4">
        {outputs.map((out, idx) => {
          return (
            <div
              key={out.id}
              className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4 sm:p-5 transition-all hover:border-slate-300"
            >
              {/* Card Sub-Header with Order and Quick Action Controls */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                    Output #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                    {out.name || `Output Section ${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                    title="Move up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === outputs.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                    title="Move down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicateOutput(idx)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    title="Duplicate output"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveOutput(idx)}
                    disabled={outputs.length <= 1}
                    className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-20 rounded transition-colors"
                    title="Remove output"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* THE 4 REQUIRED OUTPUT SECTIONS IN A RESPONSIVE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                
                {/* SECTION 1: OUTPUT NAME / TITLE */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    1. Output Title / Name
                  </label>
                  <input
                    type="text"
                    value={out.name}
                    onChange={(e) => handleUpdateOutput(idx, 'name', e.target.value)}
                    placeholder="e.g. Master Prompt for LLM"
                    className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Visible card header</span>
                </div>

                {/* SECTION 2: FORMAT / DISPLAY TYPE */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    2. Format / Display Type
                  </label>
                  <select
                    value={out.format}
                    onChange={(e) => handleUpdateOutput(idx, 'format', e.target.value as OutputFormatType)}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 cursor-pointer"
                  >
                    {OUTPUT_FORMAT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Visual layout style</span>
                </div>

                {/* SECTION 3: DESTINATION / ACTION TRIGGER */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    3. Destination Action
                  </label>
                  <select
                    value={out.action}
                    onChange={(e) => handleUpdateOutput(idx, 'action', e.target.value as OutputActionType)}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 cursor-pointer"
                  >
                    {OUTPUT_ACTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Delivery mechanism</span>
                </div>

                {/* SECTION 4: PROCESSING / TRANSFORMATION LOGIC */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    4. Processing Logic
                  </label>
                  <select
                    value={out.logic}
                    onChange={(e) => handleUpdateOutput(idx, 'logic', e.target.value as ProcessingLogicType)}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 cursor-pointer"
                  >
                    {PROCESSING_LOGIC_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Data computation rule</span>
                </div>

              </div>

              {/* Logic details input */}
              <div className="mt-3 pt-3 border-t border-slate-200/60">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Transformation Details / Rule Notes
                </label>
                <input
                  type="text"
                  value={out.logicDetails || ''}
                  onChange={(e) => handleUpdateOutput(idx, 'logicDetails', e.target.value)}
                  placeholder="e.g. Assemble user inputs into an unambiguous AI prompt with validation boundaries..."
                  className="w-full px-2.5 py-1 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
