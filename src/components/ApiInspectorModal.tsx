import React, { useState } from 'react';
import { EducationApiResponse } from '../types/education';
import { Copy, Check, Terminal, Database, Code, RefreshCw, AlertCircle } from 'lucide-react';

interface ApiInspectorModalProps {
  apiData: EducationApiResponse;
  onUpdateApiData: (newData: EducationApiResponse) => void;
  onResetDefault: () => void;
  onClose: () => void;
}

export const ApiInspectorModal: React.FC<ApiInspectorModalProps> = ({
  apiData,
  onUpdateApiData,
  onResetDefault,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'response' | 'curl' | 'schema' | 'import'>('response');
  const [copied, setCopied] = useState(false);
  const [customJsonInput, setCustomJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const curlCommand = `curl -X 'GET' \\
  'https://api.data.gov.in/resource/e448dca6-613b-4413-af1e-337a61dcec4d?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json' \\
  -H 'accept: application/xml'`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCustomJson = () => {
    try {
      const parsed = JSON.parse(customJsonInput);
      if (!parsed.records || !Array.isArray(parsed.records)) {
        throw new Error('JSON must contain a "records" array.');
      }
      onUpdateApiData(parsed);
      setJsonError(null);
      alert('Custom response successfully loaded into dashboard!');
      onClose();
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl transition-all">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                API Endpoint & Data Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                data.gov.in Open Data Resource: <code className="font-mono text-slate-700 dark:text-slate-300">e448dca6-613b-4413-af1e-337a61dcec4d</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs font-medium bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('response')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'response'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Raw JSON Response ({apiData.records?.length || 0} records)
          </button>
          <button
            onClick={() => setActiveTab('curl')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'curl'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            cURL Request
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'schema'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Data Schema ({apiData.field?.length || 0} fields)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Custom JSON Input
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTab === 'response' && (
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500">
                  Status: <strong className="text-emerald-600 font-semibold">200 OK</strong> · Content-Type: application/json
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(apiData, null, 2))}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Response'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-[480px]">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'curl' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Official execution command:</span>
                <button
                  onClick={() => handleCopy(curlCommand)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy cURL'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-indigo-300 rounded-xl text-xs font-mono overflow-x-auto">
                {curlCommand}
              </pre>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                <div className="font-semibold mb-1">CORS & Sandbox Connectivity Note:</div>
                Direct client-side browser requests to <code className="font-mono">api.data.gov.in</code> can be blocked by CORS headers or IP rate-limits from public cloud sandboxes. This observatory comes pre-bundled with the verified authenticated payload and supports real-time custom JSON paste.
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Official API field descriptors provided in metadata:
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="py-2.5 px-4">Field ID</th>
                      <th className="py-2.5 px-4">Human Label</th>
                      <th className="py-2.5 px-4">Data Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {apiData.field?.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                          {f.id}
                        </td>
                        <td className="py-2.5 px-4 text-slate-900 dark:text-white font-medium">
                          {f.name}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">
                          {f.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Paste an updated or customized response JSON payload from any data.gov.in resource to render it instantly on this dashboard:
              </p>
              <textarea
                rows={10}
                placeholder="Paste API response JSON here..."
                value={customJsonInput}
                onChange={(e) => setCustomJsonInput(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {jsonError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <button
                  onClick={onResetDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Official Response</span>
                </button>
                <button
                  onClick={handleApplyCustomJson}
                  disabled={!customJsonInput.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                >
                  Apply & Render Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
