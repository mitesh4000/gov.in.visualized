export interface ApiField {
  id: string;
  name: string;
  type: string;
}

export interface TargetBucket {
  index: string;
  type: string;
  field: string;
}

export interface EducationRecord {
  education_level_all_figures_in_000_: string;
  enrolment_1995_96_: number | string; // Can be "NA"
  enrolment_2007_08_: number | string;
  enrolment___2009_10: number | string;
  enrolment_growth_rate_: number | string;
}

export interface EducationApiResponse {
  index_name: string;
  title: string;
  desc: string;
  org_type: string;
  org: string[];
  sector: string[];
  source: string;
  catalog_uuid: string;
  visualizable: string;
  active: string;
  created: number;
  updated: number;
  created_date: string;
  updated_date: string;
  external_ws: number;
  external_ws_url: string;
  target_bucket: TargetBucket;
  field: ApiField[];
  message: string;
  version: string;
  status: string;
  total: number;
  count: number;
  limit: string;
  offset: string;
  records: EducationRecord[];
}

export type UnitMode = 'millions' | 'indian_lakh_crore' | 'thousands' | 'headcount';

export interface ProcessedRecord {
  id: string;
  level: string;
  category: 'School' | 'Higher';
  orderIndex: number;
  val1995: number | null;
  val2007: number;
  val2009: number;
  growthRate: number;
  absChangeSince1995: number | null;
  percentChangeSince1995: number | null;
  absChangeSince2007: number;
  percentChangeSince2007: number;
}
