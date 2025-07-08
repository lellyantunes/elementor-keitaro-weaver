
export const getKeitaroOptimizedCSS = (): string => {
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
