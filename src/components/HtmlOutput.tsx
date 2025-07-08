
import { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface HtmlOutputProps {
  htmlContent: string;
}

const HtmlOutput = ({ htmlContent }: HtmlOutputProps) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">HTML Convertido</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePreview}
            className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-gray-700"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showPreview ? 'Código' : 'Preview'}</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-gray-700"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {showPreview ? (
          <div className="p-4">
            <iframe
              srcDoc={htmlContent}
              className="w-full h-80 border border-gray-600 rounded-md bg-white"
              title="HTML Preview"
            />
          </div>
        ) : (
          <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto">
            <code className="language-html">
              {htmlContent}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
};

export default HtmlOutput;
