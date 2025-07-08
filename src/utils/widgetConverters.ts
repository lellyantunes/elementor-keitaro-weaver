
export const convertKeitaroWidget = (element: any): string => {
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

export const convertKeitaroHeading = (settings: Record<string, any>): string => {
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

export const convertKeitaroText = (settings: Record<string, any>): string => {
  const text = settings.editor || settings.text || '{offer_description}';
  const align = settings.align || 'left';
  const color = settings.text_color || '#333333';
  
  return `
    <div class="keitaro-text keitaro-content" style="text-align: ${align}; color: ${color}; line-height: 1.6; margin: 0 0 20px 0;" data-keitaro-element="text">
      ${text}
    </div>
  `;
};

export const convertKeitaroButton = (settings: Record<string, any>): string => {
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

export const convertKeitaroImage = (settings: Record<string, any>): string => {
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

export const convertKeitaroVideo = (settings: Record<string, any>): string => {
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

export const convertKeitaroSpacer = (settings: Record<string, any>): string => {
  const height = settings.space?.size || settings.height || 30;
  
  return `
    <div class="keitaro-spacer" style="height: ${height}px; width: 100%;" data-keitaro-element="spacer"></div>
  `;
};

export const convertKeitaroDivider = (settings: Record<string, any>): string => {
  const color = settings.color || '#e0e0e0';
  const weight = settings.weight?.size || 1;
  
  return `
    <hr class="keitaro-divider" style="border: none; border-top: ${weight}px solid ${color}; margin: 30px 0; opacity: 0.6;" data-keitaro-element="divider" />
  `;
};

export const convertKeitaroGenericWidget = (settings: Record<string, any>, widgetType: string): string => {
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
