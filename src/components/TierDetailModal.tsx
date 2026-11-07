import React from 'react';
import { ProcessedRecord, UnitMode } from '../types/education';
import { formatEnrolment, formatGrowthRate } from '../utils/formatters';
import { X, TrendingUp, Calendar, Hash, ArrowUpRight } from 'lucide-react';

interface TierDetailModalProps {
  tier: ProcessedRecord | null;
  unitMode: UnitMode;
  totalEnrolment2009: number;
  onClose: () => void;
}

export const TierDetailModal: React.FC<TierDetailModalProps> = ({
  tier,
  unitMode,
  totalEnrolment2009,
  onClose,
}) => {
  if (!tier) return null;

  const shareOfTotal = totalEnrolment2009 > 0 ? (tier.val2009 / totalEnrolment2009) * 100 : 0;
  const growthMultiplier = tier.val1995 && tier.val1995 > 0 ? (tier.val2009 / tier.val1995).toFixed(2) : null;
  const netAddedStudents = tier.val1995 !== null ? tier.val2009 - tier.val1995 : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transition-all">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{tier.category === 'School' ? 'School Education (K-12)' : 'Higher & Technical Education'}</span>
              <span aria-hidden="true">·</span>
              <span>Index #{tier.orderIndex + 1}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {tier.level}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">1995-96</div>
              <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                {formatEnrolment(tier.val1995, unitMode)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">2007-08</div>
              <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                {formatEnrolment(tier.val2007, unitMode)}
              </div>
            </div>

            <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">2009-10 (Current)</div>
              <div className="text-base font-bold text-indigo-700 dark:text-indigo-300 tabular-nums mt-1">
                {formatEnrolment(tier.val2009, unitMode)}
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <div className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">Annual Growth</div>
              <div className="text-base font-bold text-emerald-700 dark:text-emerald-300 tabular-nums mt-1">
                {formatGrowthRate(tier.growthRate)}
              </div>
            </div>
          </div>

          {/* Quantitative Breakdown */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Cohort Trajectory & Macro Impact
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Share of Total Enrolled Population</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {shareOfTotal.toFixed(2)}%
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5">of 263.8M student total</span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">14-Year Growth Multiplier</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {growthMultiplier ? `${growthMultiplier}x` : 'Baseline started 2007'}
                </span>
                {netAddedStudents !== null && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 ml-1.5 tabular-nums">
                    (+{formatEnrolment(netAddedStudents, unitMode)} net addition)
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">2-Year Delta (2007-08 → 2009-10)</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {tier.absChangeSince2007 >= 0 ? '+' : ''}
                  {formatEnrolment(tier.absChangeSince2007, unitMode)}
                </span>
                <span className="text-[11px] text-slate-400 ml-1.5 tabular-nums">
                  ({tier.percentChangeSince2007 >= 0 ? '+' : ''}{tier.percentChangeSince2007.toFixed(1)}%)
                </span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Statistical Status</span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {tier.val1995 === null ? 'Reporting instituted in 2007' : 'Standard 14-year longitudinal tracking'}
                </span>
              </div>
            </div>
          </div>

          {/* Raw JSON Mapping */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Underlying API Record Payload
            </div>
            <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-lg text-[11px] font-mono overflow-x-auto">
{JSON.stringify(
  {
    education_level_all_figures_in_000_: tier.level,
    enrolment_1995_96_: tier.val1995 ?? 'NA',
    enrolment_2007_08_: tier.val2007,
    enrolment___2009_10: tier.val2009,
    enrolment_growth_rate_: tier.growthRate,
  },
  null,
  2
)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
