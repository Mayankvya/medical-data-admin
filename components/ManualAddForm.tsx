'use client';

import { useState } from 'react';
import { MedicalRecord } from '@/lib/types';

type ManualAddFormProps = {
  records: MedicalRecord[];
  setRecords: React.Dispatch<React.SetStateAction<MedicalRecord[]>>;
};

const emptyRecord: MedicalRecord = {
  disease: '',
  drug: '',
  medicine: '',
  tridose: '',
  pss: '',
  planet: '',
  author: '',
};

export default function ManualAddForm({ records, setRecords }: ManualAddFormProps) {
  const [formData, setFormData] = useState<MedicalRecord>(emptyRecord);

  const handleChange = (field: keyof MedicalRecord, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddRecord = () => {
    // Safely check if any field has a value (string or number)
    const hasValue = Object.values(formData).some((v) =>
      typeof v === 'string' ? v.trim() !== '' : v !== undefined && v !== null,
    );

    if (hasValue) {
      setRecords([...records, formData]);
      setFormData(emptyRecord);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-full">
      <h2 className="text-xl font-semibold mb-5 text-black">Add Manual Record</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(emptyRecord) as (keyof MedicalRecord)[]).map((field) => (
          <div key={field} className="flex flex-col">
            <label
                htmlFor={String(field)}
              className="mb-1 font-medium text-black capitalize"
            >
              {field}
            </label>
            <input
              id={String(field)}
              type="text"
              value={formData[field] ?? ''}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={`Enter ${field}`}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleAddRecord}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add Record
      </button>
    </div>
  );
}
