export const profileRelations = [
  'links',
  'skills',
  'experience',
  'projects',
] as const;

export type ProfileRelation = (typeof profileRelations)[number];
export type ProfileSelection = Record<ProfileRelation, boolean>;

export type ProfileRecord = {
  id: string;
  name: string;
  description: string;
  links?: { label: string; url: string }[];
  skills?: { name: string }[];
  experience?: {
    company: string;
    position: string;
    startedAt: Date;
    endedAt: Date | null;
    achievements: string[];
  }[];
  projects?: { name: string; url: string }[];
};
