'use client';

import { useState } from 'react';
import { MedicalRecord } from '@/lib/types';

interface BulkPasteFormProps {
  records: MedicalRecord[];
  setRecords: React.Dispatch<React.SetStateAction<MedicalRecord[]>>;
}

const fields: (keyof MedicalRecord)[] = [
  'disease',
  'drug',
  'medicine',
  'tridose',
  'pss',
  'planet',
  'author',
];

export default function BulkPasteForm({ records, setRecords }: BulkPasteFormProps) {
  const [bulkInput, setBulkInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBulkInput(e.target.value);
  };

  const handleParse = () => {
    const lines = bulkInput.trim().split('\n');
    const parsed = lines.map((line) => {
      const values = line.split('\t');
      const record: MedicalRecord = {} as MedicalRecord;

      fields.forEach((field, i) => {
        const val = values[i];
        record[field] = typeof val === 'string' ? val.trim() : '';
      });

      return record;
    });
    setRecords([...records, ...parsed]);
  };

  const simulateUpload = () => {
    setLoading(true);
    setProgress(0);

    const total = records.length;
    let uploaded = 0;

    const interval = setInterval(() => {
      uploaded++;
      setProgress(Math.round((uploaded / total) * 100));
      if (uploaded >= total) {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="space-y-4">
      <textarea
        rows={6}
        value={bulkInput}
        onChange={handleChange}
        placeholder="Paste tab-separated records here"
        className="w-full border rounded p-3 font-mono"
      />
      <div className="flex gap-4">
        <button
          onClick={handleParse}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Parse Records
        </button>
        {records.length > 0 && (
          <button
            onClick={simulateUpload}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Upload Records
          </button>
        )}
      </div>

      {loading && (
        <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-4"
            style={{ width: `${progress}%`, transition: 'width 0.3s' }}
          ></div>
        </div>
      )}
    </div>
  );
}
