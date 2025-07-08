
import { getKeitaroOptimizedCSS } from './keitaroStyles';

export const generateErrorHTML = (error: any): string => {
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

export const generateKeitaroHTML = (contentHtml: string): string => {
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
  
  htmlParts.push(contentHtml);
  
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
};
