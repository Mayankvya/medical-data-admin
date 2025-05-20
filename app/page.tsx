'use client';

import { useState, useEffect } from 'react';
import UploadForm from '@/components/UploadForm';
import DataPreview from '@/components/DataPreview';
import DataTable from '@/components/DataTable';
import ConfigForm from '@/components/ConfigForm';
import { MedicalRecord, DatabaseConfig } from '@/lib/types';

export default function Home() {
  const [data, setData] = useState<MedicalRecord[]>([]);
  const [config, setConfig] = useState<DatabaseConfig>({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    tableName: process.env.NEXT_PUBLIC_SUPABASE_TABLE || 'home1_duplicate',
  });
  const [activeTab, setActiveTab] = useState<'upload' | 'database'>('upload');

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('supabaseConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Error parsing saved config', e);
      }
    }
  }, []);

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('supabaseConfig', JSON.stringify(config));
  }, [config]);

  const handleDataLoaded = (loadedData: MedicalRecord[]) => {
    setData(loadedData);
  };

  const handleUploadComplete = () => {
    // Clear data and switch to database tab after upload
    setData([]);
    setActiveTab('database');
  };

  return (
    <main>
      <div className="mb-6">
        <ConfigForm config={config} onConfigChange={setConfig} />
      </div>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upload Data
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'database'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Database Records
            </button>
          </nav>
        </div>
        
        {activeTab === 'upload' && (
          <div className="mt-6">
            <UploadForm config={config} onDataLoaded={handleDataLoaded} />
            
            {data.length > 0 && (
              <DataPreview 
                data={data} 
                config={config} 
                onUploadComplete={handleUploadComplete} 
              />
            )}
          </div>
        )}
        
        {activeTab === 'database' && (
          <div className="mt-6">
            <DataTable config={config} />
          </div>
        )}
      </div>
    </main>
  );
}
      