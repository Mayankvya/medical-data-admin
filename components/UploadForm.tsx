'use client';

import React, { useState } from 'react';
import { processExcelFile } from '@/lib/processData';
import { MedicalRecord, DatabaseConfig } from '@/lib/types';

interface UploadFormProps {
  config: DatabaseConfig;
  onDataLoaded: (data: MedicalRecord[]) => void;
}

export default function UploadForm({ config, onDataLoaded }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      const data = await processExcelFile(file);
      onDataLoaded(data);
      setLoading(false);
    } catch (err) {
      setError('Error processing file: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading || !file}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Process Data'}
        </button>
      </form>
    </div>
  );
}