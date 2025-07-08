
import { ElementorElement } from './types';
import { Asset } from './assetManager';
import { convertKeitaroWidget } from './widgetConverters';

const getAssetPath = (url: string, assets: Map<string, Asset>, subfolder: string = 'img/'): string => {
  const asset = assets.get(url);
  return asset ? `${subfolder}${asset.filename}` : url;
};

export const convertKeitaroSection = (element: ElementorElement, assets: Map<string, Asset>): string => {
  const { settings = {}, elements = [] } = element;
  const backgroundType = settings.background_background || 'classic';
  
  let sectionClasses = 'keitaro-section';
  let sectionStyles = '';
  let sectionAttrs = '';
  
  // KEITARO specific attributes
  sectionAttrs += ' data-keitaro-section="true"';
  
  // Background handling optimized for KEITARO
  if (backgroundType === 'classic' && settings.background_color) {
    sectionStyles += `background-color: ${settings.background_color};`;
  }
  
  if (settings.background_image?.url) {
    // KEITARO optimized background handling with local images
    const imagePath = getAssetPath(settings.background_image.url, assets);
    sectionStyles += `background-image: url('${imagePath}');`;
    sectionStyles += 'background-size: cover; background-position: center; background-repeat: no-repeat;';
  }
  
  // Responsive padding for KEITARO
  if (settings.padding) {
    const padding = settings.padding;
    sectionStyles += `padding: ${padding.top || 20}px ${padding.right || 15}px ${padding.bottom || 20}px ${padding.left || 15}px;`;
  } else {
    sectionStyles += 'padding: 20px 15px;';
  }
  
  const childElements = elements.map(child => convertElement(child, assets)).join('\n');
  
  return `
    <section class="${sectionClasses}" style="${sectionStyles}"${sectionAttrs}>
      <div class="keitaro-container">
        <div class="keitaro-row">
          ${childElements}
        </div>
      </div>
    </section>
  `;
};

export const convertKeitaroColumn = (element: ElementorElement, assets: Map<string, Asset>): string => {
  const { settings = {}, elements = [] } = element;
  const width = settings._column_size || 100;
  
  let columnClasses = `keitaro-column keitaro-col-${width}`;
  let columnStyles = '';
  
  // KEITARO column optimization
  columnStyles += 'min-height: 1px; position: relative;';
  
  if (settings.background_color) {
    columnStyles += `background-color: ${settings.background_color};`;
  }
  
  const childElements = elements.map(child => convertElement(child, assets)).join('\n');
  
  return `
    <div class="${columnClasses}" style="${columnStyles}" data-keitaro-column="true">
      ${childElements}
    </div>
  `;
};

export const convertKeitaroContainer = (element: ElementorElement, assets: Map<string, Asset>): string => {
  const { elements = [] } = element;
  const childElements = elements.map(child => convertElement(child, assets)).join('\n');
  
  return `
    <div class="keitaro-container" data-keitaro-container="true">
      ${childElements}
    </div>
  `;
};

export const convertElement = (element: ElementorElement, assets: Map<string, Asset>): string => {
  const { elType } = element;
  
  switch (elType) {
    case 'section':
      return convertKeitaroSection(element, assets);
    case 'column':
      return convertKeitaroColumn(element, assets);
    case 'widget':
      return convertKeitaroWidget(element, assets);
    case 'container':
      return convertKeitaroContainer(element, assets);
    default:
      console.log(`Unknown element type: ${elType}`);
      return convertKeitaroContainer(element, assets);
  }
};
