'use client';

import React, { useState, useEffect } from 'react';
import { MedicalRecord, DatabaseConfig } from '@/lib/types';
import { fetchRecords} from '@/lib/supabase';

interface DataTableProps {
  config: DatabaseConfig;
}

export default function DataTable({ config }: DataTableProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 20;

  const loadRecords = async () => {
    try {
      setLoading(true);
      const { data, count } = await fetchRecords(config, page, pageSize);
      setRecords(data || []);
      setTotalRecords(count || 0);
      setError(null);
    } catch (err) {
      setError('Error loading records: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [page, config]);

  // const handleDelete = async (id: number) => {
  //   if (!window.confirm('Are you sure you want to delete this record?')) {
  //     return;
  //   }

  //   try {
  //     await deleteRecord(config, id);
  //     loadRecords();
  //   } catch (err) {
  //     setError('Error deleting record: ' + (err instanceof Error ? err.message : String(err)));
  //   }
  // };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Database Records</h2>
        <button 
          onClick={loadRecords}
          className="py-1 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tridose</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PSS</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planet</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.id ?? ""}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.disease ?? ""}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.drug ?? ""}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.medicine ?? ""}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.tridose ?? ""}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.pss ?? ""}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.planet ?? ""}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{record.author ?? ""}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <button
                        // onClick={() => record.id && handleDelete(record.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-700">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalRecords)} of {totalRecords} records
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="py-1 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="py-1 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
