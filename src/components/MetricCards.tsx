import React from 'react';
import { ProcessedRecord, UnitMode } from '../types/education';
import { computeSummaryMetrics, formatEnrolment, formatGrowthRate } from '../utils/formatters';
import { GraduationCap, TrendingUp, Users, Award } from 'lucide-react';

interface MetricCardsProps {
  records: ProcessedRecord[];
  unitMode: UnitMode;
  onSelectTier?: (tierName: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ records, unitMode, onSelectTier }) => {
  const metrics = computeSummaryMetrics(records);

  // Graduate tier details
  const graduateTier = records.find(r => r.level.toLowerCase().includes('graduate level degree'));
  const diplomaTier = records.find(r => r.level.toLowerCase().includes('diploma or certificate below'));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Total Enrolment */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Total National Enrolment</span>
          <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {formatEnrolment(metrics.total2009, unitMode)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
            +{formatGrowthRate(
              metrics.total1995 > 0 ? ((metrics.total2009 - metrics.total1995) / metrics.total1995) * 100 : 0
            )}
          </span>
          <span aria-hidden="true">·</span>
          <span>Since 1995-96 baseline</span>
        </div>
      </div>

      {/* Metric 2: Tertiary / Higher Education */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Higher Education Headcount</span>
          <GraduationCap className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {formatEnrolment(metrics.higherEd2009, unitMode)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
            +{metrics.higherEdExpansionRate.toFixed(1)}%
          </span>
          <span aria-hidden="true">·</span>
          <span>Collegiate & Technical ({metrics.tertiaryShare.toFixed(1)}% of total)</span>
        </div>
      </div>

      {/* Metric 3: Graduate Degree Courses */}
      <div
        onClick={() => graduateTier && onSelectTier?.(graduateTier.level)}
        className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-700"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Graduate Degree Courses</span>
          <Award className="w-4 h-4 text-sky-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {formatEnrolment(graduateTier?.val2009 || 0, unitMode)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
            {formatGrowthRate(graduateTier?.growthRate)}
          </span>
          <span aria-hidden="true">·</span>
          <span>Annual growth rate (6.3x expansion)</span>
        </div>
      </div>

      {/* Metric 4: Peak Growth Sector */}
      <div
        onClick={() => diplomaTier && onSelectTier?.(diplomaTier.level)}
        className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-700"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">Fastest Expanding Segment</span>
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
          {formatGrowthRate(metrics.highestGrowthTier?.growthRate)}
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
          <span className="truncate">{metrics.highestGrowthTier?.level || 'Vocational Diplomas'}</span>
        </div>
      </div>
    </div>
  );
};
