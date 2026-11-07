import React from 'react';
import { ProcessedRecord, UnitMode } from '../../types/education';
import { formatEnrolment } from '../../utils/formatters';
import { ArrowDown, HelpCircle } from 'lucide-react';

interface FunnelChartProps {
  records: ProcessedRecord[];
  unitMode: UnitMode;
  onSelectTier: (level: string) => void;
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ records, unitMode, onSelectTier }) => {
  // Ordered sequence for educational pipeline
  const pipelineSequence = [
    'Primary',
    'Middle',
    'Secondary',
    'Higher Secondary',
    'Graduate level degree course',
    'Post Graduate and above degree course',
  ];

  const pipelineRecords = pipelineSequence
    .map((name) => records.find((r) => r.level.toLowerCase().includes(name.toLowerCase())))
    .filter((r): r is ProcessedRecord => !!r);

  const primaryRecord = pipelineRecords[0];
  const primaryVal = primaryRecord ? primaryRecord.val2009 : 1;

  // Additional technical streams
  const technicalStreams = records.filter((r) =>
    r.level.toLowerCase().includes('diploma')
  );

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            National Education Progression Funnel (2009-10)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Student retention, structural drop-offs, and collegiate transition rates across tier milestones
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Normalized against Primary intake (113.8M)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Main Progression Funnel */}
        <div className="lg:col-span-8 space-y-4">
          {pipelineRecords.map((item, idx) => {
            const pctOfPrimary = ((item.val2009 / primaryVal) * 100);
            const prevItem = idx > 0 ? pipelineRecords[idx - 1] : null;
            const stepRetention = prevItem ? ((item.val2009 / prevItem.val2009) * 100) : 100;

            return (
              <div
                key={item.id}
                onClick={() => onSelectTier(item.level)}
                className="group cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                      {formatEnrolment(item.val2009, unitMode)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 tabular-nums text-[11px] w-14 text-right">
                      {pctOfPrimary.toFixed(1)}% of base
                    </span>
                  </div>
                </div>

                {/* Progress bar representing funnel width */}
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden flex">
                  <div
                    style={{ width: `${Math.max(pctOfPrimary, 2.5)}%` }}
                    className={`h-full transition-all rounded-r-xs ${
                      idx === 0
                        ? 'bg-indigo-600'
                        : idx === 1
                        ? 'bg-indigo-500'
                        : idx === 2
                        ? 'bg-sky-500'
                        : idx === 3
                        ? 'bg-cyan-500'
                        : idx === 4
                        ? 'bg-emerald-500'
                        : 'bg-emerald-600'
                    }`}
                  />
                </div>

                {/* Transition metric from previous level */}
                {prevItem && (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pl-7">
                    <ArrowDown className="w-3 h-3 text-slate-400" />
                    <span>
                      Retention from previous tier: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{stepRetention.toFixed(1)}%</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">
                      Attrition: {(100 - stepRetention).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Secondary / Technical Branches Column */}
        <div className="lg:col-span-4 flex flex-col justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-1">
              Technical & Vocational Streams
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Parallel non-degree skill channels complementing conventional college enrolments
            </p>

            <div className="space-y-3">
              {technicalStreams.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => onSelectTier(tech.level)}
                  className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
                >
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 mb-1 leading-snug">
                    {tech.level}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatEnrolment(tech.val2009, unitMode)}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums text-xs">
                      {tech.growthRate > 0 ? `+${tech.growthRate}%` : 'New category'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">Policy Takeaway:</span>{' '}
            While Primary schooling boasts over 113.8M students, collegiate graduation absorbs 18.4M (16.2% of primary pool), underscoring a massive post-secondary capacity buildout during this reporting decade.
          </div>
        </div>
      </div>
    </div>
  );
};
