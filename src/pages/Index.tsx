
import { useState } from 'react';
import { Upload, Download, Code, FileJson, FileZip, LoaderCircle } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import JsonPreview from '../components/JsonPreview';
import HtmlOutput from '../components/HtmlOutput';
import { convertElementorToKeitaro, ConversionResult } from '../utils/elementorConverter';
import JSZip from 'jszip';

const Index = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);

  const handleFileUpload = async (data: any, name: string) => {
    setIsConverting(true);
    setJsonData(data);
    setFileName(name);
    setConversionResult(null); // Limpa resultado anterior
    
    try {
      const result = await convertElementorToKeitaro(data);
      setConversionResult(result);
    } catch (error) {
      console.error('Erro na conversão:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!conversionResult) return;

    const zip = new JSZip();
    
    // Adiciona o arquivo HTML principal
    zip.file('index.html', conversionResult.html);
    
    // Adiciona o arquivo CSS
    zip.file('style.css', conversionResult.css);

    // Adiciona todas as imagens na pasta img/
    const imgFolder = zip.folder('img');
    if (imgFolder) {
      for (const asset of conversionResult.assets.values()) {
        imgFolder.file(asset.filename, asset.blob);
      }
    }

    // Gera e baixa o arquivo ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.json', '') + '_keitaro.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    if (!conversionResult) return;
    
    const blob = new Blob([conversionResult.html], { type: 'text/html' });
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
                Elementor → KEITARO Weaver
              </h1>
              <p className="text-blue-200">
                Gere pacotes ZIP completos para KEITARO a partir do seu JSON do Elementor
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

        {/* Loading State */}
        {isConverting && (
          <div className="text-center p-8 flex flex-col items-center justify-center">
            <LoaderCircle className="h-12 w-12 animate-spin text-blue-400 mb-4" />
            <p className="text-lg text-white">Convertendo e baixando recursos... Por favor, aguarde.</p>
            <p className="text-sm text-gray-300 mt-2">Isso pode levar alguns segundos dependendo do número de imagens.</p>
          </div>
        )}

        {/* Results */}
        {conversionResult && !isConverting && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* JSON Preview */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileJson className="h-5 w-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">JSON Original</h2>
              </div>
              <JsonPreview data={jsonData} />
              
              {/* Assets Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4">
                <h3 className="text-sm font-medium text-white mb-2">Recursos Baixados</h3>
                <p className="text-xs text-gray-300">
                  {conversionResult.assets.size} imagem(ns) encontrada(s) e baixada(s)
                </p>
              </div>
            </div>

            {/* HTML Output */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">HTML KEITARO</h2>
                </div>
                <div className="flex items-center space-x-2">
                  {conversionResult && (
                    <>
                      <button
                        onClick={handleDownloadHTML}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>HTML</span>
                      </button>
                      <button
                        onClick={handleDownloadZip}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
                      >
                        <FileZip className="h-4 w-4" />
                        <span>Download .zip</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
              <HtmlOutput htmlContent={conversionResult.html} />
            </div>
          </div>
        )}

        {/* Features Section */}
        {!jsonData && !isConverting && (
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
              <h3 className="text-lg font-semibold text-white mb-2">Conversão Completa</h3>
              <p className="text-gray-300">
                Converte automaticamente o JSON do Elementor, baixa todas as imagens e gera CSS otimizado para KEITARO.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileZip className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Pacote Completo</h3>
              <p className="text-gray-300">
                Baixe um arquivo .zip com HTML, CSS e todas as imagens prontos para usar em suas campanhas KEITARO.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
