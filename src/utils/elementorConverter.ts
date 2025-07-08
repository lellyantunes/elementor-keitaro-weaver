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

    const htmlParts: string[] = [];
    
    // Add HTML document structure
    htmlParts.push('<!DOCTYPE html>');
    htmlParts.push('<html lang="pt-BR">');
    htmlParts.push('<head>');
    htmlParts.push('  <meta charset="UTF-8">');
    htmlParts.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    htmlParts.push('  <title>KEITARO Landing Page</title>');
    htmlParts.push('  <style>');
    htmlParts.push(getKeitaroCSS());
    htmlParts.push('  </style>');
    htmlParts.push('</head>');
    htmlParts.push('<body>');
    
    // Convert elements
    content.forEach(element => {
      htmlParts.push(convertElement(element));
    });
    
    htmlParts.push('</body>');
    htmlParts.push('</html>');
    
    return htmlParts.join('\n');
  } catch (error) {
    console.error('Error converting Elementor to KEITARO:', error);
    return generateErrorHTML(error);
  }
};

const convertElement = (element: ElementorElement): string => {
  const { elType, settings = {}, elements = [] } = element;
  
  switch (elType) {
    case 'section':
      return convertSection(element);
    case 'column':
      return convertColumn(element);
    case 'widget':
      return convertWidget(element);
    case 'container':
      return convertContainer(element);
    default:
      console.log(`Unknown element type: ${elType}`);
      return convertContainer(element);
  }
};

const convertSection = (element: ElementorElement): string => {
  const { settings = {}, elements = [] } = element;
  const backgroundType = settings.background_background || 'classic';
  
  let sectionClasses = 'keitaro-section';
  let sectionStyles = '';
  
  // Background handling
  if (backgroundType === 'classic' && settings.background_color) {
    sectionStyles += `background-color: ${settings.background_color};`;
  }
  
  if (settings.background_image?.url) {
    sectionStyles += `background-image: url('${settings.background_image.url}');`;
    sectionStyles += 'background-size: cover; background-position: center;';
  }
  
  // Padding
  if (settings.padding) {
    const padding = settings.padding;
    sectionStyles += `padding: ${padding.top || 0}px ${padding.right || 0}px ${padding.bottom || 0}px ${padding.left || 0}px;`;
  }
  
  const childElements = elements.map(child => convertElement(child)).join('\n');
  
  return `
    <section class="${sectionClasses}" style="${sectionStyles}">
      <div class="keitaro-container">
        <div class="keitaro-row">
          ${childElements}
        </div>
      </div>
    </section>
  `;
};

const convertColumn = (element: ElementorElement): string => {
  const { settings = {}, elements = [] } = element;
  const width = settings._column_size || 100;
  
  let columnClasses = `keitaro-column keitaro-col-${width}`;
  let columnStyles = '';
  
  // Column specific styling
  if (settings.background_color) {
    columnStyles += `background-color: ${settings.background_color};`;
  }
  
  const childElements = elements.map(child => convertElement(child)).join('\n');
  
  return `
    <div class="${columnClasses}" style="${columnStyles}">
      ${childElements}
    </div>
  `;
};

const convertContainer = (element: ElementorElement): string => {
  const { elements = [] } = element;
  const childElements = elements.map(child => convertElement(child)).join('\n');
  
  return `
    <div class="keitaro-container">
      ${childElements}
    </div>
  `;
};

const convertWidget = (element: ElementorElement): string => {
  const { settings = {}, widgetType } = element;
  const widgetTypeToUse = widgetType || settings.widgetType || 'text';
  
  switch (widgetTypeToUse) {
    case 'heading':
      return convertHeading(settings);
    case 'text-editor':
    case 'text':
      return convertText(settings);
    case 'button':
      return convertButton(settings);
    case 'image':
      return convertImage(settings);
    case 'video':
      return convertVideo(settings);
    case 'spacer':
      return convertSpacer(settings);
    case 'divider':
      return convertDivider(settings);
    default:
      return convertGenericWidget(settings, widgetTypeToUse);
  }
};

const convertHeading = (settings: Record<string, any>): string => {
  const title = settings.title || settings.heading_title || 'Título';
  const tag = settings.header_size || settings.size || 'h2';
  const align = settings.align || 'left';
  const color = settings.title_color || '#000000';
  
  return `
    <${tag} class="keitaro-heading" style="text-align: ${align}; color: ${color};">
      ${title}
    </${tag}>
  `;
};

const convertText = (settings: Record<string, any>): string => {
  const text = settings.editor || settings.text || 'Texto';
  const align = settings.align || 'left';
  const color = settings.text_color || '#000000';
  
  return `
    <div class="keitaro-text" style="text-align: ${align}; color: ${color};">
      ${text}
    </div>
  `;
};

const convertButton = (settings: Record<string, any>): string => {
  const text = settings.text || settings.button_text || 'Clique Aqui';
  const link = settings.link?.url || settings.button_link || '#';
  const align = settings.align || 'left';
  const bgColor = settings.background_color || '#007cba';
  const textColor = settings.button_text_color || '#ffffff';
  
  return `
    <div class="keitaro-button-container" style="text-align: ${align};">
      <a href="${link}" class="keitaro-button" style="background-color: ${bgColor}; color: ${textColor};">
        ${text}
      </a>
    </div>
  `;
};

const convertImage = (settings: Record<string, any>): string => {
  const imageUrl = settings.image?.url || settings.src || '';
  const alt = settings.image?.alt || settings.alt || 'Imagem';
  const align = settings.align || 'center';
  
  if (!imageUrl) return '';
  
  return `
    <div class="keitaro-image" style="text-align: ${align};">
      <img src="${imageUrl}" alt="${alt}" style="max-width: 100%; height: auto;" />
    </div>
  `;
};

const convertVideo = (settings: Record<string, any>): string => {
  const videoUrl = settings.youtube_url || settings.video_url || '';
  const align = settings.align || 'center';
  
  if (!videoUrl) return '';
  
  return `
    <div class="keitaro-video" style="text-align: ${align};">
      <iframe width="100%" height="400" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
    </div>
  `;
};

const convertSpacer = (settings: Record<string, any>): string => {
  const height = settings.space?.size || settings.height || 50;
  
  return `
    <div class="keitaro-spacer" style="height: ${height}px;"></div>
  `;
};

const convertDivider = (settings: Record<string, any>): string => {
  const color = settings.color || '#000000';
  const weight = settings.weight?.size || 1;
  
  return `
    <hr class="keitaro-divider" style="border: none; border-top: ${weight}px solid ${color}; margin: 20px 0;" />
  `;
};

const convertGenericWidget = (settings: Record<string, any>, widgetType: string): string => {
  console.log(`Converting generic widget: ${widgetType}`, settings);
  
  return `
    <div class="keitaro-widget keitaro-widget-${widgetType}">
      <!-- ${widgetType} widget content -->
      ${JSON.stringify(settings, null, 2)}
    </div>
  `;
};

const getKeitaroCSS = (): string => {
  return `
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    
    .keitaro-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    
    .keitaro-row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -15px;
    }
    
    .keitaro-column {
      padding: 0 15px;
      flex: 1;
      min-height: 1px;
    }
    
    .keitaro-col-25 { flex: 0 0 25%; max-width: 25%; }
    .keitaro-col-33 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .keitaro-col-50 { flex: 0 0 50%; max-width: 50%; }
    .keitaro-col-66 { flex: 0 0 66.666667%; max-width: 66.666667%; }
    .keitaro-col-75 { flex: 0 0 75%; max-width: 75%; }
    .keitaro-col-100 { flex: 0 0 100%; max-width: 100%; }
    
    .keitaro-section {
      padding: 40px 0;
    }
    
    .keitaro-heading {
      margin: 0 0 20px 0;
      font-weight: bold;
    }
    
    .keitaro-text {
      margin: 0 0 20px 0;
    }
    
    .keitaro-button {
      display: inline-block;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .keitaro-button:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }
    
    .keitaro-button-container {
      margin: 20px 0;
    }
    
    .keitaro-image {
      margin: 20px 0;
    }
    
    .keitaro-video {
      margin: 20px 0;
    }
    
    .keitaro-spacer {
      width: 100%;
    }
    
    .keitaro-divider {
      margin: 20px 0;
    }
    
    .keitaro-widget {
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    
    @media (max-width: 768px) {
      .keitaro-column {
        flex: 0 0 100%;
        max-width: 100%;
      }
      
      .keitaro-row {
        flex-direction: column;
      }
    }
  `;
};

const generateErrorHTML = (error: any): string => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erro na Conversão</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .error-container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .error-title { color: #e74c3c; font-size: 24px; margin-bottom: 20px; }
        .error-message { color: #666; margin-bottom: 20px; }
        .error-details { background: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1 class="error-title">Erro na Conversão</h1>
        <p class="error-message">Ocorreu um erro ao converter o arquivo JSON do Elementor para HTML KEITARO.</p>
        <div class="error-details">
          <strong>Detalhes do erro:</strong><br>
          ${error.message || error.toString()}
        </div>
        <p style="margin-top: 20px; color: #666;">
          Verifique se o arquivo JSON é válido e contém dados do Elementor.
        </p>
      </div>
    </body>
    </html>
  `;
};
