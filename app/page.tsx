'use client';

import { useState, useEffect } from 'react';
import { MedicalRecord } from '@/lib/types';


import BulkPasteForm from '@/components/BulkPasteForm';
import ManualAddForm from '@/components/ManualAddForm';
import CombinedPreview from '@/components/CombinedPreview';

import { fetchRecords } from '@/lib/supabase';
import { supabaseConfig } from '@/lib/config';

export default function Dashboard() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [fetched, setFetched] = useState<MedicalRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'csv' | 'manual' | 'fetch' | 'bulk'>('csv');

  useEffect(() => {
    if (activeTab === 'fetch') {
      fetchRecords(supabaseConfig)
        .then(({ data }) => setFetched(data ?? []))
        .catch((e) => console.error('Error fetching records:', e));
    }
  }, [activeTab]);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Medical Records Dashboard</h1>

      {/* Tabs */}
      <nav className="flex space-x-4 border-b pb-2 mb-6">
        <button
          onClick={() => setActiveTab('csv')}
          className={`px-4 py-2 font-medium ${activeTab === 'csv' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          CSV Upload
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 font-medium ${activeTab === 'bulk' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Bulk Paste
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 font-medium ${activeTab === 'manual' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Manual Add
        </button>
        <button
          onClick={() => setActiveTab('fetch')}
          className={`px-4 py-2 font-medium ${activeTab === 'fetch' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Fetch Records
        </button>
      </nav>

      {/* Preview (always visible or just for current data?) */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
        <CombinedPreview
          records={activeTab === 'fetch' ? fetched : records}
        />
      </section>

      {/* Tab Content */}
      <section>
        {activeTab === 'csv' && (
          <CsvUploadForm setRecords={setRecords} />
        )}

        {activeTab === 'bulk' && (
          <BulkPasteForm records={records} setRecords={setRecords} />
        )}

        {activeTab === 'manual' && (
          <ManualAddForm records={records} setRecords={setRecords} />
        )}

        {activeTab === 'fetch' && (
          <p className="text-gray-600">Records fetched from database are shown above in the preview.</p>
        )}
      </section>
    </main>
  );
}
