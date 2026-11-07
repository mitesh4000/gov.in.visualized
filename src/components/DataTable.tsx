import React, { useState } from 'react';
import { ProcessedRecord, UnitMode } from '../types/education';
import { formatEnrolment, formatGrowthRate } from '../utils/formatters';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

interface DataTableProps {
  records: ProcessedRecord[];
  unitMode: UnitMode;
  selectedTier: string | null;
  onSelectTier: (level: string) => void;
}

type SortField = 'level' | 'category' | 'val1995' | 'val2007' | 'val2009' | 'growthRate' | 'percentChangeSince1995';
type SortOrder = 'asc' | 'desc';

export const DataTable: React.FC<DataTableProps> = ({
  records,
  unitMode,
  selectedTier,
  onSelectTier,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'School' | 'Higher'>('all');
  const [sortField, setSortField] = useState<SortField>('val2009');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filtered = records
    .filter((r) => {
      const matchSearch = r.level.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle nulls
      if (aVal === null) aVal = -Infinity;
      if (bVal === null) bVal = -Infinity;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortOrder === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Official Enrolment Ledger & Field Mapping
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Normalized microdata from Central NITI Aayog catalog (UUID: 860fdc20-6944-4130-9694-b22a658ecfca)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter education levels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Segmented Category Filter */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCategoryFilter('School')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                categoryFilter === 'School'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              School
            </button>
            <button
              onClick={() => setCategoryFilter('Higher')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                categoryFilter === 'Higher'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Higher Ed
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold select-none">
              <th
                onClick={() => handleSort('level')}
                className="py-3 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Education Level</span>
                  {sortField === 'level' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('category')}
                className="py-3 px-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Category</span>
                  {sortField === 'category' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('val1995')}
                className="py-3 px-4 text-right cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>1995-96</span>
                  {sortField === 'val1995' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('val2007')}
                className="py-3 px-4 text-right cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>2007-08</span>
                  {sortField === 'val2007' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('val2009')}
                className="py-3 px-4 text-right cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>2009-10 (Latest)</span>
                  {sortField === 'val2009' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                onClick={() => handleSort('growthRate')}
                className="py-3 px-4 text-right cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Annual Growth Rate</span>
                  {sortField === 'growthRate' ? (
                    sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th className="py-3 px-4 text-center whitespace-nowrap">
                Trend Trajectory
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No matching education tiers found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const isSelected = selectedTier === r.level;

                // Sparkline calculations (relative to r's own values)
                const v1 = r.val1995 || 0;
                const v2 = r.val2007;
                const v3 = r.val2009;
                const maxRowVal = Math.max(v1, v2, v3, 1);
                const p1 = (v1 / maxRowVal) * 100;
                const p2 = (v2 / maxRowVal) * 100;
                const p3 = (v3 / maxRowVal) * 100;

                return (
                  <tr
                    key={r.id}
                    onClick={() => onSelectTier(r.level)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Level */}
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-2">
                        <span>{r.level}</span>
                      </div>
                    </td>

                    {/* Category (unboxed metadata text) */}
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <span>{r.category === 'School' ? 'School (K-12)' : 'Higher & Technical'}</span>
                    </td>

                    {/* 1995-96 */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {formatEnrolment(r.val1995, unitMode)}
                    </td>

                    {/* 2007-08 */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      {formatEnrolment(r.val2007, unitMode)}
                    </td>

                    {/* 2009-10 */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      {formatEnrolment(r.val2009, unitMode)}
                    </td>

                    {/* Growth rate */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatGrowthRate(r.growthRate)}
                    </td>

                    {/* Mini Sparkline */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-end justify-center gap-1 w-16 h-5">
                        <div
                          style={{ height: `${Math.max(p1, 10)}%` }}
                          className={`w-2 rounded-xs ${
                            r.val1995 === null ? 'bg-transparent border border-dashed border-slate-300' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`1995: ${formatEnrolment(r.val1995, unitMode)}`}
                        />
                        <div
                          style={{ height: `${Math.max(p2, 10)}%` }}
                          className="w-2 rounded-xs bg-sky-400 dark:bg-sky-600"
                          title={`2007: ${formatEnrolment(r.val2007, unitMode)}`}
                        />
                        <div
                          style={{ height: `${Math.max(p3, 10)}%` }}
                          className="w-2 rounded-xs bg-indigo-600 dark:bg-indigo-500"
                          title={`2009: ${formatEnrolment(r.val2009, unitMode)}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info & API Schema notes */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span>Showing {filtered.length} of {records.length} records</span>
          <span aria-hidden="true">·</span>
          <span>Original unit: Thousands ('000)</span>
          <span aria-hidden="true">·</span>
          <span>Source: data.gov.in</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Click any row to view individual tier diagnostic breakdown
        </div>
      </div>
    </div>
  );
};
