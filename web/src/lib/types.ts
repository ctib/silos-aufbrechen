// TypeScript-Interfaces für alle Supabase-Datenstrukturen
// Abgeleitet aus web/supabase/001_initial_schema.sql

export type UserRole = 'gast' | 'teilnehmer' | 'studi' | 'admin' | 'orga';
export type CallType = 'call_for_papers' | 'funding' | 'conference' | 'journal' | 'other';
export type NoteSection = 'ideensammlung' | 'voting' | 'ausformulierung' | 'action_items' | 'protokoll' | 'offene_notizen';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  background: string | null;
  show_name_public: boolean;
  gdpr_consent: boolean;
  gdpr_consent_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkshopTable {
  id: string;
  number: number;
  title: string;
  description: string | null;
  capacity: number;
  is_active: boolean;
  created_at: string;
}

export interface Registration {
  id: string;
  profile_id: string;
  attends_lecture: boolean;
  attends_workshop: boolean;
  attends_dinner: boolean;
  dinner_dietrichsdorf: boolean;
  dinner_hbf: boolean;
  dinner_ausklang: boolean;
  companion_count: number;
  companion_under_16: boolean;
  companion_under_12: boolean;
  source: string;
  created_at: string;
  updated_at: string;
  // Joined relations (optional)
  profiles?: Pick<Profile, 'full_name' | 'email'>;
  workshop_tables?: Pick<WorkshopTable, 'number' | 'title'>;
}

export interface TableAssignment {
  id: string;
  table_id: string;
  profile_id: string;
  assigned_by: string | null;
  created_at: string;
  // Joined relations (optional)
  profiles?: Pick<Profile, 'full_name' | 'email' | 'role'>;
  workshop_tables?: Pick<WorkshopTable, 'number' | 'title'>;
}

export interface ResearchCall {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  deadline: string | null;
  call_type: CallType;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations (optional)
  call_table_tags?: { table_id: string }[];
}

export interface TableNote {
  id: string;
  table_id: string;
  section: NoteSection;
  content: string;
  last_edited_by: string | null;
  updated_at: string;
}

export interface NachmeldungRequest {
  id: string;
  name: string;
  email: string;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}
