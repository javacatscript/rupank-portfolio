export interface HeroContent {
  name: string;
  tagline: string;
}

export interface GearItem {
  id: string;
  name: string;
  type: string;
  icon: string;
}

export interface SystemLogContent {
  lines: string[];
}

export interface ResumeArchiveContent {
  title: string;
  sizeLabel: string;
  format: string;
  downloadName: string;
  fileUrl: string;
  updatedAt?: string;
}

export interface SiteContentBundle {
  hero: HeroContent;
  equipped_gear: GearItem[];
  system_log: SystemLogContent;
  resume_archive: ResumeArchiveContent;
}

export type SiteContentKey = keyof SiteContentBundle;
