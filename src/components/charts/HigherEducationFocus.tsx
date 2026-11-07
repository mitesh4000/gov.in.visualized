import React from 'react';
import { ProcessedRecord, UnitMode } from '../../types/education';
import { formatEnrolment, formatGrowthRate } from '../../utils/formatters';
import { GraduationCap, Award, BookOpen, Sparkles } from 'lucide-react';

interface HigherEducationFocusProps {
  records: ProcessedRecord[];
  unitMode: UnitMode;
  onSelectTier: (level: string) => void;
}

export const HigherEducationFocus: React.FC<HigherEducationFocusProps> = ({
  records,
  unitMode,
  onSelectTier,
}) => {
  const higherEdRecords = records.filter((r) => r.category === 'Higher');
  const totalHigher2009 = higherEdRecords.reduce((sum, r) => sum + r.val2009, 0);

  const colors = [
    { bg: 'bg-indigo-600', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500' },
    { bg: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500' },
    { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500' },
    { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500' },
  ];

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Higher Education & University Sector Focus</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Internal distribution across collegiate degrees, graduate certificates, and technical diplomas
          </p>
        </div>
        <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold tabular-nums">
          Total: {formatEnrolment(totalHigher2009, unitMode)} students
        </div>
      </div>

      {/* Segmented Distribution Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="font-medium text-slate-600 dark:text-slate-400">
            Share of Collegiate / Tertiary Headcount (2009-10)
          </span>
        </div>
        <div className="h-6 w-full rounded-lg overflow-hidden flex bg-slate-100 dark:bg-slate-800">
          {higherEdRecords.map((r, i) => {
            const share = totalHigher2009 > 0 ? (r.val2009 / totalHigher2009) * 100 : 0;
            const col = colors[i % colors.length];
            return (
              <div
                key={r.id}
                onClick={() => onSelectTier(r.level)}
                style={{ width: `${share}%` }}
                className={`${col.bg} h-full transition-all cursor-pointer hover:opacity-90 relative group`}
                title={`${r.level}: ${share.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>

      {/* 4 Tertiary Sector Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {higherEdRecords.map((r, i) => {
          const share = totalHigher2009 > 0 ? (r.val2009 / totalHigher2009) * 100 : 0;
          const col = colors[i % colors.length];

          return (
            <div
              key={r.id}
              onClick={() => onSelectTier(r.level)}
              className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.bg}`} />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                    {share.toFixed(1)}% share
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 mb-3 min-h-[32px]">
                  {r.level}
                </h4>
              </div>

              <div>
                <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums mb-1">
                  {formatEnrolment(r.val2009, unitMode)}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>Growth Rate:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatGrowthRate(r.growthRate)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>1995-96 Base:</span>
                  <span className="tabular-nums">{formatEnrolment(r.val1995, unitMode)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
