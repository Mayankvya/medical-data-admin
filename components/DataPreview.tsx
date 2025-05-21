"use client";

import React, { useState, useRef } from "react";
import { MedicalRecord, DatabaseConfig } from "@/lib/types";
import { chunkArray } from "@/lib/processData";

interface DataPreviewProps {
  data: MedicalRecord[];
  config: DatabaseConfig;
  onUploadComplete: () => void;
}

export default function DataPreview({ data, config, onUploadComplete }: DataPreviewProps) {
  const [uploading, setUploading] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // timing
  const startedAt = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0); // ms

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(data.length / pageSize);
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize);

  /** Upload data to Supabase in 400‑row chunks */
  const uploadChunks = async () => {
    try {
      setUploading(true);
      setError(null);
      setSuccess(false);
      startedAt.current = Date.now();
      setElapsed(0);

      const chunks = chunkArray(data, 1000);
      setTotalChunks(chunks.length);

      for (let i = 0; i < chunks.length; i++) {
        setCurrentChunk(i + 1);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config, records: chunks[i] }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to upload chunk");
        }

        // update elapsed time every loop
        if (startedAt.current) setElapsed(Date.now() - startedAt.current);

        await new Promise((r) => setTimeout(r, 500)); // polite delay
      }

      setSuccess(true);
      onUploadComplete();
    } catch (e) {
      setError(`Error uploading data: ${e instanceof Error ? e.message : e}`);
    } finally {
      setUploading(false);
      if (startedAt.current) setElapsed(Date.now() - startedAt.current);
    }
  };

  const progress = totalChunks ? Math.round((currentChunk / totalChunks) * 100) : 0;
  const seconds = (elapsed / 1000).toFixed(1);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4">Data Preview</h2>

      {/* Stats */}
      <div className="mb-4 space-y-1">
        <p className="text-gray-700">Total records: {data.length}</p>
        <p className="text-gray-700">Chunk size: 1000 records</p>
        <p className="text-gray-700">Total chunks: {Math.ceil(data.length / 1000)}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              {["Disease", "Drug", "Medicine", "Tridose", "PSS", "Planet", "Author"].map((h) => (
                <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pagedData.map((r, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-sm text-gray-900">{r.disease}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{r.drug}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{r.medicine}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{r.tridose}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{r.pss}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{r.planet}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{r.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <p className="text-gray-500 mt-2 text-center">No records available</p>}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="py-1 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50">
            Previous
          </button>
          <span className="text-gray-700">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="py-1 px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50">
            Next
          </button>
        </div>
      )}

      {/* Alerts */}
      {error && <div className="mt-4 p-2 bg-red-50 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-md">All data uploaded successfully!</div>}

      {/* Progress */}
      {uploading && (
        <div className="mt-4 space-y-1">
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-gray-600">
            Uploading chunk {currentChunk} of {totalChunks} ({progress}% complete) – {seconds}s elapsed
          </p>
        </div>
      )}

      {/* Action */}
      <div className="mt-6">
        <button onClick={uploadChunks} disabled={uploading || success} className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
          {uploading ? "Uploading..." : success ? "Uploaded" : "Upload to Supabase"}
        </button>
      </div>
    </div>
  );
}
