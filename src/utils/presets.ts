import { ToolConfig } from '../types';

export const STARTER_PRESETS: { id: string; label: string; description: string; config: ToolConfig }[] = [
  {
    id: 'workshop_prompt_generator',
    label: 'Session Prompt Generator Tool',
    description: 'The primary workshop tool to help participants craft structured requirements and prompts for HTML tools.',
    config: {
      toolTitle: 'Interactive HTML Tool Prompt Generator',
      goalDescription: 'Help session participants define their functional requirements, inputs with strict validations, and desired outputs to generate production-ready HTML single-file tools.',
      participantAudience: 'Workshop Attendees, Product Managers, and Solution Architects',
      sessionContext: 'Interactive Hands-On Rapid Prototyping Workshop',
      primaryTheme: 'clean_light',
      includeComments: true,
      standaloneOffline: true,
      inputs: [
        {
          id: 'inp-1',
          name: 'Session Participant Name',
          type: 'text',
          placeholder: 'e.g. Alex Morgan (Technical Lead)',
          validation: 'required',
          validationRule: '',
          defaultValue: 'Jordan Davis'
        },
        {
          id: 'inp-2',
          name: 'Tool Objective & Target Outcome',
          type: 'textarea',
          placeholder: 'Explain the core business problem this tool solves and who will use it...',
          validation: 'min_length',
          validationRule: '15',
          defaultValue: 'Generate clean monthly sales reports from exported CSV transaction logs.'
        },
        {
          id: 'inp-3',
          name: 'Input Data Specification File',
          type: 'text_file',
          placeholder: 'Upload raw data or prompt requirement file (.txt, .csv, .json)',
          validation: 'file_extension',
          validationRule: '.txt, .csv, .json, .md',
          defaultValue: ''
        },
        {
          id: 'inp-4',
          name: 'Target Processing Complexity Level',
          type: 'select',
          placeholder: 'Select processing model depth',
          validation: 'required',
          options: ['Standard Client-Side Rule Engine', 'Regex & Formatting Pipeline', 'AI Prompt Synthesis & Formatter'],
          defaultValue: 'Standard Client-Side Rule Engine'
        }
      ],
      outputs: [
        {
          id: 'out-1',
          name: 'Consolidated AI Master Prompt',
          format: 'code_block',
          action: 'copy_clipboard_button',
          logic: 'prompt_synthesis',
          logicDetails: 'Assemble inputs into an authoritative, unambiguous system prompt suitable for Gemini or Claude with clear validation boundaries.',
          fileExtension: '.txt'
        },
        {
          id: 'out-2',
          name: 'Structured Technical Specification Table',
          format: 'data_table',
          action: 'on_screen_card',
          logic: 'text_transformation',
          logicDetails: 'Render a high-density tabular breakdown of all input parameters, data types, validation constraints, and output routing.',
          fileExtension: ''
        },
        {
          id: 'out-3',
          name: 'Exportable Requirement Document',
          format: 'downloadable_file',
          action: 'file_download_button',
          logic: 'template_merge',
          logicDetails: 'Download the finalized prompt and architectural contract as a standalone Markdown file.',
          fileExtension: '.md'
        }
      ]
    }
  },
  {
    id: 'csv_data_cleaner',
    label: 'CSV Data Cleaner & Filter Tool',
    description: 'Upload a CSV, clean null entries, apply threshold filters, and export a scrubbed dataset.',
    config: {
      toolTitle: 'CSV Data Cleaner & Transformer',
      goalDescription: 'Validate customer transaction files, strip invalid records, compute total revenue sums, and produce clean CSV exports.',
      participantAudience: 'Data Analysts and Business Operations Teams',
      sessionContext: 'Automating Repetitive Data Hygiene Tasks',
      primaryTheme: 'professional',
      includeComments: true,
      standaloneOffline: true,
      inputs: [
        {
          id: 'inp-1',
          name: 'Raw CSV Dataset File',
          type: 'csv_file',
          placeholder: 'Upload transaction log or customer dataset (.csv)',
          validation: 'file_extension',
          validationRule: '.csv',
          defaultValue: ''
        },
        {
          id: 'inp-2',
          name: 'Minimum Transaction Value Filter',
          type: 'number',
          placeholder: 'Enter numeric threshold value (e.g. 100.00)',
          validation: 'positive_number',
          validationRule: '',
          defaultValue: '50'
        },
        {
          id: 'inp-3',
          name: 'Date Range Cutoff',
          type: 'date',
          placeholder: 'Filter entries on or after this date',
          validation: 'required',
          validationRule: '',
          defaultValue: '2026-01-01'
        }
      ],
      outputs: [
        {
          id: 'out-1',
          name: 'Cleaned Transaction Summary Grid',
          format: 'data_table',
          action: 'on_screen_card',
          logic: 'filter_clean',
          logicDetails: 'Display valid rows matching filter criteria with null values stripped.',
          fileExtension: ''
        },
        {
          id: 'out-2',
          name: 'Key Financial Metrics & KPIs',
          format: 'summary_cards',
          action: 'on_screen_card',
          logic: 'math_aggregation',
          logicDetails: 'Calculate total revenue sum, average transaction amount, and total valid record count.',
          fileExtension: ''
        },
        {
          id: 'out-3',
          name: 'Cleaned Dataset File',
          format: 'downloadable_file',
          action: 'file_download_button',
          logic: 'format_conversion',
          logicDetails: 'Generate sanitized CSV file ready for immediate spreadsheet ingestion.',
          fileExtension: '.csv'
        }
      ]
    }
  },
  {
    id: 'meeting_minutes_to_actions',
    label: 'Meeting Notes to Action Plan',
    description: 'Transform messy session transcripts into structured action items with assignees and deadlines.',
    config: {
      toolTitle: 'Executive Meeting Action Item Synthesizer',
      goalDescription: 'Extract decisions, action items, assignees, and deadlines from meeting notes into a prioritized Kanban checklist.',
      participantAudience: 'Project Managers & Sprint Coordinators',
      sessionContext: 'Weekly Team Alignment Workshop',
      primaryTheme: 'clean_light',
      includeComments: true,
      standaloneOffline: true,
      inputs: [
        {
          id: 'inp-1',
          name: 'Meeting Topic / Sprint Name',
          type: 'text',
          placeholder: 'e.g. Q4 Platform Architecture Review',
          validation: 'required',
          validationRule: '',
          defaultValue: 'Q4 Product Roadmap Sync'
        },
        {
          id: 'inp-2',
          name: 'Raw Meeting Notes / Transcript',
          type: 'textarea',
          placeholder: 'Paste notes, transcript excerpt, or key points discussed...',
          validation: 'min_length',
          validationRule: '20',
          defaultValue: 'Discussed database migration timeline. Sarah will finalize the schema by Friday. Tom needs to run security audits before Nov 10th. Team approved zero-downtime deployment strategy.'
        },
        {
          id: 'inp-3',
          name: 'Notification Email',
          type: 'email',
          placeholder: 'lead@company.org for dispatching',
          validation: 'email_format',
          validationRule: '',
          defaultValue: 'team-lead@enterprise.org'
        }
      ],
      outputs: [
        {
          id: 'out-1',
          name: 'Prioritized Action Item Matrix',
          format: 'data_table',
          action: 'on_screen_card',
          logic: 'text_transformation',
          logicDetails: 'Parse bullet points into structured columns: Task, Owner, Due Date, and Status.',
          fileExtension: ''
        },
        {
          id: 'out-2',
          name: 'Executive Briefing Markdown File',
          format: 'downloadable_file',
          action: 'file_download_button',
          logic: 'template_merge',
          logicDetails: 'Generate formatted markdown briefing document.',
          fileExtension: '.md'
        }
      ]
    }
  }
];

export const VALIDATION_OPTIONS: { value: string; label: string; placeholderArg?: string }[] = [
  { value: 'required', label: 'Required (Cannot be empty)' },
  { value: 'positive_number', label: 'Positive Number Only (> 0)' },
  { value: 'number_range', label: 'Number Range (Min to Max)', placeholderArg: 'e.g. 1 - 100' },
  { value: 'file_extension', label: 'File Extension Match', placeholderArg: 'e.g. .csv, .txt, .pdf' },
  { value: 'email_format', label: 'Valid Email Address' },
  { value: 'url_format', label: 'Valid Web URL (https://...)' },
  { value: 'min_length', label: 'Minimum Character Length', placeholderArg: 'e.g. 10' },
  { value: 'none', label: 'None (Optional Input)' }
];

export const INPUT_TYPE_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: 'text', label: 'Single-line Text', icon: 'Type' },
  { value: 'textarea', label: 'Multi-line Textarea', icon: 'AlignLeft' },
  { value: 'number', label: 'Numeric Value', icon: 'Hash' },
  { value: 'file_upload', label: 'File Upload (Any File)', icon: 'UploadCloud' },
  { value: 'text_file', label: 'Text File (.txt / .md / .json)', icon: 'FileText' },
  { value: 'csv_file', label: 'CSV Spreadsheet File (.csv)', icon: 'FileSpreadsheet' },
  { value: 'select', label: 'Dropdown Select Menu', icon: 'ChevronDown' },
  { value: 'date', label: 'Date / Calendar Picker', icon: 'Calendar' },
  { value: 'checkbox', label: 'Checkbox / Toggle Switch', icon: 'CheckSquare' },
  { value: 'email', label: 'Email Address', icon: 'Mail' },
  { value: 'url', label: 'Web URL Link', icon: 'Globe' }
];

export const OUTPUT_FORMAT_OPTIONS: { value: string; label: string }[] = [
  { value: 'formatted_text', label: 'Formatted Text / Markdown Report' },
  { value: 'data_table', label: 'Interactive Data Table' },
  { value: 'downloadable_file', label: 'Downloadable File (.csv / .txt / .json / .html)' },
  { value: 'summary_cards', label: 'Metric Cards & KPI Statistics' },
  { value: 'code_block', label: 'Copyable Code Block / Raw Prompt' },
  { value: 'chart_visual', label: 'Visual Progress / Bar Metric' },
  { value: 'modal_alert', label: 'Modal Confirmation Dialog' }
];

export const OUTPUT_ACTION_OPTIONS: { value: string; label: string }[] = [
  { value: 'on_screen_card', label: 'Render On-Screen Card' },
  { value: 'file_download_button', label: 'Instant File Download' },
  { value: 'copy_clipboard_button', label: 'Copy to Clipboard' },
  { value: 'modal_dialog', label: 'Display Modal Popup' },
  { value: 'live_preview', label: 'Live Updating Output Card' }
];

export const PROCESSING_LOGIC_OPTIONS: { value: string; label: string }[] = [
  { value: 'prompt_synthesis', label: 'Prompt Synthesis / AI Prompt Assembler' },
  { value: 'text_transformation', label: 'Text Cleaning & Formatting Pipeline' },
  { value: 'math_aggregation', label: 'Mathematical Aggregations (Sum, Avg, Min, Max)' },
  { value: 'template_merge', label: 'Template Variable Substitution' },
  { value: 'format_conversion', label: 'Format Conversion (e.g. CSV to JSON/HTML)' },
  { value: 'custom_rules', label: 'Custom Conditional Logic Rules' }
];
