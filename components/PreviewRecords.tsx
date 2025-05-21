import React from 'react';
import { MedicalRecord } from '@/lib/types';

interface PreviewRecordsProps {
  records: MedicalRecord[];
  selectedIds: number[];
  onToggleSelect: (id: number | undefined) => void;
}

export default function PreviewRecords({ records, selectedIds, onToggleSelect }: PreviewRecordsProps) {
  if (records.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="font-semibold text-lg mb-3 text-gray-800">Preview Records</h2>
      <div className="overflow-auto max-h-72 border border-gray-300 rounded bg-white shadow-sm">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {/* Checkbox header */}
              <th className="px-3 py-2 border-b border-gray-300 text-gray-700 text-center">
                Select
              </th>
              {/* Other headers excluding 'id' */}
              {Object.keys(records[0])
                .filter(key => key !== 'id')
                .map(key => (
                  <th
                    key={key}
                    className="px-3 py-2 border-b border-gray-300 text-gray-700"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, i) => (
              <tr
                key={record.id ?? i}
                className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                {/* Checkbox cell */}
                <td className="px-3 py-2 border-b border-gray-200 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(record.id!)}
                    onChange={() => onToggleSelect(record.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>

                {/* Other cells */}
                {Object.keys(record)
                  .filter(field => field !== 'id')
                  .map(field => (
                    <td key={field} className="px-3 py-2 border-b border-gray-200">
                      {record[field as keyof MedicalRecord] || '-'}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
