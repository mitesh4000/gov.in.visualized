import { EducationApiResponse, EducationRecord, ProcessedRecord, UnitMode } from '../types/education';

export function parseNumericValue(val: number | string | undefined | null): number | null {
  if (val === undefined || val === null || val === 'NA' || val === 'N/A' || val === '') {
    return null;
  }
  const parsed = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''));
  return isNaN(parsed) ? null : parsed;
}

export function formatEnrolment(
  valueInThousands: number | null | undefined,
  mode: UnitMode,
  decimals: number = 2
): string {
  if (valueInThousands === null || valueInThousands === undefined) {
    return 'N/A';
  }

  // Raw headcount
  const headcount = valueInThousands * 1000;

  switch (mode) {
    case 'millions': {
      const millions = valueInThousands / 1000;
      if (millions >= 100) return `${millions.toFixed(1)} M`;
      if (millions >= 1) return `${millions.toFixed(decimals)} M`;
      if (millions >= 0.01) return `${millions.toFixed(2)} M`;
      return `${millions.toFixed(3)} M`;
    }
    case 'indian_lakh_crore': {
      // 1 Crore = 10,000,000 headcount = 10,000 in thousands
      // 1 Lakh = 100,000 headcount = 100 in thousands
      if (valueInThousands >= 10000) {
        const crore = valueInThousands / 10000;
        return `${crore.toFixed(decimals)} Cr`;
      } else {
        const lakh = valueInThousands / 100;
        return `${lakh.toFixed(decimals)} L`;
      }
    }
    case 'thousands': {
      return `${valueInThousands.toLocaleString('en-IN', { maximumFractionDigits: 1 })} k`;
    }
    case 'headcount': {
      return Math.round(headcount).toLocaleString('en-IN');
    }
  }
}

export function formatGrowthRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined || rate === 0) {
    return '0.0%';
  }
  return `${rate > 0 ? '+' : ''}${rate.toFixed(1)}%`;
}

export function processRecords(rawRecords: EducationRecord[]): ProcessedRecord[] {
  return rawRecords.map((r, idx) => {
    const levelName = r.education_level_all_figures_in_000_ || `Record ${idx + 1}`;
    const val1995 = parseNumericValue(r.enrolment_1995_96_);
    const val2007 = parseNumericValue(r.enrolment_2007_08_) ?? 0;
    const val2009 = parseNumericValue(r.enrolment___2009_10) ?? 0;
    const growthRate = parseNumericValue(r.enrolment_growth_rate_) ?? 0;

    const isSchool = [
      'Primary',
      'Middle',
      'Secondary',
      'Higher Secondary'
    ].some(k => levelName.toLowerCase().includes(k.toLowerCase()));

    const absChangeSince1995 = val1995 !== null ? val2009 - val1995 : null;
    const percentChangeSince1995 = (val1995 !== null && val1995 > 0)
      ? ((val2009 - val1995) / val1995) * 100
      : null;

    const absChangeSince2007 = val2009 - val2007;
    const percentChangeSince2007 = val2007 > 0
      ? ((val2009 - val2007) / val2007) * 100
      : 0;

    return {
      id: `edu-level-${idx}`,
      level: levelName,
      category: isSchool ? 'School' : 'Higher',
      orderIndex: idx,
      val1995,
      val2007,
      val2009,
      growthRate,
      absChangeSince1995,
      percentChangeSince1995,
      absChangeSince2007,
      percentChangeSince2007,
    };
  });
}

export function computeSummaryMetrics(records: ProcessedRecord[]) {
  const total2009 = records.reduce((sum, r) => sum + r.val2009, 0);
  const total2007 = records.reduce((sum, r) => sum + r.val2007, 0);
  
  // Total 1995 with available baselines
  const recordsWith1995 = records.filter(r => r.val1995 !== null);
  const total1995 = recordsWith1995.reduce((sum, r) => sum + (r.val1995 || 0), 0);

  // Higher ed subset
  const higherEdRecords = records.filter(r => r.category === 'Higher');
  const higherEd2009 = higherEdRecords.reduce((sum, r) => sum + r.val2009, 0);
  const higherEd2007 = higherEdRecords.reduce((sum, r) => sum + r.val2007, 0);
  const higherEd1995 = higherEdRecords.reduce((sum, r) => sum + (r.val1995 || 0), 0);

  // School subset
  const schoolRecords = records.filter(r => r.category === 'School');
  const school2009 = schoolRecords.reduce((sum, r) => sum + r.val2009, 0);
  const school1995 = schoolRecords.reduce((sum, r) => sum + (r.val1995 || 0), 0);

  // Growth rates
  const highestGrowthTier = [...records].sort((a, b) => b.growthRate - a.growthRate)[0];
  const largestEnrolmentTier = [...records].sort((a, b) => b.val2009 - a.val2009)[0];

  const higherEdExpansionRate = higherEd1995 > 0
    ? ((higherEd2009 - higherEd1995) / higherEd1995) * 100
    : 0;

  return {
    total2009,
    total2007,
    total1995,
    higherEd2009,
    higherEd2007,
    higherEd1995,
    school2009,
    school1995,
    higherEdExpansionRate,
    highestGrowthTier,
    largestEnrolmentTier,
    totalRecords: records.length,
    tertiaryShare: total2009 > 0 ? (higherEd2009 / total2009) * 100 : 0
  };
}
