import { ToolConfig } from '../types';
import { generatePromptForLLM } from './promptGenerator';

/**
 * Generates a complete, production-ready, standalone single-file HTML document.
 * Contains 100% embedded HTML, CSS, and JS with zero external dependencies.
 * Opens on double-click in any web browser completely offline.
 * Includes clear, educational comments explaining all main functions.
 */
export function generateSingleFileHtml(config: ToolConfig): string {
  const generatedPrompt = generatePromptForLLM(config);
  const configJson = JSON.stringify(config, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.toolTitle || 'Interactive HTML Tool Studio')}</title>
  <style>
    /* ==========================================================================
       SECTION 1: MODERN RESET & CSS VARIABLES
       All styles are 100% self-contained with no external font or CSS dependencies.
       ========================================================================== */
    :root {
      --font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      
      --bg-canvas: #f8fafc;
      --bg-surface: #ffffff;
      --bg-surface-subtle: #f1f5f9;
      --bg-surface-active: #e2e8f0;
      
      --border-subtle: #e2e8f0;
      --border-strong: #cbd5e1;
      --border-focus: #2563eb;
      
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-subtle: #94a3b8;
      --text-inverse: #ffffff;
      
      --brand-primary: #0f172a;
      --brand-primary-hover: #1e293b;
      --brand-accent: #2563eb;
      --brand-accent-hover: #1d4ed8;
      
      --status-success: #16a34a;
      --status-error: #dc2626;
      --status-error-bg: #fef2f2;
      --status-error-border: #fca5a5;
      
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--bg-canvas);
      color: var(--text-main);
      line-height: 1.5;
      font-size: 15px;
      -webkit-font-smoothing: antialiased;
      padding: 0;
    }

    /* Container constraints */
    .app-shell {
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px 20px 80px 20px;
    }

    /* ==========================================================================
       SECTION 2: TOP NAVIGATION BAR CONTRACT
       Wordmark on left, view mode switcher in center, primary CTA on right.
       ========================================================================== */
    .top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 16px 24px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      margin-bottom: 24px;
    }

    .brand-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.01em;
      white-space: nowrap;
    }

    .nav-tabs {
      display: flex;
      align-items: center;
      background: var(--bg-surface-subtle);
      padding: 4px;
      border-radius: var(--radius-md);
      gap: 4px;
      overflow-x: auto;
    }

    .tab-btn {
      background: transparent;
      border: none;
      padding: 7px 14px;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: var(--text-main);
    }

    .tab-btn.active {
      background: var(--bg-surface);
      color: var(--text-main);
      box-shadow: var(--shadow-sm);
    }

    .action-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }

    .btn-primary {
      background: var(--brand-primary);
      color: var(--text-inverse);
    }

    .btn-primary:hover {
      background: var(--brand-primary-hover);
    }

    .btn-accent {
      background: var(--brand-accent);
      color: var(--text-inverse);
    }

    .btn-accent:hover {
      background: var(--brand-accent-hover);
    }

    .btn-outline {
      background: var(--bg-surface);
      border-color: var(--border-strong);
      color: var(--text-main);
    }

    .btn-outline:hover {
      background: var(--bg-surface-subtle);
      border-color: var(--text-muted);
    }

    .btn-sm {
      padding: 5px 10px;
      font-size: 12px;
    }

    .btn-danger {
      background: transparent;
      color: var(--status-error);
      border: 1px solid var(--status-error-border);
    }

    .btn-danger:hover {
      background: var(--status-error-bg);
    }

    /* ==========================================================================
       SECTION 3: CARD-BASED LAYOUT
       Modern, clean cards with hairline borders and single-elevation depth.
       ========================================================================== */
    .card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 24px;
      box-shadow: var(--shadow-sm);
      margin-bottom: 24px;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border-subtle);
      gap: 12px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Form Controls & Inputs */
    .form-group {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 6px;
      text-transform: none;
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 9px 12px;
      font-family: inherit;
      font-size: 14px;
      color: var(--text-main);
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-md);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--border-focus);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    .form-input.error, .form-select.error, .form-textarea.error {
      border-color: var(--status-error);
      background-color: var(--status-error-bg);
    }

    .error-msg {
      font-size: 12px;
      color: var(--status-error);
      margin-top: 4px;
      display: none;
    }

    .form-textarea {
      min-height: 80px;
      resize: vertical;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .schema-card {
      background: var(--bg-canvas);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 16px;
      margin-bottom: 14px;
      position: relative;
    }

    .schema-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 13px;
      font-weight: 700;
      color: var(--text-main);
    }

    .number-selector-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      padding: 12px 16px;
      background: var(--bg-surface-subtle);
      border-radius: var(--radius-md);
      flex-wrap: wrap;
    }

    .stepper {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border-strong);
      background: var(--bg-surface);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .stepper-btn {
      background: transparent;
      border: none;
      width: 32px;
      height: 32px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stepper-btn:hover {
      background: var(--bg-surface-subtle);
    }

    .stepper-val {
      width: 44px;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      border: none;
      background: transparent;
    }

    .quick-chips {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .chip-btn {
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      cursor: pointer;
      color: var(--text-muted);
    }

    .chip-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-main);
    }

    .chip-btn.active {
      background: var(--brand-primary);
      color: var(--text-inverse);
      border-color: var(--brand-primary);
    }

    /* Code & Output Preview */
    .code-container {
      position: relative;
      background: #0f172a;
      border-radius: var(--radius-md);
      padding: 16px;
      overflow-x: auto;
    }

    .code-block {
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.6;
      color: #e2e8f0;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .copy-floating-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #334155;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 600;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .copy-floating-btn:hover {
      background: #334155;
    }

    /* Output Results Table */
    .results-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 13px;
    }

    .results-table th, .results-table td {
      padding: 10px 14px;
      text-align: left;
      border-bottom: 1px solid var(--border-subtle);
    }

    .results-table th {
      background: var(--bg-surface-subtle);
      font-weight: 700;
      color: var(--text-main);
    }

    .results-table tr:hover td {
      background: var(--bg-canvas);
    }

    /* KPI Stat Box */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 14px;
      margin-top: 14px;
    }

    .kpi-card {
      background: var(--bg-surface-subtle);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 14px;
    }

    .kpi-label {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .kpi-value {
      font-size: 24px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--text-main);
    }

    /* Responsive */
    @media (max-width: 860px) {
      .top-header {
        flex-direction: column;
        align-items: stretch;
      }
      .grid-2, .grid-4 {
        grid-template-columns: 1fr;
      }
      .action-group {
        justify-content: flex-end;
      }
    }
  </style>
</head>
<body>
  <div class="app-shell">
    
    <!-- HEADER CONTRACT -->
    <header class="top-header">
      <div class="brand-title">${escapeHtml(config.toolTitle || 'HTML Tool Prompt Studio')}</div>
      
      <nav class="nav-tabs">
        <button class="tab-btn active" onclick="switchView('designer')">1. Tool Designer</button>
        <button class="tab-btn" onclick="switchView('prompt')">2. Master Prompt</button>
        <button class="tab-btn" onclick="switchView('simulator')">3. Live Tool Runner</button>
      </nav>

      <div class="action-group">
        <button class="btn btn-outline btn-sm" onclick="downloadCurrentHtml()">Download .html</button>
        <button class="btn btn-primary btn-sm" onclick="switchView('simulator')">Run Tool</button>
      </div>
    </header>

    <!-- VIEW 1: DESIGNER VIEW -->
    <main id="view-designer">
      
      <!-- GOAL & CONTEXT CARD -->
      <section class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">1. Goal & Tool Purpose</h2>
            <p class="card-subtitle">Define what this HTML tool accomplishes for your workshop participants</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="resetToDefaults()">Reset Template</button>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Tool Name / Title</label>
            <input type="text" id="cfg-tool-title" class="form-input" value="${escapeHtml(config.toolTitle)}" oninput="updateLiveConfig()">
          </div>
          <div class="form-group">
            <label class="form-label">Target Audience / Session Participants</label>
            <input type="text" id="cfg-audience" class="form-input" value="${escapeHtml(config.participantAudience || 'Workshop Attendees')}" oninput="updateLiveConfig()">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Tool Goal & Objective Statement</label>
          <textarea id="cfg-goal" class="form-textarea" rows="2" oninput="updateLiveConfig()">${escapeHtml(config.goalDescription)}</textarea>
        </div>
      </section>

      <!-- INPUTS SECTION: SELECT NUMBER OF INPUTS & DEFINE THE 4 SECTIONS FOR EACH -->
      <section class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">2. Tool Inputs Specification</h2>
            <p class="card-subtitle">Select the number of inputs and configure the 4 required sections for each input</p>
          </div>
          <button class="btn btn-accent btn-sm" onclick="addNewInput()">+ Add Input</button>
        </div>

        <!-- NUMBER OF INPUTS SELECTOR -->
        <div class="number-selector-bar">
          <span style="font-size: 13px; font-weight: 600;">Number of Inputs:</span>
          <div class="stepper">
            <button class="stepper-btn" onclick="adjustInputCount(-1)">−</button>
            <input type="text" id="input-count-display" class="stepper-val" value="${config.inputs.length}" readonly>
            <button class="stepper-btn" onclick="adjustInputCount(1)">+</button>
          </div>

          <div class="quick-chips">
            <button class="chip-btn" onclick="setInputCount(1)">1</button>
            <button class="chip-btn" onclick="setInputCount(2)">2</button>
            <button class="chip-btn" onclick="setInputCount(3)">3</button>
            <button class="chip-btn" onclick="setInputCount(4)">4</button>
            <button class="chip-btn" onclick="setInputCount(5)">5</button>
            <button class="chip-btn" onclick="setInputCount(6)">6</button>
          </div>
        </div>

        <!-- DYNAMIC CONTAINER FOR ALL INPUT CARDS -->
        <div id="inputs-container"></div>
      </section>

      <!-- OUTPUTS SECTION: SELECT NUMBER OF OUTPUTS & DEFINE THE 4 SECTIONS FOR EACH -->
      <section class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">3. Tool Outputs Specification</h2>
            <p class="card-subtitle">Select the number of outputs and configure the 4 required sections for each output</p>
          </div>
          <button class="btn btn-accent btn-sm" onclick="addNewOutput()">+ Add Output</button>
        </div>

        <!-- NUMBER OF OUTPUTS SELECTOR -->
        <div class="number-selector-bar">
          <span style="font-size: 13px; font-weight: 600;">Number of Outputs:</span>
          <div class="stepper">
            <button class="stepper-btn" onclick="adjustOutputCount(-1)">−</button>
            <input type="text" id="output-count-display" class="stepper-val" value="${config.outputs.length}" readonly>
            <button class="stepper-btn" onclick="adjustOutputCount(1)">+</button>
          </div>

          <div class="quick-chips">
            <button class="chip-btn" onclick="setOutputCount(1)">1</button>
            <button class="chip-btn" onclick="setOutputCount(2)">2</button>
            <button class="chip-btn" onclick="setOutputCount(3)">3</button>
            <button class="chip-btn" onclick="setOutputCount(4)">4</button>
          </div>
        </div>

        <!-- DYNAMIC CONTAINER FOR ALL OUTPUT CARDS -->
        <div id="outputs-container"></div>
      </section>

    </main>

    <!-- VIEW 2: MASTER PROMPT VIEW -->
    <main id="view-prompt" style="display: none;">
      <section class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Master Prompt for HTML Tool</h2>
            <p class="card-subtitle">Ready to copy directly into your AI model (ChatGPT, Gemini, Claude)</p>
          </div>
          <div class="action-group">
            <button class="btn btn-primary btn-sm" id="btn-copy-prompt" onclick="copyPromptToClipboard()">Copy Master Prompt</button>
          </div>
        </div>

        <div class="code-container">
          <button class="copy-floating-btn" onclick="copyPromptToClipboard()">Copy Text</button>
          <pre class="code-block" id="prompt-output-text"></pre>
        </div>
      </section>
    </main>

    <!-- VIEW 3: LIVE SIMULATOR VIEW (RUNS THE TOOL LOCALLY) -->
    <main id="view-simulator" style="display: none;">
      <section class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title" id="sim-tool-title">${escapeHtml(config.toolTitle || 'Interactive HTML Tool Runner')}</h2>
            <p class="card-subtitle" id="sim-tool-goal">${escapeHtml(config.goalDescription)}</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="switchView('designer')">Edit Definition</button>
        </div>

        <!-- FORM CONTROLS GENERATED FROM INPUTS SCHEMA -->
        <form id="simulator-form" onsubmit="handleSimulatorSubmit(event)">
          <div id="simulator-fields-container"></div>
          
          <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button type="submit" class="btn btn-primary">Process & Generate Outputs</button>
            <button type="reset" class="btn btn-outline" onclick="clearSimulatorOutputs()">Clear</button>
          </div>
        </form>
      </section>

      <!-- RESULTS CONTAINER GENERATED FROM OUTPUTS SCHEMA -->
      <section class="card" id="simulator-results-section" style="display: none;">
        <div class="card-header">
          <h2 class="card-title">Generated Outputs</h2>
          <span style="font-size: 12px; color: var(--text-muted);">Calculated Client-Side</span>
        </div>
        <div id="simulator-outputs-container"></div>
      </section>
    </main>

  </div>

  <!-- ==========================================================================
       SECTION 4: INLINE JAVASCRIPT LOGIC WITH EXPLANATORY COMMENTS
       Contains complete data state, validation logic, rendering pipeline, and export.
       ========================================================================== -->
  <script>
    /**
     * Tool Configuration State Object
     * Initialized directly from workshop parameters.
     */
    let appConfig = ${configJson};

    /**
     * FUNCTION 1: switchView(viewName)
     * Handles single-page view transitions between Designer, Prompt, and Simulator.
     */
    function switchView(viewName) {
      document.getElementById('view-designer').style.display = viewName === 'designer' ? 'block' : 'none';
      document.getElementById('view-prompt').style.display = viewName === 'prompt' ? 'block' : 'none';
      document.getElementById('view-simulator').style.display = viewName === 'simulator' ? 'block' : 'none';

      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => 
        b.getAttribute('onclick') && b.getAttribute('onclick').includes(viewName)
      );
      if (activeBtn) activeBtn.classList.add('active');

      if (viewName === 'prompt') {
        renderGeneratedPrompt();
      } else if (viewName === 'simulator') {
        renderSimulatorForm();
      }
    }

    /**
     * FUNCTION 2: renderInputsList()
     * Dynamically renders input cards based on appConfig.inputs.
     * Each card exposes the 4 mandatory sections:
     * 1. Name of the input
     * 2. Input Type (file upload, text file, text, number, etc.)
     * 3. Placeholder / Description / Label
     * 4. Validation Required (Dropdown)
     */
    function renderInputsList() {
      const container = document.getElementById('inputs-container');
      const countDisplay = document.getElementById('input-count-display');
      if (countDisplay) countDisplay.value = appConfig.inputs.length;

      // Update chip highlights
      document.querySelectorAll('.number-selector-bar:first-of-type .chip-btn').forEach(c => {
        c.classList.toggle('active', parseInt(c.innerText) === appConfig.inputs.length);
      });

      container.innerHTML = '';

      appConfig.inputs.forEach((inp, idx) => {
        const card = document.createElement('div');
        card.className = 'schema-card';
        card.innerHTML = \`
          <div class="schema-header">
            <span>Input #\${idx + 1}: \${escapeHtml(inp.name || 'Untitled Input')}</span>
            <button class="btn btn-danger btn-sm" onclick="removeInput(\${idx})">Remove</button>
          </div>

          <div class="grid-4">
            <!-- SECTION 1: NAME OF THE INPUT -->
            <div class="form-group">
              <label class="form-label">1. Input Name</label>
              <input type="text" class="form-input" value="\${escapeHtml(inp.name)}" 
                oninput="updateInputParam(\${idx}, 'name', this.value)" placeholder="e.g. Transaction Log">
            </div>

            <!-- SECTION 2: INPUT / FILE TYPE -->
            <div class="form-group">
              <label class="form-label">2. Input Type</label>
              <select class="form-select" onchange="updateInputParam(\${idx}, 'type', this.value)">
                <option value="text" \${inp.type === 'text' ? 'selected' : ''}>Single-line Text</option>
                <option value="textarea" \${inp.type === 'textarea' ? 'selected' : ''}>Multi-line Textarea</option>
                <option value="number" \${inp.type === 'number' ? 'selected' : ''}>Number</option>
                <option value="file_upload" \${inp.type === 'file_upload' ? 'selected' : ''}>File Upload (Generic)</option>
                <option value="text_file" \${inp.type === 'text_file' ? 'selected' : ''}>Text File (.txt/.md/.json)</option>
                <option value="csv_file" \${inp.type === 'csv_file' ? 'selected' : ''}>CSV File (.csv)</option>
                <option value="select" \${inp.type === 'select' ? 'selected' : ''}>Dropdown Menu</option>
                <option value="date" \${inp.type === 'date' ? 'selected' : ''}>Date Picker</option>
                <option value="checkbox" \${inp.type === 'checkbox' ? 'selected' : ''}>Checkbox / Toggle</option>
                <option value="email" \${inp.type === 'email' ? 'selected' : ''}>Email Address</option>
                <option value="url" \${inp.type === 'url' ? 'selected' : ''}>Web URL</option>
              </select>
            </div>

            <!-- SECTION 3: PLACEHOLDER / DESCRIPTION / LABEL -->
            <div class="form-group">
              <label class="form-label">3. Label / Placeholder</label>
              <input type="text" class="form-input" value="\${escapeHtml(inp.placeholder)}" 
                oninput="updateInputParam(\${idx}, 'placeholder', this.value)" placeholder="e.g. Upload CSV dataset">
            </div>

            <!-- SECTION 4: VALIDATION (COMING OUT OF A DROPDOWN) -->
            <div class="form-group">
              <label class="form-label">4. Validation Rule (Dropdown)</label>
              <select class="form-select" onchange="updateInputParam(\${idx}, 'validation', this.value)">
                <option value="required" \${inp.validation === 'required' ? 'selected' : ''}>Required (Cannot be empty)</option>
                <option value="positive_number" \${inp.validation === 'positive_number' ? 'selected' : ''}>Positive Number (> 0)</option>
                <option value="number_range" \${inp.validation === 'number_range' ? 'selected' : ''}>Number Range (Min-Max)</option>
                <option value="file_extension" \${inp.validation === 'file_extension' ? 'selected' : ''}>File Extension Match</option>
                <option value="email_format" \${inp.validation === 'email_format' ? 'selected' : ''}>Valid Email Format</option>
                <option value="url_format" \${inp.validation === 'url_format' ? 'selected' : ''}>Valid Web URL</option>
                <option value="min_length" \${inp.validation === 'min_length' ? 'selected' : ''}>Minimum Character Length</option>
                <option value="none" \${inp.validation === 'none' ? 'selected' : ''}>None (Optional)</option>
              </select>
            </div>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    /**
     * FUNCTION 3: renderOutputsList()
     * Dynamically renders output cards based on appConfig.outputs.
     * Each card exposes the 4 mandatory sections:
     * 1. Output Name / Title
     * 2. Format / Display Type
     * 3. Destination / Action Trigger
     * 4. Processing / Transformation Logic
     */
    function renderOutputsList() {
      const container = document.getElementById('outputs-container');
      const countDisplay = document.getElementById('output-count-display');
      if (countDisplay) countDisplay.value = appConfig.outputs.length;

      document.querySelectorAll('.number-selector-bar:nth-of-type(2) .chip-btn').forEach(c => {
        c.classList.toggle('active', parseInt(c.innerText) === appConfig.outputs.length);
      });

      container.innerHTML = '';

      appConfig.outputs.forEach((out, idx) => {
        const card = document.createElement('div');
        card.className = 'schema-card';
        card.innerHTML = \`
          <div class="schema-header">
            <span>Output #\${idx + 1}: \${escapeHtml(out.name || 'Untitled Output')}</span>
            <button class="btn btn-danger btn-sm" onclick="removeOutput(\${idx})">Remove</button>
          </div>

          <div class="grid-4">
            <!-- SECTION 1: OUTPUT NAME -->
            <div class="form-group">
              <label class="form-label">1. Output Title</label>
              <input type="text" class="form-input" value="\${escapeHtml(out.name)}" 
                oninput="updateOutputParam(\${idx}, 'name', this.value)" placeholder="e.g. Filtered Records Table">
            </div>

            <!-- SECTION 2: FORMAT / DISPLAY TYPE -->
            <div class="form-group">
              <label class="form-label">2. Format / Type</label>
              <select class="form-select" onchange="updateOutputParam(\${idx}, 'format', this.value)">
                <option value="data_table" \${out.format === 'data_table' ? 'selected' : ''}>Data Table</option>
                <option value="formatted_text" \${out.format === 'formatted_text' ? 'selected' : ''}>Formatted Text / Markdown</option>
                <option value="downloadable_file" \${out.format === 'downloadable_file' ? 'selected' : ''}>Downloadable File</option>
                <option value="summary_cards" \${out.format === 'summary_cards' ? 'selected' : ''}>KPI Summary Cards</option>
                <option value="code_block" \${out.format === 'code_block' ? 'selected' : ''}>Copyable Code Block</option>
                <option value="chart_visual" \${out.format === 'chart_visual' ? 'selected' : ''}>Visual Bar / Progress</option>
              </select>
            </div>

            <!-- SECTION 3: DESTINATION / ACTION TRIGGER -->
            <div class="form-group">
              <label class="form-label">3. Destination Action</label>
              <select class="form-select" onchange="updateOutputParam(\${idx}, 'action', this.value)">
                <option value="on_screen_card" \${out.action === 'on_screen_card' ? 'selected' : ''}>Render On-Screen Card</option>
                <option value="file_download_button" \${out.action === 'file_download_button' ? 'selected' : ''}>Instant File Download</option>
                <option value="copy_clipboard_button" \${out.action === 'copy_clipboard_button' ? 'selected' : ''}>Copy to Clipboard</option>
                <option value="modal_dialog" \${out.action === 'modal_dialog' ? 'selected' : ''}>Modal Popup Dialog</option>
              </select>
            </div>

            <!-- SECTION 4: PROCESSING / TRANSFORMATION LOGIC -->
            <div class="form-group">
              <label class="form-label">4. Processing Logic</label>
              <select class="form-select" onchange="updateOutputParam(\${idx}, 'logic', this.value)">
                <option value="prompt_synthesis" \${out.logic === 'prompt_synthesis' ? 'selected' : ''}>AI Prompt Assembler</option>
                <option value="text_transformation" \${out.logic === 'text_transformation' ? 'selected' : ''}>Text Cleaning & Formatting</option>
                <option value="math_aggregation" \${out.logic === 'math_aggregation' ? 'selected' : ''}>Sum & Avg Aggregation</option>
                <option value="template_merge" \${out.logic === 'template_merge' ? 'selected' : ''}>Template Merge</option>
                <option value="format_conversion" \${out.logic === 'format_conversion' ? 'selected' : ''}>Format Conversion</option>
              </select>
            </div>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    /**
     * Helper to update input attributes in real-time.
     */
    function updateInputParam(index, field, value) {
      if (appConfig.inputs[index]) {
        appConfig.inputs[index][field] = value;
      }
    }

    /**
     * Helper to update output attributes in real-time.
     */
    function updateOutputParam(index, field, value) {
      if (appConfig.outputs[index]) {
        appConfig.outputs[index][field] = value;
      }
    }

    /**
     * FUNCTION 4: Dynamic Input Count Adjusters
     */
    function setInputCount(targetCount) {
      const current = appConfig.inputs.length;
      if (targetCount === current) return;

      if (targetCount > current) {
        for (let i = current; i < targetCount; i++) {
          appConfig.inputs.push({
            id: 'inp-' + (i + 1),
            name: 'Input ' + (i + 1),
            type: 'text',
            placeholder: 'Enter input value...',
            validation: 'required',
            validationRule: ''
          });
        }
      } else {
        appConfig.inputs = appConfig.inputs.slice(0, targetCount);
      }
      renderInputsList();
    }

    function adjustInputCount(delta) {
      const newCount = Math.max(1, Math.min(12, appConfig.inputs.length + delta));
      setInputCount(newCount);
    }

    function addNewInput() {
      adjustInputCount(1);
    }

    function removeInput(index) {
      if (appConfig.inputs.length <= 1) {
        alert('You must have at least 1 input defined.');
        return;
      }
      appConfig.inputs.splice(index, 1);
      renderInputsList();
    }

    /**
     * FUNCTION 5: Dynamic Output Count Adjusters
     */
    function setOutputCount(targetCount) {
      const current = appConfig.outputs.length;
      if (targetCount === current) return;

      if (targetCount > current) {
        for (let i = current; i < targetCount; i++) {
          appConfig.outputs.push({
            id: 'out-' + (i + 1),
            name: 'Output ' + (i + 1),
            format: 'data_table',
            action: 'on_screen_card',
            logic: 'text_transformation'
          });
        }
      } else {
        appConfig.outputs = appConfig.outputs.slice(0, targetCount);
      }
      renderOutputsList();
    }

    function adjustOutputCount(delta) {
      const newCount = Math.max(1, Math.min(8, appConfig.outputs.length + delta));
      setOutputCount(newCount);
    }

    function addNewOutput() {
      adjustOutputCount(1);
    }

    function removeOutput(index) {
      if (appConfig.outputs.length <= 1) {
        alert('You must have at least 1 output defined.');
        return;
      }
      appConfig.outputs.splice(index, 1);
      renderOutputsList();
    }

    function updateLiveConfig() {
      appConfig.toolTitle = document.getElementById('cfg-tool-title').value;
      appConfig.participantAudience = document.getElementById('cfg-audience').value;
      appConfig.goalDescription = document.getElementById('cfg-goal').value;
    }

    /**
     * FUNCTION 6: renderGeneratedPrompt()
     * Compiles all inputs, validations, outputs, and goals into a clean, copyable master prompt.
     */
    function renderGeneratedPrompt() {
      updateLiveConfig();
      let p = "# MASTER PROMPT: Single-File HTML Tool Generator\\n\\n";
      p += "## 1. Goal & Context\\n";
      p += "- **Tool Name**: " + (appConfig.toolTitle || "Custom HTML Tool") + "\\n";
      p += "- **Primary Goal**: " + (appConfig.goalDescription || "Process inputs and generate requirements") + "\\n";
      p += "- **Target Audience**: " + (appConfig.participantAudience || "Session Participants") + "\\n\\n";

      p += "## 2. Technical Deliverable Requirements\\n";
      p += "- Single standalone .html file containing all HTML, CSS, and JS (zero external dependencies).\\n";
      p += "- Works completely offline upon double-clicking.\\n";
      p += "- Modern, clean, professional card-based layout with sans-serif typography.\\n";
      p += "- Educational comments explaining all main functions.\\n\\n";

      p += "## 3. Inputs (" + appConfig.inputs.length + " Defined Inputs)\\n";
      appConfig.inputs.forEach((inp, idx) => {
        p += "### Input " + (idx + 1) + ": " + (inp.name || "Input " + (idx + 1)) + "\\n";
        p += "- Type: " + inp.type + "\\n";
        p += "- Label / Placeholder: " + (inp.placeholder || inp.name) + "\\n";
        p += "- Validation (Dropdown): " + inp.validation + "\\n\\n";
      });

      p += "## 4. Outputs (" + appConfig.outputs.length + " Defined Outputs)\\n";
      appConfig.outputs.forEach((out, idx) => {
        p += "### Output " + (idx + 1) + ": " + (out.name || "Output " + (idx + 1)) + "\\n";
        p += "- Format / Type: " + out.format + "\\n";
        p += "- Action / Destination: " + out.action + "\\n";
        p += "- Processing Logic: " + out.logic + "\\n\\n";
      });

      document.getElementById('prompt-output-text').textContent = p;
    }

    /**
     * FUNCTION 7: copyPromptToClipboard()
     * Copies prompt text to system clipboard with visual indicator.
     */
    function copyPromptToClipboard() {
      const text = document.getElementById('prompt-output-text').textContent;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-copy-prompt');
        const orig = btn.innerText;
        btn.innerText = 'Copied to Clipboard!';
        setTimeout(() => btn.innerText = orig, 2000);
      });
    }

    /**
     * FUNCTION 8: renderSimulatorForm()
     * Generates active HTML form inputs based on the configured input definitions.
     */
    function renderSimulatorForm() {
      updateLiveConfig();
      document.getElementById('sim-tool-title').innerText = appConfig.toolTitle || 'Interactive HTML Tool Runner';
      document.getElementById('sim-tool-goal').innerText = appConfig.goalDescription;

      const container = document.getElementById('simulator-fields-container');
      container.innerHTML = '';

      appConfig.inputs.forEach((inp, idx) => {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.innerText = (idx + 1) + '. ' + (inp.name || 'Input ' + (idx + 1)) + ' (' + inp.validation + ')';
        group.appendChild(label);

        let inputEl;
        if (inp.type === 'textarea') {
          inputEl = document.createElement('textarea');
          inputEl.className = 'form-textarea';
          inputEl.placeholder = inp.placeholder || 'Enter text...';
          inputEl.value = inp.defaultValue || '';
        } else if (inp.type === 'file_upload' || inp.type === 'text_file' || inp.type === 'csv_file') {
          inputEl = document.createElement('input');
          inputEl.type = 'file';
          inputEl.className = 'form-input';
          if (inp.type === 'csv_file') inputEl.accept = '.csv';
          if (inp.type === 'text_file') inputEl.accept = '.txt,.md,.json,.csv';
        } else if (inp.type === 'number') {
          inputEl = document.createElement('input');
          inputEl.type = 'number';
          inputEl.className = 'form-input';
          inputEl.placeholder = inp.placeholder || '0';
          inputEl.value = inp.defaultValue || '50';
        } else if (inp.type === 'date') {
          inputEl = document.createElement('input');
          inputEl.type = 'date';
          inputEl.className = 'form-input';
          inputEl.value = inp.defaultValue || '2026-10-31';
        } else if (inp.type === 'select') {
          inputEl = document.createElement('select');
          inputEl.className = 'form-select';
          const opts = inp.options && inp.options.length ? inp.options : ['Standard Mode', 'Advanced Mode', 'Automated Pipeline'];
          opts.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt;
            o.innerText = opt;
            inputEl.appendChild(o);
          });
        } else {
          inputEl = document.createElement('input');
          inputEl.type = inp.type === 'email' ? 'email' : (inp.type === 'url' ? 'url' : 'text');
          inputEl.className = 'form-input';
          inputEl.placeholder = inp.placeholder || 'Enter value...';
          inputEl.value = inp.defaultValue || '';
        }

        inputEl.id = 'sim-input-' + idx;
        group.appendChild(inputEl);

        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-msg';
        errorMsg.id = 'sim-err-' + idx;
        group.appendChild(errorMsg);

        container.appendChild(group);
      });
    }

    /**
     * FUNCTION 9: validateInput(value, rule, fieldType)
     * Performs strict client-side validation as requested in the dropdown.
     */
    function validateInput(value, rule, fieldType, fileObj) {
      if (rule === 'none') return { valid: true };

      if (rule === 'required') {
        if (fieldType.includes('file')) {
          return { valid: !!fileObj, message: 'Please select a file to continue.' };
        }
        if (!value || value.trim() === '') {
          return { valid: false, message: 'This field cannot be left empty.' };
        }
      }

      if (rule === 'positive_number') {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
          return { valid: false, message: 'Value must be a positive number greater than 0.' };
        }
      }

      if (rule === 'email_format') {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(value)) {
          return { valid: false, message: 'Please enter a valid email address.' };
        }
      }

      if (rule === 'url_format') {
        try {
          new URL(value);
        } catch (_) {
          return { valid: false, message: 'Please enter a valid web URL (e.g. https://...).' };
        }
      }

      if (rule === 'min_length') {
        if (!value || value.trim().length < 10) {
          return { valid: false, message: 'Input must be at least 10 characters long.' };
        }
      }

      return { valid: true };
    }

    /**
     * FUNCTION 10: handleSimulatorSubmit(event)
     * Validates all inputs and processes output generation.
     */
    function handleSimulatorSubmit(event) {
      event.preventDefault();
      let allValid = true;

      const collectedValues = [];

      appConfig.inputs.forEach((inp, idx) => {
        const inputEl = document.getElementById('sim-input-' + idx);
        const errEl = document.getElementById('sim-err-' + idx);
        
        const val = inputEl.type === 'file' ? (inputEl.files[0] ? inputEl.files[0].name : '') : inputEl.value;
        const fileObj = inputEl.type === 'file' ? inputEl.files[0] : null;

        const check = validateInput(val, inp.validation, inp.type, fileObj);

        if (!check.valid) {
          allValid = false;
          inputEl.classList.add('error');
          errEl.innerText = check.message;
          errEl.style.display = 'block';
        } else {
          inputEl.classList.remove('error');
          errEl.style.display = 'none';
          collectedValues.push({ name: inp.name, value: val });
        }
      });

      if (!allValid) {
        return;
      }

      // Render Outputs
      renderSimulatorOutputs(collectedValues);
    }

    /**
     * FUNCTION 11: renderSimulatorOutputs(values)
     * Renders each defined output according to its format and destination.
     */
    function renderSimulatorOutputs(values) {
      const resultsSection = document.getElementById('simulator-results-section');
      const container = document.getElementById('simulator-outputs-container');
      resultsSection.style.display = 'block';
      container.innerHTML = '';

      appConfig.outputs.forEach((out, idx) => {
        const card = document.createElement('div');
        card.className = 'schema-card';
        card.style.background = '#ffffff';

        const header = document.createElement('div');
        header.className = 'schema-header';
        header.innerHTML = '<span>Output #' + (idx + 1) + ': ' + escapeHtml(out.name) + '</span>';
        card.appendChild(header);

        if (out.format === 'data_table') {
          let tableHtml = '<table class="results-table"><thead><tr><th>Parameter</th><th>Submitted Value</th><th>Status</th></tr></thead><tbody>';
          values.forEach(v => {
            tableHtml += '<tr><td>' + escapeHtml(v.name) + '</td><td><strong>' + escapeHtml(v.value) + '</strong></td><td><span style="color: var(--status-success); font-weight: 600;">Verified</span></td></tr>';
          });
          tableHtml += '</tbody></table>';
          card.innerHTML += tableHtml;
        } else if (out.format === 'summary_cards') {
          let kpis = '<div class="kpi-grid">';
          kpis += '<div class="kpi-card"><div class="kpi-label">Total Inputs Processed</div><div class="kpi-value">' + values.length + '</div></div>';
          kpis += '<div class="kpi-card"><div class="kpi-label">Validation Rule Checks</div><div class="kpi-value">100% Passed</div></div>';
          kpis += '<div class="kpi-card"><div class="kpi-label">Output Delivery Mode</div><div class="kpi-value">' + escapeHtml(out.action) + '</div></div>';
          kpis += '</div>';
          card.innerHTML += kpis;
        } else if (out.format === 'code_block') {
          let code = '// Generated Output Payload\\n';
          code += JSON.stringify({ goal: appConfig.goalDescription, data: values }, null, 2);
          card.innerHTML += '<div class="code-container"><pre class="code-block">' + escapeHtml(code) + '</pre></div>';
        } else {
          let summary = '<p style="font-size: 14px; color: var(--text-main); margin-bottom: 10px;">Processed successfully using <strong>' + escapeHtml(out.logic) + '</strong> logic.</p>';
          summary += '<div style="background: var(--bg-surface-subtle); padding: 12px; border-radius: var(--radius-md); font-size: 13px;">' + values.map(v => '<strong>' + escapeHtml(v.name) + ':</strong> ' + escapeHtml(v.value)).join(' | ') + '</div>';
          card.innerHTML += summary;
        }

        // Action Trigger Button
        if (out.action === 'file_download_button' || out.format === 'downloadable_file') {
          const dlBtn = document.createElement('button');
          dlBtn.className = 'btn btn-outline btn-sm';
          dlBtn.style.marginTop = '12px';
          dlBtn.innerText = 'Download ' + (out.name || 'File');
          dlBtn.onclick = () => {
            const blobContent = values.map(v => v.name + ': ' + v.value).join('\\n');
            downloadBlob(blobContent, (out.name || 'export').toLowerCase().replace(/\\s+/g, '_') + '.txt', 'text/plain');
          };
          card.appendChild(dlBtn);
        }

        container.appendChild(card);
      });

      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function clearSimulatorOutputs() {
      document.getElementById('simulator-results-section').style.display = 'none';
      document.getElementById('simulator-outputs-container').innerHTML = '';
    }

    /**
     * FUNCTION 12: downloadBlob(content, filename, type)
     * Triggers client-side file download via Blob URL.
     */
    function downloadBlob(content, filename, type) {
      const blob = new Blob([content], { type: type || 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    /**
     * FUNCTION 13: downloadCurrentHtml()
     * Generates and downloads the current single-file HTML document.
     */
    function downloadCurrentHtml() {
      updateLiveConfig();
      const currentHtml = document.documentElement.outerHTML;
      const cleanTitle = (appConfig.toolTitle || 'html_tool').toLowerCase().replace(/[^a-z0-9]/g, '_');
      downloadBlob(currentHtml, cleanTitle + '.html', 'text/html');
    }

    /**
     * FUNCTION 14: escapeHtml(str)
     * Sanitizes strings to prevent XSS when rendering dynamic markup.
     */
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function resetToDefaults() {
      renderInputsList();
      renderOutputsList();
    }

    // INITIALIZATION ON DOUBLE-CLICK
    window.addEventListener('DOMContentLoaded', () => {
      renderInputsList();
      renderOutputsList();
      renderGeneratedPrompt();
    });
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
