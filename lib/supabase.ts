// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { DatabaseConfig, MedicalRecord } from './types';

/** Create a Supabase client, using serviceKey if provided */
export const getSupabaseClient = (config: DatabaseConfig) => 
  createClient(config.url, config.serviceKey ?? config.anonKey);

/** Bulk-insert a chunk of records */
export const uploadChunk = async (
  config: DatabaseConfig,
  records: MedicalRecord[],
) => {
  if (!records || records.length === 0) {
    console.warn('No records to upload');
    return;
  }

  const supabase = getSupabaseClient(config);
  
  const { data, error, status, statusText } = await supabase
    .from(config.tableName)
    .insert(records)
    .select(); // Optional: return the inserted records
  
  if (error) {
    console.error('status', status, 'statusText', statusText);
    console.error('error', error);
    throw error;
  }
  
  return data;
};

/** Fetch paginated records */
export const fetchRecords = async (
  config: DatabaseConfig,
  page = 1,
  pageSize = 50,
) => {
  const supabase = getSupabaseClient(config);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await supabase
    .from(config.tableName)
    .select('*', { count: 'exact' })
    .range(from, to);
  
  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }
  return { data, count };
};

/** Delete one record by primary-key `id` */
export const deleteRecord = async (
  config: DatabaseConfig,
  id: number,
) => {
  const supabase = getSupabaseClient(config);
  
  const { error } = await supabase
    .from(config.tableName)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }
  return true;
};