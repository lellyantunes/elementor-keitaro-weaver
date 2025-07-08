
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
    
    // KEITARO specific HTML structure
    htmlParts.push('<!DOCTYPE html>');
    htmlParts.push('<html>');
    htmlParts.push('<head>');
    htmlParts.push('  <meta charset="UTF-8">');
    htmlParts.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
    htmlParts.push('  <title>{offer_name} - {campaign_name}</title>');
    htmlParts.push('  <meta name="description" content="{offer_description}">');
    htmlParts.push('  <meta name="robots" content="noindex, nofollow">');
    htmlParts.push('  <style>');
    htmlParts.push(getKeitaroOptimizedCSS());
    htmlParts.push('  </style>');
    
    // KEITARO tracking pixels and scripts
    htmlParts.push('  <!-- KEITARO Tracking -->');
    htmlParts.push('  <script>');
    htmlParts.push('    var _keitaro = _keitaro || [];');
    htmlParts.push('    _keitaro.push(["trackPageView"]);');
    htmlParts.push('  </script>');
    htmlParts.push('</head>');
    
    htmlParts.push('<body>');
    htmlParts.push('  <!-- KEITARO Landing Page -->');
    htmlParts.push('  <div class="keitaro-landing-wrapper">');
    
    // Convert elements with KEITARO structure
    content.forEach(element => {
      htmlParts.push(convertElement(element));
    });
    
    htmlParts.push('  </div>');
    
    // KEITARO conversion tracking
    htmlParts.push('  <!-- KEITARO Conversion Tracking -->');
    htmlParts.push('  <script>');
    htmlParts.push('    function keitaroConversion(action) {');
    htmlParts.push('      if (typeof _keitaro !== "undefined") {');
    htmlParts.push('        _keitaro.push(["trackEvent", action]);');
    htmlParts.push('      }');
    htmlParts.push('    }');
    htmlParts.push('  </script>');
    
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
      return convertKeitaroSection(element);
    case 'column':
      return convertKeitaroColumn(element);
    case 'widget':
      return convertKeitaroWidget(element);
    case 'container':
      return convertKeitaroContainer(element);
    default:
      console.log(`Unknown element type: ${elType}`);
      return convertKeitaroContainer(element);
  }
};

const convertKeitaroSection = (element: ElementorElement): string => {
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
    // KEITARO optimized background handling
    sectionStyles += `background-image: url('{offer_image_url}');`;
    sectionStyles += 'background-size: cover; background-position: center; background-repeat: no-repeat;';
  }
  
  // Responsive padding for KEITARO
  if (settings.padding) {
    const padding = settings.padding;
    sectionStyles += `padding: ${padding.top || 20}px ${padding.right || 15}px ${padding.bottom || 20}px ${padding.left || 15}px;`;
  } else {
    sectionStyles += 'padding: 20px 15px;';
  }
  
  const childElements = elements.map(child => convertElement(child)).join('\n');
  
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

const convertKeitaroColumn = (element: ElementorElement): string => {
  const { settings = {}, elements = [] } = element;
  const width = settings._column_size || 100;
  
  let columnClasses = `keitaro-column keitaro-col-${width}`;
  let columnStyles = '';
  
  // KEITARO column optimization
  columnStyles += 'min-height: 1px; position: relative;';
  
  if (settings.background_color) {
    columnStyles += `background-color: ${settings.background_color};`;
  }
  
  const childElements = elements.map(child => convertElement(child)).join('\n');
  
  return `
    <div class="${columnClasses}" style="${columnStyles}" data-keitaro-column="true">
      ${childElements}
    </div>
  `;
};

const convertKeitaroContainer = (element: ElementorElement): string => {
  const { elements = [] } = element;
  const childElements = elements.map(child => convertElement(child)).join('\n');
  
  return `
    <div class="keitaro-container" data-keitaro-container="true">
      ${childElements}
    </div>
  `;
};

const convertKeitaroWidget = (element: ElementorElement): string => {
  const { settings = {}, widgetType } = element;
  const widgetTypeToUse = widgetType || settings.widgetType || 'text';
  
  switch (widgetTypeToUse) {
    case 'heading':
      return convertKeitaroHeading(settings);
    case 'text-editor':
    case 'text':
      return convertKeitaroText(settings);
    case 'button':
      return convertKeitaroButton(settings);
    case 'image':
      return convertKeitaroImage(settings);
    case 'video':
      return convertKeitaroVideo(settings);
    case 'spacer':
      return convertKeitaroSpacer(settings);
    case 'divider':
      return convertKeitaroDivider(settings);
    default:
      return convertKeitaroGenericWidget(settings, widgetTypeToUse);
  }
};

const convertKeitaroHeading = (settings: Record<string, any>): string => {
  const title = settings.title || settings.heading_title || '{offer_name}';
  const tag = settings.header_size || settings.size || 'h2';
  const align = settings.align || 'center';
  const color = settings.title_color || '#000000';
  
  return `
    <${tag} class="keitaro-heading keitaro-headline" style="text-align: ${align}; color: ${color}; margin: 0 0 20px 0; font-weight: bold;" data-keitaro-element="heading">
      ${title}
    </${tag}>
  `;
};

const convertKeitaroText = (settings: Record<string, any>): string => {
  const text = settings.editor || settings.text || '{offer_description}';
  const align = settings.align || 'left';
  const color = settings.text_color || '#333333';
  
  return `
    <div class="keitaro-text keitaro-content" style="text-align: ${align}; color: ${color}; line-height: 1.6; margin: 0 0 20px 0;" data-keitaro-element="text">
      ${text}
    </div>
  `;
};

const convertKeitaroButton = (settings: Record<string, any>): string => {
  const text = settings.text || settings.button_text || 'COMPRAR AGORA';
  const link = settings.link?.url || settings.button_link || '{offer_url}';
  const align = settings.align || 'center';
  const bgColor = settings.background_color || '#ff6600';
  const textColor = settings.button_text_color || '#ffffff';
  
  return `
    <div class="keitaro-button-container" style="text-align: ${align}; margin: 30px 0;" data-keitaro-element="button">
      <a href="${link}" class="keitaro-button keitaro-cta" 
         style="display: inline-block; background-color: ${bgColor}; color: ${textColor}; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; text-transform: uppercase; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.3s ease;"
         onclick="keitaroConversion('button_click')"
         data-keitaro-action="click">
        ${text}
      </a>
    </div>
  `;
};

const convertKeitaroImage = (settings: Record<string, any>): string => {
  const imageUrl = settings.image?.url || settings.src || '{offer_image_url}';
  const alt = settings.image?.alt || settings.alt || '{offer_name}';
  const align = settings.align || 'center';
  
  if (!imageUrl) return '';
  
  return `
    <div class="keitaro-image" style="text-align: ${align}; margin: 20px 0;" data-keitaro-element="image">
      <img src="${imageUrl}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" loading="lazy" />
    </div>
  `;
};

const convertKeitaroVideo = (settings: Record<string, any>): string => {
  const videoUrl = settings.youtube_url || settings.video_url || '';
  const align = settings.align || 'center';
  
  if (!videoUrl) return '';
  
  // KEITARO video optimization
  const embedUrl = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') 
    ? videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
    : videoUrl;
  
  return `
    <div class="keitaro-video" style="text-align: ${align}; margin: 30px 0;" data-keitaro-element="video">
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <iframe src="${embedUrl}" 
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                allowfullscreen
                loading="lazy"></iframe>
      </div>
    </div>
  `;
};

const convertKeitaroSpacer = (settings: Record<string, any>): string => {
  const height = settings.space?.size || settings.height || 30;
  
  return `
    <div class="keitaro-spacer" style="height: ${height}px; width: 100%;" data-keitaro-element="spacer"></div>
  `;
};

const convertKeitaroDivider = (settings: Record<string, any>): string => {
  const color = settings.color || '#e0e0e0';
  const weight = settings.weight?.size || 1;
  
  return `
    <hr class="keitaro-divider" style="border: none; border-top: ${weight}px solid ${color}; margin: 30px 0; opacity: 0.6;" data-keitaro-element="divider" />
  `;
};

const convertKeitaroGenericWidget = (settings: Record<string, any>, widgetType: string): string => {
  console.log(`Converting generic widget: ${widgetType}`, settings);
  
  return `
    <div class="keitaro-widget keitaro-widget-${widgetType}" data-keitaro-element="widget" data-widget-type="${widgetType}">
      <!-- ${widgetType} widget placeholder -->
      <div style="padding: 20px; background: #f5f5f5; border-radius: 8px; text-align: center; color: #666;">
        Widget: ${widgetType}
      </div>
    </div>
  `;
};

const getKeitaroOptimizedCSS = (): string => {
  return `
    /* KEITARO Optimized CSS */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .keitaro-landing-wrapper {
      min-height: 100vh;
      width: 100%;
    }
    
    .keitaro-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
      width: 100%;
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
      width: 100%;
    }
    
    /* KEITARO Responsive Grid */
    .keitaro-col-25 { flex: 0 0 25%; max-width: 25%; }
    .keitaro-col-33 { flex: 0 0 33.333333%; max-width: 33.333333%; }
    .keitaro-col-50 { flex: 0 0 50%; max-width: 50%; }
    .keitaro-col-66 { flex: 0 0 66.666667%; max-width: 66.666667%; }
    .keitaro-col-75 { flex: 0 0 75%; max-width: 75%; }
    .keitaro-col-100 { flex: 0 0 100%; max-width: 100%; }
    
    .keitaro-section {
      width: 100%;
      position: relative;
    }
    
    /* KEITARO Typography */
    .keitaro-heading {
      font-weight: bold;
      margin-bottom: 20px;
      line-height: 1.2;
    }
    
    .keitaro-headline {
      color: #2c3e50;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    
    .keitaro-text {
      margin-bottom: 20px;
      font-size: 16px;
    }
    
    .keitaro-content {
      line-height: 1.8;
    }
    
    /* KEITARO CTA Button */
    .keitaro-button {
      display: inline-block;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      text-transform: uppercase;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .keitaro-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }
    
    .keitaro-cta {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    .keitaro-button-container {
      margin: 30px 0;
    }
    
    /* KEITARO Media */
    .keitaro-image {
      margin: 20px 0;
    }
    
    .keitaro-image img {
      display: block;
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
    
    .keitaro-video {
      margin: 30px 0;
    }
    
    .keitaro-spacer {
      width: 100%;
      display: block;
    }
    
    .keitaro-divider {
      margin: 30px 0;
      border: none;
      opacity: 0.6;
    }
    
    .keitaro-widget {
      margin: 20px 0;
    }
    
    /* KEITARO Mobile Optimization */
    @media (max-width: 768px) {
      .keitaro-container {
        padding: 0 10px;
      }
      
      .keitaro-column {
        flex: 0 0 100%;
        max-width: 100%;
        margin-bottom: 20px;
      }
      
      .keitaro-row {
        flex-direction: column;
      }
      
      .keitaro-heading {
        font-size: 24px;
      }
      
      .keitaro-button {
        width: 100%;
        padding: 20px;
        font-size: 18px;
      }
      
      .keitaro-section {
        padding: 15px 0 !important;
      }
    }
    
    @media (max-width: 480px) {
      .keitaro-heading {
        font-size: 20px;
      }
      
      .keitaro-text {
        font-size: 14px;
      }
      
      .keitaro-button {
        font-size: 16px;
        padding: 15px;
      }
    }
    
    /* KEITARO Performance Optimizations */
    img {
      max-width: 100%;
      height: auto;
    }
    
    iframe {
      max-width: 100%;
    }
    
    /* KEITARO Accessibility */
    .keitaro-button:focus {
      outline: 2px solid #007cba;
      outline-offset: 2px;
    }
    
    /* KEITARO Loading States */
    .keitaro-loading {
      opacity: 0.7;
      pointer-events: none;
    }
  `;
};

const generateErrorHTML = (error: any): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erro na Conversão KEITARO</title>
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
        <h1 class="error-title">Erro na Conversão KEITARO</h1>
        <p class="error-message">Ocorreu um erro ao converter o arquivo JSON do Elementor para HTML KEITARO.</p>
        <div class="error-details">
          <strong>Detalhes do erro:</strong><br>
          ${error.message || error.toString()}
        </div>
        <p style="margin-top: 20px; color: #666;">
          Verifique se o arquivo JSON é válido e contém dados do Elementor compatíveis com KEITARO.
        </p>
      </div>
    </body>
    </html>
  `;
};
