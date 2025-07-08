
import { useState, useRef } from 'react';
import { Upload, FileJson, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (data: any, fileName: string) => void;
  disabled?: boolean;
}

const FileUpload = ({ onFileUpload, disabled = false }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError('');
    setIsLoading(true);

    if (!file.name.endsWith('.json')) {
      setError('Por favor, selecione um arquivo JSON válido.');
      setIsLoading(false);
      return;
    }

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      onFileUpload(jsonData, file.name);
    } catch (err) {
      setError('Erro ao ler o arquivo JSON. Verifique se o formato está correto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${disabled 
            ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-50' 
            : isDragOver 
              ? 'border-blue-400 bg-blue-500/20 cursor-pointer' 
              : 'border-gray-600 bg-white/5 hover:bg-white/10 hover:border-gray-500 cursor-pointer'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
            ${disabled 
              ? 'bg-gray-700/50' 
              : isDragOver 
                ? 'bg-blue-500/30' 
                : 'bg-gray-700/50'
            }
          `}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            ) : (
              <Upload className={`h-8 w-8 ${disabled ? 'text-gray-600' : isDragOver ? 'text-blue-400' : 'text-gray-400'}`} />
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isLoading ? 'Processando arquivo...' : disabled ? 'Upload desabilitado durante conversão' : 'Upload do JSON do Elementor'}
            </h3>
            <p className="text-gray-300 mb-4">
              {disabled ? 'Aguarde a conclusão da conversão atual' : 'Arraste e solte seu arquivo JSON aqui ou clique para selecionar'}
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
              <FileJson className="h-4 w-4" />
              <span>Formato suportado: .json</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
