/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DEFAULT_API_RESPONSE } from './data/defaultApiResponse';
import { EducationApiResponse, UnitMode } from './types/education';
import { processRecords, computeSummaryMetrics, formatEnrolment } from './utils/formatters';
import { TopBar } from './components/TopBar';
import { MetricCards } from './components/MetricCards';
import { ComparativeBarChart } from './components/charts/ComparativeBarChart';
import { FunnelChart } from './components/charts/FunnelChart';
import { GrowthVelocityChart } from './components/charts/GrowthVelocityChart';
import { HigherEducationFocus } from './components/charts/HigherEducationFocus';
import { DataTable } from './components/DataTable';
import { TierDetailModal } from './components/TierDetailModal';
import { ApiInspectorModal } from './components/ApiInspectorModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import {
  Layers,
  BarChart3,
  Filter,
  FileSpreadsheet,
  Terminal,
  ExternalLink,
  Info
} from 'lucide-react';

export default function App() {
  const [apiData, setApiData] = useState<EducationApiResponse>(DEFAULT_API_RESPONSE);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [unitMode, setUnitMode] = useState<UnitMode>('millions');
  const [selectedTierLevel, setSelectedTierLevel] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isApiInspectorOpen, setIsApiInspectorOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sync dark class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Processed records from current apiData
  const processedRecords = processRecords(apiData.records || []);
  const metrics = computeSummaryMetrics(processedRecords);

  const selectedTier = processedRecords.find((r) => r.level === selectedTierLevel) || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* 3-Zone Top Navigation Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenApiInspector={() => setIsApiInspectorOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dataset Header & Unboxed Metadata Banner */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              {/* Unboxed metadata row with typographic separators */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{apiData.org?.[0] || 'NITI Aayog'}</span>
                <span aria-hidden="true">·</span>
                <span>{apiData.org_type || 'Central'}</span>
                <span aria-hidden="true">·</span>
                <span>{apiData.sector?.join(' / ') || 'Higher Education'}</span>
                <span aria-hidden="true">·</span>
                <span>{apiData.source || 'data.gov.in'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">UUID: {apiData.catalog_uuid?.substring(0, 8)}...</span>
              </div>

              {/* Title with balanced line wrap */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                {apiData.title || 'Current enrolment across different education level in Higher Education'}
              </h1>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Longitudinal macro analysis tracking Indian educational enrollment dynamics, vocational surge rates, and collegiate progression benchmarks from 1995-96 to 2009-10.
              </p>
            </div>

            {/* Global Interactive Unit Selector */}
            <div className="shrink-0 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Display Units</span>
                <Filter className="w-3 h-3 text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                <button
                  onClick={() => setUnitMode('millions')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-left ${
                    unitMode === 'millions'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Millions (M)
                </button>
                <button
                  onClick={() => setUnitMode('indian_lakh_crore')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-left ${
                    unitMode === 'indian_lakh_crore'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Lakh / Crore (Cr)
                </button>
                <button
                  onClick={() => setUnitMode('thousands')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-left ${
                    unitMode === 'thousands'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Raw '000s (k)
                </button>
                <button
                  onClick={() => setUnitMode('headcount')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-left ${
                    unitMode === 'headcount'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Exact Headcount
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Metric Cards */}
        <section aria-label="Key Performance Indicators">
          <MetricCards
            records={processedRecords}
            unitMode={unitMode}
            onSelectTier={(level) => setSelectedTierLevel(level)}
          />
        </section>

        {/* View Selection Segmented Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Executive Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'trends'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Comparative Growth</span>
            </button>

            <button
              onClick={() => setActiveTab('funnel')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'funnel'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Education Funnel</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'table'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Data Registry</span>
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'api'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>API Inspector</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span>8 Tiers Registered</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-mono">1995 → 2010</span>
          </div>
        </div>

        {/* Tab View: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Primary Comparative Chart */}
            <ComparativeBarChart
              records={processedRecords}
              unitMode={unitMode}
              selectedTier={selectedTierLevel}
              onSelectTier={(level) => setSelectedTierLevel(level)}
            />

            {/* Split Grid: Higher Ed Focus + Growth Velocity */}
            <div className="grid grid-cols-1 gap-8">
              <HigherEducationFocus
                records={processedRecords}
                unitMode={unitMode}
                onSelectTier={(level) => setSelectedTierLevel(level)}
              />

              <GrowthVelocityChart
                records={processedRecords}
                unitMode={unitMode}
                onSelectTier={(level) => setSelectedTierLevel(level)}
              />
            </div>

            {/* Full Sortable Data Table */}
            <DataTable
              records={processedRecords}
              unitMode={unitMode}
              selectedTier={selectedTierLevel}
              onSelectTier={(level) => setSelectedTierLevel(level)}
            />
          </div>
        )}

        {/* Tab View: Comparative Trends */}
        {activeTab === 'trends' && (
          <div className="space-y-8">
            <ComparativeBarChart
              records={processedRecords}
              unitMode={unitMode}
              selectedTier={selectedTierLevel}
              onSelectTier={(level) => setSelectedTierLevel(level)}
            />

            <GrowthVelocityChart
              records={processedRecords}
              unitMode={unitMode}
              onSelectTier={(level) => setSelectedTierLevel(level)}
            />
          </div>
        )}

        {/* Tab View: Education Funnel */}
        {activeTab === 'funnel' && (
          <div className="space-y-8">
            <FunnelChart
              records={processedRecords}
              unitMode={unitMode}
              onSelectTier={(level) => setSelectedTierLevel(level)}
            />

            <HigherEducationFocus
              records={processedRecords}
              unitMode={unitMode}
              onSelectTier={(level) => setSelectedTierLevel(level)}
            />
          </div>
        )}

        {/* Tab View: Data Registry Table */}
        {activeTab === 'table' && (
          <div className="space-y-8">
            <DataTable
              records={processedRecords}
              unitMode={unitMode}
              selectedTier={selectedTierLevel}
              onSelectTier={(level) => setSelectedTierLevel(level)}
            />
          </div>
        )}

        {/* Tab View: API Inspector In-Page */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Live API Request & Endpoint Blueprint
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Verified HTTP response returned by the Open Government Data Platform
                  </p>
                </div>
                <button
                  onClick={() => setIsApiInspectorOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Open Full Inspector & Importer
                </button>
              </div>

              <div className="p-4 bg-slate-950 text-indigo-300 rounded-xl font-mono text-xs overflow-x-auto mb-6">
                <code>
                  {`curl -X 'GET' \\\n  'https://api.data.gov.in/resource/e448dca6-613b-4413-af1e-337a61dcec4d?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json' \\\n  -H 'accept: application/xml'`}
                </code>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-slate-400 mb-1">Index Resource ID</div>
                  <div className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {apiData.index_name}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-slate-400 mb-1">Response Version & Status</div>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                    v{apiData.version} ({apiData.status.toUpperCase()})
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="text-slate-400 mb-1">Total Record Count</div>
                  <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {apiData.count} of {apiData.total} records
                  </div>
                </div>
              </div>
            </div>

            <DataTable
              records={processedRecords}
              unitMode={unitMode}
              selectedTier={selectedTierLevel}
              onSelectTier={(level) => setSelectedTierLevel(level)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-700 dark:text-slate-300">National Education Enrolment Observatory</span>
            <span aria-hidden="true">·</span>
            <span>NITI Aayog & data.gov.in</span>
            <span aria-hidden="true">·</span>
            <span>Open Government Data (OGD) Platform India</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiInspectorOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              API Spec
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Export CSV / JSON
            </button>
            <a
              href="https://data.gov.in"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 transition-colors"
            >
              <span>data.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <TierDetailModal
        tier={selectedTier}
        unitMode={unitMode}
        totalEnrolment2009={metrics.total2009}
        onClose={() => setSelectedTierLevel(null)}
      />

      {isExportOpen && (
        <ExecutiveReportModal
          records={processedRecords}
          unitMode={unitMode}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {isApiInspectorOpen && (
        <ApiInspectorModal
          apiData={apiData}
          onUpdateApiData={(newData) => setApiData(newData)}
          onResetDefault={() => setApiData(DEFAULT_API_RESPONSE)}
          onClose={() => setIsApiInspectorOpen(false)}
        />
      )}
    </div>
  );
}
