export type InputFieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'file_upload'
  | 'text_file'
  | 'csv_file'
  | 'select'
  | 'date'
  | 'checkbox'
  | 'email'
  | 'url';

export type ValidationType =
  | 'required'
  | 'positive_number'
  | 'number_range'
  | 'file_extension'
  | 'email_format'
  | 'url_format'
  | 'min_length'
  | 'none';

export interface ToolInput {
  id: string;
  name: string; // Section 1: Name of the input
  type: InputFieldType; // Section 2: Input type / File type
  placeholder: string; // Section 3: Placeholder / Description / Label
  validation: ValidationType; // Section 4: Validation required (from dropdown)
  validationRule?: string; // Optional custom parameter (e.g. '.csv, .txt' or '1-100' or '8')
  options?: string[]; // For dropdown type options
  defaultValue?: string;
}

export type OutputFormatType =
  | 'formatted_text'
  | 'data_table'
  | 'downloadable_file'
  | 'summary_cards'
  | 'code_block'
  | 'chart_visual'
  | 'modal_alert';

export type OutputActionType =
  | 'on_screen_card'
  | 'file_download_button'
  | 'copy_clipboard_button'
  | 'modal_dialog'
  | 'live_preview';

export type ProcessingLogicType =
  | 'text_transformation'
  | 'filter_clean'
  | 'math_aggregation'
  | 'prompt_synthesis'
  | 'template_merge'
  | 'format_conversion'
  | 'custom_rules';

export interface ToolOutput {
  id: string;
  name: string; // Section 1: Output Name / Title
  format: OutputFormatType; // Section 2: Format / Display Type
  action: OutputActionType; // Section 3: Action / Destination Trigger
  logic: ProcessingLogicType; // Section 4: Processing / Transformation Logic
  logicDetails?: string; // Additional transformation description or formula
  fileExtension?: string; // e.g. '.csv', '.txt', '.json', '.html'
}

export interface ToolConfig {
  toolTitle: string;
  goalDescription: string;
  participantAudience: string;
  sessionContext: string;
  inputs: ToolInput[];
  outputs: ToolOutput[];
  primaryTheme: 'professional' | 'dark' | 'clean_light';
  includeComments: boolean;
  standaloneOffline: boolean;
}
