
import { ElementorElement, ElementorData } from './types';
import { convertElement } from './elementConverters';
import { generateErrorHTML, generateKeitaroHTML } from './htmlGenerator';

export const convertElementorToKeitaro = (jsonData: any): string => {
  console.log('Converting Elementor JSON to KEITARO HTML:', jsonData);
  
  try {
    let content: ElementorElement[] = [];
    
    // Handle different JSON structures
    if (jsonData.content && Array.isArray(jsonData.content)) {
      content = jsonData.content;
    } else if (Array.isArray(jsonData)) {
      content = jsonData;
    } else if (jsonData.elements && Array.isArray(jsonData.elements)) {
      content = jsonData.elements;
    }

    // Convert elements with KEITARO structure
    const contentHtml = content.map(element => convertElement(element)).join('\n');
    
    return generateKeitaroHTML(contentHtml);
  } catch (error) {
    console.error('Error converting Elementor to KEITARO:', error);
    return generateErrorHTML(error);
  }
};

// Re-export types for backward compatibility
export type { ElementorElement, ElementorData } from './types';
