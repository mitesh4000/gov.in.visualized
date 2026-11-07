import React from 'react';
import { ProcessedRecord, UnitMode } from '../../types/education';
import { formatEnrolment, formatGrowthRate } from '../../utils/formatters';
import { TrendingUp, Award, Layers } from 'lucide-react';

interface GrowthVelocityChartProps {
  records: ProcessedRecord[];
  unitMode: UnitMode;
  onSelectTier: (level: string) => void;
}

export const GrowthVelocityChart: React.FC<GrowthVelocityChartProps> = ({
  records,
  unitMode,
  onSelectTier,
}) => {
  // Sort descending by growth rate
  const sortedByGrowth = [...records].sort((a, b) => b.growthRate - a.growthRate);
  const maxGrowth = Math.max(...records.map((r) => r.growthRate), 25);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Enrolment Growth Velocity Ranking</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compound annual growth rate (CAGR) and long-term cohort expansion multipliers
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Ranked by official reported growth rate (%)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Ranked Growth Rates Bars */}
        <div className="lg:col-span-8 space-y-4">
          {sortedByGrowth.map((r, rank) => {
            const barWidth = (r.growthRate / maxGrowth) * 100;
            const multiplier =
              r.val1995 && r.val1995 > 0 ? (r.val2009 / r.val1995).toFixed(1) : null;

            return (
              <div
                key={r.id}
                onClick={() => onSelectTier(r.level)}
                className="group cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-sm flex items-center justify-center font-bold text-[10px] ${
                        rank < 3
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      #{rank + 1}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {r.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {multiplier && (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                        {multiplier}x expansion
                      </span>
                    )}
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatGrowthRate(r.growthRate)}
                    </span>
                  </div>
                </div>

                {/* Growth Rate bar */}
                <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(barWidth, r.growthRate > 0 ? 3 : 0)}%` }}
                    className={`h-full rounded-full transition-all ${
                      r.growthRate > 15
                        ? 'bg-emerald-500'
                        : r.growthRate > 10
                        ? 'bg-teal-500'
                        : r.growthRate > 5
                        ? 'bg-sky-500'
                        : r.growthRate > 0
                        ? 'bg-indigo-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    2009-10 Volume: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{formatEnrolment(r.val2009, unitMode)}</strong>
                  </span>
                  <span>
                    1995-96: <span className="tabular-nums">{formatEnrolment(r.val1995, unitMode)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Growth Insights & Multiplier Spotlight */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Highest Velocity Sectors</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Technical diplomas (<strong className="font-semibold text-emerald-700 dark:text-emerald-400">+20.9%</strong>) and postgraduate programs (<strong className="font-semibold text-emerald-700 dark:text-emerald-400">+16.3%</strong>) outpaced traditional primary education growth by <strong className="font-semibold">3.5x to 4.3x</strong>, reflecting severe industrial and technical skill demand across India during this period.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-xs uppercase tracking-wider mb-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Net Expansion Multipliers</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Post Graduate & Above</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">9.01x (261k → 2.35M)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Graduate Degree Course</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">6.28x (2.9M → 18.4M)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-600 dark:text-slate-400">Diploma (below grad)</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">5.89x (496k → 2.92M)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600 dark:text-slate-400">Primary Education</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">1.87x (60.6M → 113.8M)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
