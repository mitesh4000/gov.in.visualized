import React, { useState } from 'react';
import { ProcessedRecord, UnitMode } from '../../types/education';
import { formatEnrolment, formatGrowthRate } from '../../utils/formatters';

interface ComparativeBarChartProps {
  records: ProcessedRecord[];
  unitMode: UnitMode;
  selectedTier: string | null;
  onSelectTier: (level: string) => void;
}

export const ComparativeBarChart: React.FC<ComparativeBarChartProps> = ({
  records,
  unitMode,
  selectedTier,
  onSelectTier,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'school' | 'higher'>('all');
  const [visibleYears, setVisibleYears] = useState<{ [key: string]: boolean }>({
    '1995': true,
    '2007': true,
    '2009': true,
  });
  const [isLogScale, setIsLogScale] = useState(false);
  const [hoveredData, setHoveredData] = useState<{
    tier: ProcessedRecord;
    year: string;
    value: number | null;
  } | null>(null);

  const filteredRecords = records.filter((r) => {
    if (filterCategory === 'school') return r.category === 'School';
    if (filterCategory === 'higher') return r.category === 'Higher';
    return true;
  });

  // Calculate maximum for scaling
  const allValues = filteredRecords.flatMap((r) => [
    r.val1995 || 0,
    r.val2007 || 0,
    r.val2009 || 0,
  ]);
  const maxValue = Math.max(...allValues, 1);

  const getBarHeightPercent = (val: number | null): number => {
    if (val === null || val <= 0) return 0;
    if (isLogScale) {
      // Log scale: map log10(val) from min log to max log
      const logMin = 2; // ~100
      const logMax = Math.log10(maxValue * 1.05);
      const logVal = Math.log10(Math.max(val, 10));
      const pct = ((logVal - logMin) / (logMax - logMin)) * 100;
      return Math.max(Math.min(pct, 100), 4);
    }
    return (val / maxValue) * 100;
  };

  const toggleYear = (yr: string) => {
    setVisibleYears((prev) => ({
      ...prev,
      [yr]: !prev[yr],
    }));
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Comparative Multi-Year Enrolment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-sectional growth tracking across 1995-96, 2007-08, and 2009-10 benchmarks
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                filterCategory === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Levels ({records.length})
            </button>
            <button
              onClick={() => setFilterCategory('school')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                filterCategory === 'school'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              School (K-12)
            </button>
            <button
              onClick={() => setFilterCategory('higher')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                filterCategory === 'higher'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Higher & Technical
            </button>
          </div>

          {/* Scale Toggle */}
          <button
            onClick={() => setIsLogScale(!isLogScale)}
            title="Toggle between Linear and Logarithmic visualization"
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              isLogScale
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {isLogScale ? 'Scale: Logarithmic' : 'Scale: Linear'}
          </button>
        </div>
      </div>

      {/* Year Legend & Toggles */}
      <div className="flex items-center justify-between gap-4 py-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-400 dark:text-slate-500 font-medium">Toggle series:</span>
          <button
            onClick={() => toggleYear('1995')}
            className={`inline-flex items-center gap-1.5 transition-opacity ${
              visibleYears['1995'] ? 'opacity-100 font-medium' : 'opacity-40 line-through'
            }`}
          >
            <span className="w-3 h-3 rounded-xs bg-slate-400 dark:bg-slate-600 shrink-0" />
            <span>1995-96</span>
          </button>
          <button
            onClick={() => toggleYear('2007')}
            className={`inline-flex items-center gap-1.5 transition-opacity ${
              visibleYears['2007'] ? 'opacity-100 font-medium' : 'opacity-40 line-through'
            }`}
          >
            <span className="w-3 h-3 rounded-xs bg-sky-500 shrink-0" />
            <span>2007-08</span>
          </button>
          <button
            onClick={() => toggleYear('2009')}
            className={`inline-flex items-center gap-1.5 transition-opacity ${
              visibleYears['2009'] ? 'opacity-100 font-medium' : 'opacity-40 line-through'
            }`}
          >
            <span className="w-3 h-3 rounded-xs bg-indigo-600 shrink-0" />
            <span>2009-10 (Latest)</span>
          </button>
        </div>

        {isLogScale && (
          <span className="text-[11px] text-slate-400 italic hidden sm:inline">
            Logarithmic mode elevates low-enrolment technical & postgraduate degree visualization
          </span>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="relative mt-4 pt-6 pb-2 min-h-[340px] flex items-end border-b border-slate-200 dark:border-slate-800">
        {/* Horizontal gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
          <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
          <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
          <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
        </div>

        {/* Grouped Bars Container */}
        <div className="w-full grid grid-flow-col auto-cols-fr gap-3 sm:gap-6 items-end relative z-10">
          {filteredRecords.map((r) => {
            const isSelected = selectedTier === r.level;
            const h1995 = getBarHeightPercent(r.val1995);
            const h2007 = getBarHeightPercent(r.val2007);
            const h2009 = getBarHeightPercent(r.val2009);

            return (
              <div
                key={r.id}
                onClick={() => onSelectTier(r.level)}
                className={`group flex flex-col items-center h-full justify-end cursor-pointer transition-all p-1 rounded-lg ${
                  isSelected
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-500/50'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Bars group */}
                <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-64">
                  {/* 1995-96 Bar */}
                  {visibleYears['1995'] && (
                    <div
                      onMouseEnter={() =>
                        setHoveredData({ tier: r, year: '1995-96', value: r.val1995 })
                      }
                      onMouseLeave={() => setHoveredData(null)}
                      style={{ height: `${h1995}%` }}
                      className={`w-full max-w-[14px] sm:max-w-[18px] rounded-t transition-all ${
                        r.val1995 === null
                          ? 'border border-dashed border-slate-300 dark:border-slate-700 bg-transparent h-2!'
                          : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-600'
                      }`}
                      title={
                        r.val1995 === null
                          ? '1995-96: Data not available'
                          : `1995-96: ${formatEnrolment(r.val1995, unitMode)}`
                      }
                    />
                  )}

                  {/* 2007-08 Bar */}
                  {visibleYears['2007'] && (
                    <div
                      onMouseEnter={() =>
                        setHoveredData({ tier: r, year: '2007-08', value: r.val2007 })
                      }
                      onMouseLeave={() => setHoveredData(null)}
                      style={{ height: `${h2007}%` }}
                      className="w-full max-w-[14px] sm:max-w-[18px] bg-sky-400 dark:bg-sky-600 rounded-t transition-all group-hover:brightness-110"
                      title={`2007-08: ${formatEnrolment(r.val2007, unitMode)}`}
                    />
                  )}

                  {/* 2009-10 Bar */}
                  {visibleYears['2009'] && (
                    <div
                      onMouseEnter={() =>
                        setHoveredData({ tier: r, year: '2009-10', value: r.val2009 })
                      }
                      onMouseLeave={() => setHoveredData(null)}
                      style={{ height: `${h2009}%` }}
                      className="w-full max-w-[14px] sm:max-w-[18px] bg-indigo-600 dark:bg-indigo-500 rounded-t shadow-xs transition-all group-hover:bg-indigo-500"
                      title={`2009-10: ${formatEnrolment(r.val2009, unitMode)}`}
                    />
                  )}
                </div>

                {/* Level Title Label */}
                <div className="mt-3 text-center w-full px-1">
                  <div
                    className={`text-[11px] sm:text-xs font-medium leading-tight truncate ${
                      isSelected
                        ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                    title={r.level}
                  >
                    {r.level.replace('Diploma or certificate :', 'Diploma: ')}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums mt-0.5">
                    {formatGrowthRate(r.growthRate)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Hover / Active Inspection Callout */}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        {hoveredData ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900 dark:text-white">
              {hoveredData.tier.level}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
              ·
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              {hoveredData.year}:{' '}
              <strong className="text-slate-900 dark:text-white tabular-nums">
                {formatEnrolment(hoveredData.value, unitMode)}
              </strong>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
              ·
            </span>
            <span className="text-slate-500">
              Growth Rate: {formatGrowthRate(hoveredData.tier.growthRate)}
            </span>
          </div>
        ) : (
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Hover over any bar to inspect exact values. Click a tier to focus view.</span>
          </div>
        )}

        <div className="text-[11px] text-slate-500 flex items-center gap-2">
          <span>Active Units:</span>
          <span className="font-medium text-slate-700 dark:text-slate-300 uppercase">
            {unitMode.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};
