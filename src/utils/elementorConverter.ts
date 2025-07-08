
import { ElementorElement } from './types';
import { convertElement } from './elementConverters';
import { generateKeitaroHTML, generateErrorHTML } from './htmlGenerator';
import { fetchAssets, Asset } from './assetManager';
import { getKeitaroOptimizedCSS } from './keitaroStyles';

export interface ConversionResult {
  html: string;
  assets: Map<string, Asset>;
  css: string;
}

export const convertElementorToKeitaro = async (jsonData: any): Promise<ConversionResult> => {
  console.log('Iniciando processo de conversão para Keitaro...');
  
  try {
    // Primeiro, busca todos os assets de imagem
    const assets = await fetchAssets(jsonData);
    console.log(`Ativos buscados: ${assets.size}`);

    let content: ElementorElement[] = [];
    
    // Handle different JSON structures
    if (jsonData.content && Array.isArray(jsonData.content)) {
      content = jsonData.content;
    } else if (Array.isArray(jsonData)) {
      content = jsonData;
    } else if (jsonData.elements && Array.isArray(jsonData.elements)) {
      content = jsonData.elements;
    }

    // Convert elements with KEITARO structure and asset references
    const contentHtml = content.map(element => convertElement(element, assets)).join('\n');
    
    // Get the CSS content
    const css = getKeitaroOptimizedCSS();
    
    // Generate the final HTML with external CSS reference
    const finalHtml = generateKeitaroHTML(contentHtml);

    return { html: finalHtml, assets, css };
  } catch (error) {
    console.error('Erro ao converter para Keitaro:', error);
    return {
      html: generateErrorHTML(error),
      assets: new Map(),
      css: '',
    };
  }
};

// Re-export types for backward compatibility
export type { ElementorElement, ElementorData } from './types';
