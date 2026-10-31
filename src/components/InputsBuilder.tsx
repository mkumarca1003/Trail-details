import React from 'react';
import { Plus, Trash2, Copy, MoveDown, MoveUp, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ToolInput, InputFieldType, ValidationType } from '../types';
import { INPUT_TYPE_OPTIONS, VALIDATION_OPTIONS } from '../utils/presets';

interface InputsBuilderProps {
  inputs: ToolInput[];
  onChange: (inputs: ToolInput[]) => void;
}

export const InputsBuilder: React.FC<InputsBuilderProps> = ({ inputs, onChange }) => {
  // Direct setter for number of inputs
  const handleSetCount = (targetCount: number) => {
    const clamped = Math.max(1, Math.min(15, targetCount));
    const current = inputs.length;
    if (clamped === current) return;

    if (clamped > current) {
      const added: ToolInput[] = [];
      for (let i = current; i < clamped; i++) {
        added.push({
          id: `inp-${Date.now()}-${i + 1}`,
          name: `Input Field ${i + 1}`,
          type: 'text',
          placeholder: `Enter input value for field ${i + 1}...`,
          validation: 'required',
          validationRule: ''
        });
      }
      onChange([...inputs, ...added]);
    } else {
      onChange(inputs.slice(0, clamped));
    }
  };

  const handleAddInput = () => {
    handleSetCount(inputs.length + 1);
  };

  const handleRemoveInput = (index: number) => {
    if (inputs.length <= 1) {
      return;
    }
    const updated = inputs.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleDuplicateInput = (index: number) => {
    const target = inputs[index];
    const clone: ToolInput = {
      ...target,
      id: `inp-${Date.now()}`,
      name: `${target.name} (Copy)`
    };
    const updated = [...inputs];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= inputs.length) return;
    const updated = [...inputs];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  const handleUpdateInput = (index: number, key: keyof ToolInput, value: unknown) => {
    const updated = inputs.map((inp, idx) => {
      if (idx === index) {
        return { ...inp, [key]: value };
      }
      return inp;
    });
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs mb-6">
      
      {/* Header & Number of Inputs Selection Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-bold font-mono">
              2
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Tool Inputs Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select the number of inputs and configure the 4 required sections (Name, Type, Placeholder/Label, and Validation dropdown).
          </p>
        </div>

        {/* Stepper + Number Selector + Add Button */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            <span className="text-xs font-semibold text-slate-600 px-2">Count:</span>
            <button
              onClick={() => handleSetCount(inputs.length - 1)}
              disabled={inputs.length <= 1}
              className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              title="Decrease input count"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={15}
              value={inputs.length}
              onChange={(e) => handleSetCount(parseInt(e.target.value) || 1)}
              className="w-10 text-center font-bold text-xs font-mono text-slate-900 bg-transparent focus:outline-none"
            />
            <button
              onClick={() => handleSetCount(inputs.length + 1)}
              disabled={inputs.length >= 15}
              className="w-7 h-7 flex items-center justify-center rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              title="Increase input count"
            >
              +
            </button>
          </div>

          {/* Quick presets for number of inputs */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => handleSetCount(num)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                  inputs.length === num
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddInput}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Input</span>
          </button>
        </div>
      </div>

      {/* Cards List for Each Input */}
      <div className="space-y-4">
        {inputs.map((inp, idx) => {
          const selectedVal = VALIDATION_OPTIONS.find((v) => v.value === inp.validation);
          const needsArg = !!selectedVal?.placeholderArg;

          return (
            <div
              key={inp.id}
              className="bg-slate-50/70 border border-slate-200/90 rounded-xl p-4 sm:p-5 transition-all hover:border-slate-300"
            >
              {/* Card Sub-Header with Order and Quick Action Controls */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                    Input #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                    {inp.name || `Input Field ${idx + 1}`}
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
                    disabled={idx === inputs.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                    title="Move down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicateInput(idx)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    title="Duplicate input"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveInput(idx)}
                    disabled={inputs.length <= 1}
                    className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-20 rounded transition-colors"
                    title="Remove input"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* THE 4 REQUIRED SECTIONS IN A RESPONSIVE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                
                {/* SECTION 1: NAME OF THE INPUT */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    1. Input Name
                  </label>
                  <input
                    type="text"
                    value={inp.name}
                    onChange={(e) => handleUpdateInput(idx, 'name', e.target.value)}
                    placeholder="e.g. Sales Transaction Log"
                    className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Identifies this parameter</span>
                </div>

                {/* SECTION 2: INPUT / FILE TYPE */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    2. Input / File Type
                  </label>
                  <select
                    value={inp.type}
                    onChange={(e) => handleUpdateInput(idx, 'type', e.target.value as InputFieldType)}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 cursor-pointer"
                  >
                    {INPUT_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">File upload, text, number, etc.</span>
                </div>

                {/* SECTION 3: PLACEHOLDER / DESCRIPTION / LABEL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    3. Label & Placeholder
                  </label>
                  <input
                    type="text"
                    value={inp.placeholder}
                    onChange={(e) => handleUpdateInput(idx, 'placeholder', e.target.value)}
                    placeholder="e.g. Upload CSV or paste raw data..."
                    className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">User-facing prompt instruction</span>
                </div>

                {/* SECTION 4: VALIDATION REQUIRED (COMING OUT OF A DROPDOWN) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    4. Validation Rule (Dropdown)
                  </label>
                  <select
                    value={inp.validation}
                    onChange={(e) => handleUpdateInput(idx, 'validation', e.target.value as ValidationType)}
                    className="w-full px-2.5 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 cursor-pointer"
                  >
                    {VALIDATION_OPTIONS.map((valOpt) => (
                      <option key={valOpt.value} value={valOpt.value}>
                        {valOpt.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Enforced before processing</span>
                </div>

              </div>

              {/* Extra configuration if validation requires arguments or dropdown options */}
              {(needsArg || inp.type === 'select') && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap gap-3">
                  {needsArg && (
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Validation Parameter ({selectedVal?.placeholderArg})
                      </label>
                      <input
                        type="text"
                        value={inp.validationRule || ''}
                        onChange={(e) => handleUpdateInput(idx, 'validationRule', e.target.value)}
                        placeholder={selectedVal?.placeholderArg || 'Enter rule parameter'}
                        className="w-full px-2.5 py-1 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {inp.type === 'select' && (
                    <div className="flex-1 min-w-[240px]">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Dropdown Menu Options (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={(inp.options || []).join(', ')}
                        onChange={(e) =>
                          handleUpdateInput(
                            idx,
                            'options',
                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          )
                        }
                        placeholder="Option A, Option B, Option C"
                        className="w-full px-2.5 py-1 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
