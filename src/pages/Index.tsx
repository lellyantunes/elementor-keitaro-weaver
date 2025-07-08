
import { useState } from 'react';
import { Upload, Download, Code, FileJson } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import JsonPreview from '../components/JsonPreview';
import HtmlOutput from '../components/HtmlOutput';
import { convertElementorToKeitaro } from '../utils/elementorConverter';

const Index = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (data: any, name: string) => {
    setJsonData(data);
    setFileName(name);
    const convertedHtml = convertElementorToKeitaro(data);
    setHtmlOutput(convertedHtml);
  };

  const handleDownload = () => {
    if (!htmlOutput) return;
    
    const blob = new Blob([htmlOutput], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.json', '') + '_keitaro.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Code className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Elementor → KEITARO
              </h1>
              <p className="text-blue-200">
                Conversor de JSON do Elementor para HTML KEITARO
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>

        {jsonData && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* JSON Preview */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileJson className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">JSON Original</h2>
              </div>
              <JsonPreview data={jsonData} />
            </div>

            {/* HTML Output */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">HTML KEITARO</h2>
                </div>
                {htmlOutput && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download HTML</span>
                  </button>
                )}
              </div>
              <HtmlOutput htmlContent={htmlOutput} />
            </div>
          </div>
        )}

        {/* Features Section */}
        {!jsonData && (
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload Fácil</h3>
              <p className="text-gray-300">
                Faça upload do seu arquivo JSON exportado do Elementor de forma simples e rápida.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Conversão Automática</h3>
              <p className="text-gray-300">
                Converte automaticamente o JSON do Elementor para HTML otimizado para KEITARO.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Download Direto</h3>
              <p className="text-gray-300">
                Baixe o arquivo HTML convertido pronto para usar em suas campanhas KEITARO.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
