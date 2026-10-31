import React, { useState } from 'react';
import { Play, CheckCircle2, AlertCircle, Download, Copy, RefreshCw } from 'lucide-react';
import { ToolConfig, ToolInput } from '../types';

interface InteractiveSimulatorProps {
  config: ToolConfig;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({ config }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    config.inputs.forEach((inp) => {
      initial[inp.id] = inp.defaultValue || (inp.type === 'number' ? '50' : '');
    });
    return initial;
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedData, setSubmittedData] = useState<{ id: string; name: string; value: string }[] | null>(null);
  const [copiedOutputId, setCopiedOutputId] = useState<string | null>(null);

  const handleInputChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const validateField = (inp: ToolInput, value: string): string | null => {
    const val = value?.trim() || '';

    switch (inp.validation) {
      case 'required':
        if (!val) return 'This field is required and cannot be left blank.';
        return null;

      case 'positive_number': {
        const num = parseFloat(val);
        if (isNaN(num) || num <= 0) return 'Must be a positive number greater than 0.';
        return null;
      }

      case 'number_range': {
        const num = parseFloat(val);
        if (isNaN(num)) return 'Please enter a valid numeric value.';
        return null;
      }

      case 'email_format': {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val || !emailRe.test(val)) return 'Please enter a valid email address (e.g. name@domain.com).';
        return null;
      }

      case 'url_format': {
        try {
          new URL(val);
          return null;
        } catch {
          return 'Please enter a valid web URL starting with https:// or http://';
        }
      }

      case 'min_length': {
        const min = parseInt(inp.validationRule || '10') || 10;
        if (val.length < min) return `Requires at least ${min} characters (currently ${val.length}).`;
        return null;
      }

      case 'file_extension':
        if (!val) return 'Please select a valid file matching the required extension.';
        return null;

      case 'none':
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    config.inputs.forEach((inp) => {
      const err = validateField(inp, formValues[inp.id]);
      if (err) {
        errors[inp.id] = err;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmittedData(null);
      return;
    }

    setFormErrors({});
    const compiled = config.inputs.map((inp) => ({
      id: inp.id,
      name: inp.name,
      value: formValues[inp.id] || '(No input)'
    }));
    setSubmittedData(compiled);
  };

  const handleDownloadOutput = (outName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outName.toLowerCase().replace(/\s+/g, '_')}_export.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyOutput = (outId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedOutputId(outId);
    setTimeout(() => setCopiedOutputId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Tool Runner Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="pb-4 mb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-600 text-white text-xs font-bold font-mono">
                ▶
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {config.toolTitle || 'Interactive HTML Tool Runner'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {config.goalDescription || 'Test your configured inputs and view dynamic output results in real-time.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {config.inputs.length} inputs · {config.outputs.length} outputs
            </span>
          </div>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.inputs.map((inp, idx) => {
              const val = formValues[inp.id] ?? '';
              const error = formErrors[inp.id];

              return (
                <div
                  key={inp.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    error
                      ? 'border-red-300 bg-red-50/30'
                      : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
                  } ${inp.type === 'textarea' ? 'md:col-span-2' : ''}`}
                >
                  <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center justify-between">
                    <span>
                      {idx + 1}. {inp.name}
                      {inp.validation !== 'none' && (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </span>
                    <span className="text-[11px] font-normal text-slate-400">
                      [{inp.validation}]
                    </span>
                  </label>

                  {inp.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={val}
                      onChange={(e) => handleInputChange(inp.id, e.target.value)}
                      placeholder={inp.placeholder || 'Enter value...'}
                      className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none transition-all ${
                        error
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15'
                      }`}
                    />
                  ) : inp.type === 'select' ? (
                    <select
                      value={val}
                      onChange={(e) => handleInputChange(inp.id, e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 cursor-pointer"
                    >
                      <option value="">Select option...</option>
                      {(inp.options && inp.options.length > 0
                        ? inp.options
                        : ['Standard Mode', 'Advanced Mode', 'Fast Pipeline']
                      ).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : inp.type === 'file_upload' || inp.type === 'text_file' || inp.type === 'csv_file' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleInputChange(inp.id, file ? file.name : '');
                        }}
                        className="w-full px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <input
                      type={inp.type === 'number' ? 'number' : inp.type === 'date' ? 'date' : inp.type === 'email' ? 'email' : 'text'}
                      value={val}
                      onChange={(e) => handleInputChange(inp.id, e.target.value)}
                      placeholder={inp.placeholder || 'Enter value...'}
                      className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none transition-all ${
                        error
                          ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15'
                      }`}
                    />
                  )}

                  {error && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Submit & Reset Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Process & Generate Outputs</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const resetVals: Record<string, string> = {};
                config.inputs.forEach((i) => (resetVals[i.id] = ''));
                setFormValues(resetVals);
                setFormErrors({});
                setSubmittedData(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Inputs</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Outputs Display (when form is valid and submitted) */}
      {submittedData && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                Generated Outputs ({config.outputs.length} Sections)
              </h3>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
              Validations Passed
            </span>
          </div>

          <div className="space-y-6">
            {config.outputs.map((out, idx) => {
              const outputContent = submittedData.map((d) => `${d.name}: ${d.value}`).join('\n');

              return (
                <div
                  key={out.id}
                  className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/60">
                    <div>
                      <span className="text-xs font-bold font-mono text-blue-600 mr-2">
                        Output #{idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {out.name}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        · {out.format} · {out.action}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyOutput(out.id, outputContent)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedOutputId === out.id ? 'Copied!' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleDownloadOutput(out.name, outputContent)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  {/* Format Rendering */}
                  {out.format === 'data_table' ? (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <tr>
                            <th className="px-3 py-2">Parameter</th>
                            <th className="px-3 py-2">Submitted Value</th>
                            <th className="px-3 py-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {submittedData.map((d) => (
                            <tr key={d.id} className="hover:bg-slate-50/50">
                              <td className="px-3 py-2 font-medium text-slate-800">{d.name}</td>
                              <td className="px-3 py-2 text-slate-600 font-mono text-xs">{d.value}</td>
                              <td className="px-3 py-2 text-emerald-600 font-medium">Valid</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : out.format === 'summary_cards' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium">Inputs Processed</div>
                        <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                          {submittedData.length}
                        </div>
                      </div>
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium">Validation Status</div>
                        <div className="text-xl font-bold font-mono text-emerald-600 mt-1">
                          100% OK
                        </div>
                      </div>
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                        <div className="text-[11px] text-slate-500 font-medium">Output Delivery</div>
                        <div className="text-sm font-semibold text-slate-900 mt-2 truncate">
                          {out.action}
                        </div>
                      </div>
                    </div>
                  ) : out.format === 'code_block' ? (
                    <div className="rounded-lg bg-slate-900 text-slate-100 p-3.5 font-mono text-xs overflow-x-auto">
                      <pre>{JSON.stringify({ output: out.name, payload: submittedData }, null, 2)}</pre>
                    </div>
                  ) : (
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <p className="mb-2 font-medium text-slate-900">
                        Processed via {out.logic} logic:
                      </p>
                      <div className="bg-slate-50 p-2.5 rounded border border-slate-100 font-mono text-xs">
                        {submittedData.map((d) => (
                          <div key={d.id} className="py-0.5">
                            <span className="text-slate-500">{d.name}:</span> <span className="text-slate-900 font-semibold">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {out.logicDetails && (
                    <div className="text-[11px] text-slate-500 mt-2">
                      <strong>Processing Rule:</strong> {out.logicDetails}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
