// import React, { useEffect, useState } from "react";

// export interface DatabaseConfig {
//   url: string;
//   anonKey: string;
//   serviceKey: string;
// }

// interface ConfigFormProps {
//   /** Initial or persisted config coming from the parent */
//   config: Partial<DatabaseConfig>;
//   /** Called whenever the user edits a field */
//   onChange?: (config: DatabaseConfig) => void;  // made optional
// }

// const ConfigForm: React.FC<ConfigFormProps> = ({
//   config,
//   onChange = () => {},  // default no-op function
// }) => {
//   // Always coerce undefined → "" so inputs stay controlled
//   const sanitize = (c: Partial<DatabaseConfig>): DatabaseConfig => ({
//     url:        c.url        ?? "",
//     anonKey:    c.anonKey    ?? "",
//     serviceKey: c.serviceKey ?? "",
//   });

//   /** Local editable copy of the config */
//   const [formConfig, setFormConfig] = useState<DatabaseConfig>(() =>
//     sanitize(config)
//   );

//   /** Keep local state in sync if parent prop changes */
//   useEffect(() => {
//     setFormConfig(sanitize(config));
//   }, [config]);

//   /** Handle <input> edits */
//   const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
//     const { name, value } = e.target;
//     setFormConfig((prev) => {
//       const next = { ...prev, [name]: value };
//       onChange(next);        // bubble up instantly
//       return next;
//     });
//   };

//   return (
//     <form className="space-y-4">
//       {/* Supabase URL */}
//       <div>
//         <label htmlFor="url" className="block text-sm font-medium text-gray-700">
//           Supabase URL
//         </label>
//         <input
//           id="url"
//           name="url"
//           type="text"
//           value={formConfig.url}
//           onChange={handleChange}
//           placeholder="https://xyzcompany.supabase.co"
//           className="w-full p-2 border border-gray-300 rounded-md"
//           required
//         />
//       </div>

//       {/* Anon Key */}
//       <div>
//         <label
//           htmlFor="anonKey"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Anon Key
//         </label>
//         <input
//           id="anonKey"
//           name="anonKey"
//           type="text"
//           value={formConfig.anonKey}
//           onChange={handleChange}
//           placeholder="public-anon-key"
//           className="w-full p-2 border border-gray-300 rounded-md"
//           required
//         />
//       </div>

//       {/* Service Key */}
//       <div>
//         <label
//           htmlFor="serviceKey"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Service Key
//         </label>
//         <input
//           id="serviceKey"
//           name="serviceKey"
//           type="text"
//           value={formConfig.serviceKey}
//           onChange={handleChange}
//           placeholder="service-role-key"
//           className="w-full p-2 border border-gray-300 rounded-md"
//           required
//         />
//       </div>
//     </form>
//   );
// };

// export default ConfigForm;

// components/ConfigForm.tsx

'use client';

import React from 'react';
import { DatabaseConfig } from '@/lib/types';

interface ConfigFormProps {
  config: DatabaseConfig;
  onConfigChange: (newConfig: DatabaseConfig) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ config, onConfigChange }) => {
  const handleChange = (field: keyof DatabaseConfig, value: string) => {
    onConfigChange({ ...config, [field]: value });
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Supabase Configuration</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Supabase URL</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={config.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://your-project.supabase.co"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Anon Key</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={config.anonKey}
          onChange={(e) => handleChange('anonKey', e.target.value)}
          placeholder="Your anon/public key"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Service Key (Optional)</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={config.serviceKey ?? ''}
          onChange={(e) => handleChange('serviceKey', e.target.value)}
          placeholder="Your service key (optional)"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Table Name</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={config.tableName}
          onChange={(e) => handleChange('tableName', e.target.value)}
          placeholder="e.g., medical_records"
        />
      </div>
    </div>
  );
};

export default ConfigForm;
