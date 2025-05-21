// components/CombinedPreview.tsx
'use client';

import { MedicalRecord } from '@/lib/types';

interface CombinedPreviewProps {
  records: MedicalRecord[];
}

export default function CombinedPreview({ records }: CombinedPreviewProps) {
  if (records.length === 0) {
    return <p className="text-gray-500">No records to preview.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded shadow-sm">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Disease</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Drug</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Medicine</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">TriDose</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">PSS</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Planet</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Author</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
          {records.map((record, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="px-4 py-2 text-sm">{record.id ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{record.disease ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{record.drug ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{record.medicine ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{record.tridose ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{record.pss ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{record.planet ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{record.author ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
