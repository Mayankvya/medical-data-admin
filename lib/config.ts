// lib/config.ts
import { DatabaseConfig } from './types';

export const supabaseConfig: DatabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  tableName: 'home1_duplicate', // Must match your existing table name
};
