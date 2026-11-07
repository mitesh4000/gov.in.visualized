import React, { useState } from 'react';
import { ProcessedRecord, UnitMode } from '../types/education';
import { formatEnrolment, formatGrowthRate, computeSummaryMetrics } from '../utils/formatters';
import { X, Download, FileSpreadsheet, FileCode, Printer, Check, Copy } from 'lucide-react';

interface ExecutiveReportModalProps {
  records: ProcessedRecord[];
  unitMode: UnitMode;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  records,
  unitMode,
  onClose,
}) => {
  const [copiedCsv, setCopiedCsv] = useState(false);
  const metrics = computeSummaryMetrics(records);

  const generateCsv = (): string => {
    const headers = [
      'Education Level',
      'Category',
      'Enrolment 1995-96 (in 000)',
      'Enrolment 2007-08 (in 000)',
      'Enrolment 2009-10 (in 000)',
      'Annual Growth Rate (%)',
      'Enrolment 2009-10 Formatted'
    ];

    const rows = records.map((r) => [
      `"${r.level.replace(/"/g, '""')}"`,
      r.category,
      r.val1995 !== null ? r.val1995 : 'NA',
      r.val2007,
      r.val2009,
      r.growthRate,
      `"${formatEnrolment(r.val2009, unitMode)}"`
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  };

  const handleDownloadCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(generateCsv());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', 'niti_aayog_education_enrolment.csv');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadJson = () => {
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonStr);
    downloadAnchor.setAttribute('download', 'niti_aayog_education_enrolment.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(generateCsv());
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl transition-all">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Export Dataset & Executive Brief
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download clean tabular formats or copy structured rows
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CSV Export */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>CSV Spreadsheet Format</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Fully normalized CSV compatible with Microsoft Excel, Google Sheets, or R/Python pandas.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCsv}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .CSV</span>
                </button>
                <button
                  onClick={handleCopyCsv}
                  title="Copy CSV to clipboard"
                  className="p-2 border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300"
                >
                  {copiedCsv ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* JSON Export */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs mb-1">
                  <FileCode className="w-4 h-4" />
                  <span>Structured JSON Dataset</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Parsed JSON array with longitudinal indicators, absolute deltas, and percentage expansion ratios.
                </p>
              </div>
              <button
                onClick={handleDownloadJson}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </button>
            </div>
          </div>

          {/* Executive Summary Briefing */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Official Briefing Summary
              </span>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Briefing</span>
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Source:</strong> NITI Aayog (Central Government of India), published via data.gov.in Open Government Data Platform (Catalog UUID: 860fdc20-6944-4130-9694-b22a658ecfca).
              </p>
              <p>
                <strong>Key Findings:</strong> Total national education headcount reached{' '}
                <strong className="text-slate-900 dark:text-white tabular-nums">
                  {formatEnrolment(metrics.total2009, unitMode)}
                </strong>{' '}
                by 2009-10. Higher and technical education witnessed a staggering{' '}
                <strong className="text-slate-900 dark:text-white tabular-nums">
                  +{metrics.higherEdExpansionRate.toFixed(1)}%
                </strong>{' '}
                expansion since the 1995-96 baseline, led by below-graduate diplomas (+20.9% annual growth) and postgraduate degree courses (+16.3% annual growth).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
