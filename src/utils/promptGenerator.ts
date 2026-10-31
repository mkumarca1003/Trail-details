import { ToolConfig } from '../types';

/**
 * Generates an exhaustive, high-fidelity prompt for LLMs (ChatGPT, Claude, Gemini)
 * based on the participant's specified goal, number of inputs, input attributes,
 * number of outputs, and output attributes.
 */
export function generatePromptForLLM(config: ToolConfig): string {
  const {
    toolTitle,
    goalDescription,
    participantAudience,
    sessionContext,
    inputs,
    outputs,
    includeComments,
    standaloneOffline
  } = config;

  let prompt = `# MASTER PROMPT: Single-File HTML Tool Generator\n\n`;
  prompt += `## 1. Primary Goal & Context\n`;
  prompt += `- **Tool Name**: ${toolTitle || 'Custom HTML Workshop Tool'}\n`;
  prompt += `- **Primary Goal**: ${goalDescription || 'Help session participants automate their workflow and generate actionable requirements.'}\n`;
  if (participantAudience) {
    prompt += `- **Target Audience**: ${participantAudience}\n`;
  }
  if (sessionContext) {
    prompt += `- **Session / Context**: ${sessionContext}\n`;
  }

  prompt += `\n## 2. Technical Deliverable Requirements\n`;
  prompt += `- **Format**: Exactly ONE complete, standalone \`.html\` file containing HTML structure, embedded CSS styling in \`<style>\`, and embedded JavaScript logic in \`<script>\`.\n`;
  prompt += `- **Zero External Dependencies**: Must run 100% offline with NO external CDN links (no external CSS/JS scripts) so that double-clicking the file in any browser (Chrome, Edge, Safari, Firefox) opens and functions immediately.\n`;
  prompt += `- **Style & Layout**: Modern, clean, professional card-based aesthetic with sans-serif typography, clean visual hierarchy, generous touch targets, and mobile-friendly responsive layout.\n`;
  if (includeComments) {
    prompt += `- **Code Documentation**: Include clear, instructive code comments above every primary function (input validation, event listeners, data parsing, transformation pipeline, and rendering handlers) so session participants can easily learn and adapt it.\n`;
  }

  prompt += `\n## 3. Input Specification (${inputs.length} Defined Inputs)\n`;
  prompt += `The application must render a clear card-based form containing the following ${inputs.length} user inputs. Every input must enforce its specified validation rule before processing:\n\n`;

  inputs.forEach((inp, idx) => {
    prompt += `### Input ${idx + 1}: ${inp.name || `Input #${idx + 1}`}\n`;
    prompt += `- **Identifier**: \`${inp.id}\`\n`;
    prompt += `- **Input Type**: ${inp.type} (${getInputTypeDescription(inp.type)})\n`;
    prompt += `- **Label / Placeholder / Help Text**: "${inp.placeholder || inp.name}"\n`;
    prompt += `- **Validation Rule**: ${formatValidationDescription(inp.validation, inp.validationRule)}\n`;
    if (inp.options && inp.options.length > 0) {
      prompt += `- **Dropdown Options**: ${inp.options.join(', ')}\n`;
    }
    prompt += `\n`;
  });

  prompt += `## 4. Output Specification (${outputs.length} Defined Outputs)\n`;
  prompt += `Upon clicking the primary "Process & Generate" action, the tool must evaluate the validated inputs and produce the following ${outputs.length} outputs:\n\n`;

  outputs.forEach((out, idx) => {
    prompt += `### Output ${idx + 1}: ${out.name || `Output #${idx + 1}`}\n`;
    prompt += `- **Identifier**: \`${out.id}\`\n`;
    prompt += `- **Format / Display Type**: ${formatOutputType(out.format)}\n`;
    prompt += `- **Destination / Action**: ${formatActionType(out.action)}\n`;
    prompt += `- **Processing Logic**: ${formatLogicType(out.logic)}${out.logicDetails ? ` — ${out.logicDetails}` : ''}\n`;
    if (out.fileExtension) {
      prompt += `- **Target File Format**: ${out.fileExtension}\n`;
    }
    prompt += `\n`;
  });

  prompt += `## 5. Execution & Validation Rules\n`;
  prompt += `1. **Client-Side Validation Engine**: On form submission, validate every input against its rule. If validation fails, highlight the specific field with an intuitive error indicator and message, preventing execution.\n`;
  prompt += `2. **Responsive Card-Based Layout**: Inputs and outputs must reside in modern, clean cards with subtle borders and shadows. On mobile screens, stack cards vertically; on desktop screens (>= 1024px), display inputs and live outputs side-by-side or in structured dual-column layout.\n`;
  prompt += `3. **Feedback & Interactivity**: Provide smooth visual feedback upon action triggers (e.g. copy buttons changing temporarily to "Copied!", download buttons triggering direct client-side blob downloads, and clear reset controls).\n`;
  prompt += `4. **Self-Contained File**: Output the single \`index.html\` without wrapping in backticks or markdown if pure code is requested, or inside a clean HTML code block ready to save.\n`;

  return prompt;
}

function getInputTypeDescription(type: string): string {
  switch (type) {
    case 'text': return 'Single-line text input field';
    case 'textarea': return 'Multi-line text area for paragraphs or long text';
    case 'number': return 'Numeric input with increment/decrement steppers';
    case 'file_upload': return 'Local file picker with drag-and-drop zone';
    case 'text_file': return 'File input specifically reading .txt, .md, .csv text content via FileReader';
    case 'csv_file': return 'CSV spreadsheet file input with client-side tabular parsing';
    case 'select': return 'Native select dropdown menu with predefined options';
    case 'date': return 'Standard HTML5 date picker';
    case 'checkbox': return 'Toggle switch or checkbox for binary yes/no choices';
    case 'email': return 'Email input with RFC standard email address validation';
    case 'url': return 'Web URL input starting with http:// or https://';
    default: return 'Standard user input';
  }
}

function formatValidationDescription(val: string, rule?: string): string {
  switch (val) {
    case 'required': return 'Required (Cannot be left empty or whitespace-only)';
    case 'positive_number': return 'Must be a valid positive number strictly greater than 0';
    case 'number_range': return `Numeric value must fall within the range: ${rule || 'specified minimum and maximum'}`;
    case 'file_extension': return `File upload must match valid extensions: ${rule || '.txt, .csv'}`;
    case 'email_format': return 'Must be a properly formatted email address (e.g. user@domain.com)';
    case 'url_format': return 'Must be a valid web URL beginning with http:// or https://';
    case 'min_length': return `Text length must have a minimum of ${rule || '10'} characters`;
    case 'none': return 'Optional field (No strict validation required)';
    default: return 'Standard input validation';
  }
}

function formatOutputType(format: string): string {
  switch (format) {
    case 'formatted_text': return 'Clean formatted text or markdown report';
    case 'data_table': return 'Structured HTML data table with column headers and striped rows';
    case 'downloadable_file': return 'Client-side generated downloadable file (.csv, .txt, .json, or .html)';
    case 'summary_cards': return 'KPI metric cards with large numbers and descriptive labels';
    case 'code_block': return 'Monospace code block with line numbering and 1-click copy';
    case 'chart_visual': return 'Clean CSS-rendered bar visualization or progress meters';
    case 'modal_alert': return 'Modal alert dialog with confirmation details';
    default: return 'Standard card output';
  }
}

function formatActionType(action: string): string {
  switch (action) {
    case 'on_screen_card': return 'Renders dynamically inside an on-screen card';
    case 'file_download_button': return 'Triggers an instant browser file download via Blob URL';
    case 'copy_clipboard_button': return 'Copies content directly to system clipboard via navigator.clipboard';
    case 'modal_dialog': return 'Opens in an accessible overlay modal popup window';
    case 'live_preview': return 'Updates in real-time as the user modifies inputs';
    default: return 'Display on screen';
  }
}

function formatLogicType(logic: string): string {
  switch (logic) {
    case 'filter_clean': return 'Filter and clean dataset records';
    case 'prompt_synthesis': return 'Assemble structured prompt for AI models with custom parameters';
    case 'text_transformation': return 'Clean, filter, and format raw text strings';
    case 'math_aggregation': return 'Compute statistical sums, averages, counts, and percentages';
    case 'template_merge': return 'Merge input variables into a standardized document template';
    case 'format_conversion': return 'Convert unstructured input into clean CSV, JSON, or HTML';
    case 'custom_rules': return 'Execute domain-specific validation and transformation logic';
    default: return 'Process and render result';
  }
}
