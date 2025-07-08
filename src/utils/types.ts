
export interface ElementorElement {
  id: string;
  elType: string;
  settings: Record<string, any>;
  elements?: ElementorElement[];
  widgetType?: string;
}

export interface ElementorData {
  content: ElementorElement[];
  page_settings?: Record<string, any>;
  version?: string;
}
