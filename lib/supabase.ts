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
    console.error('Supabase insert error:', {
      status,
      statusText,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      full: error,
    });
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

  try {
    const { data, error, count } = await supabase
      .from(config.tableName)
      .select('*', { count: 'exact' })
      .range(from, to);

    if (error) {
      console.error('Supabase fetch error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        full: error,
      });
      throw error;
    }

    return { data, count };
  } catch (e) {
    console.error('Fetch failed:', JSON.stringify(e, null, 2));
    throw e;
  }
};

/** Delete one record by primary-key `id` */
export const deleteRecords = async (
  config: DatabaseConfig,
  ids: number[],
) => {
  if (!ids || ids.length === 0) return;

  const supabase = getSupabaseClient(config);

  const { error } = await supabase
    .from(config.tableName)
    .delete()
    .in('id', ids);

  if (error) {
    console.error('Supabase bulk delete error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      full: error,
    });
    throw error;
  }

  return true;
};