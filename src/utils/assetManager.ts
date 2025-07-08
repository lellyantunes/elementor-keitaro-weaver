
import { ElementorElement } from './types';

/**
 * Representa um ativo (imagem) que foi baixado.
 */
export interface Asset {
  url: string; // URL original
  blob: Blob; // Conteúdo do arquivo como Blob
  filename: string; // Nome do arquivo extraído da URL
}

/**
 * Extrai o nome do arquivo de uma URL.
 * @param url - A URL completa da imagem.
 * @returns O nome do arquivo (ex: 'imagem.png').
 */
const getFileName = (url: string): string => {
  try {
    // Tenta usar o construtor URL para uma análise robusta
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;
    return pathname.substring(pathname.lastIndexOf('/') + 1);
  } catch (e) {
    // Fallback para URLs que não são absolutas ou podem estar malformadas
    return url.substring(url.lastIndexOf('/') + 1);
  }
};

/**
 * Percorre recursivamente a árvore de elementos do Elementor para encontrar todas as URLs de imagens.
 * @param elements - Array de elementos do Elementor.
 * @returns Um array de URLs de imagem únicas.
 */
const findImageUrls = (elements: ElementorElement[]): string[] => {
  let urls: string[] = [];
  for (const element of elements) {
    // Imagens de widgets
    if (element.widgetType === 'image' && element.settings?.image?.url) {
      urls.push(element.settings.image.url);
    }
    // Imagens de fundo (background)
    if (element.settings?.background_image?.url) {
      urls.push(element.settings.background_image.url);
    }
    // Percorre os elementos filhos
    if (element.elements) {
      urls = urls.concat(findImageUrls(element.elements));
    }
  }
  return [...new Set(urls)]; // Garante que cada URL seja única
};

/**
 * Baixa todos os ativos de imagem encontrados no JSON do Elementor.
 * @param jsonData - O objeto JSON completo do Elementor.
 * @returns Um Map onde a chave é a URL original e o valor é o objeto Asset.
 */
export const fetchAssets = async (jsonData: any): Promise<Map<string, Asset>> => {
  let elements: ElementorElement[] = [];
  if (jsonData.content && Array.isArray(jsonData.content)) {
    elements = jsonData.content;
  } else if (Array.isArray(jsonData)) {
    elements = jsonData;
  } else if (jsonData.elements && Array.isArray(jsonData.elements)) {
    elements = jsonData.elements;
  }

  const imageUrls = findImageUrls(elements);
  const assetMap = new Map<string, Asset>();

  const fetchPromises = imageUrls.map(async (url) => {
    try {
      // NOTA: Se as imagens estiverem em um domínio diferente, pode ser necessário um proxy CORS.
      // Para este exemplo, assumimos acesso direto.
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Falha ao buscar ${url}: ${response.statusText}`);
      }
      const blob = await response.blob();
      const filename = getFileName(url);
      assetMap.set(url, { url, blob, filename });
    } catch (error) {
      console.error(`Não foi possível buscar o ativo ${url}:`, error);
      // Continua o processo mesmo que um ativo falhe
    }
  });

  await Promise.all(fetchPromises);
  return assetMap;
};
