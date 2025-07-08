
import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface JsonPreviewProps {
  data: any;
}

const JsonPreview = ({ data }: JsonPreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedKeys(newExpanded);
  };

  const renderValue = (value: any, key: string = '', depth: number = 0): JSX.Element => {
    const indentation = depth * 20;

    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="text-blue-400">{value.toString()}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-green-400">{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className="text-yellow-400">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedKeys.has(`${key}-${depth}`);
      return (
        <div>
          <button
            onClick={() => toggleExpanded(`${key}-${depth}`)}
            className="flex items-center text-purple-400 hover:text-purple-300"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span>[{value.length} items]</span>
          </button>
          {isExpanded && (
            <div className="ml-4 border-l border-gray-700 pl-4">
              {value.map((item, index) => (
                <div key={index} className="py-1">
                  <span className="text-gray-400">{index}: </span>
                  {renderValue(item, `${key}-${index}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      const isExpanded = expandedKeys.has(`${key}-${depth}`);
      
      return (
        <div>
          <button
            onClick={() => toggleExpanded(`${key}-${depth}`)}
            className="flex items-center text-purple-400 hover:text-purple-300"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span>{`{${keys.length} keys}`}</span>
          </button>
          {isExpanded && (
            <div className="ml-4 border-l border-gray-700 pl-4">
              {keys.map((objKey) => (
                <div key={objKey} className="py-1">
                  <span className="text-blue-300">"{objKey}"</span>
                  <span className="text-gray-400">: </span>
                  {renderValue(value[objKey], `${key}-${objKey}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span className="text-gray-300">{String(value)}</span>;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">Preview JSON</h3>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? 'Copiado!' : 'Copiar'}</span>
        </button>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="font-mono text-sm">
          {renderValue(data, 'root', 0)}
        </div>
      </div>
    </div>
  );
};

export default JsonPreview;
