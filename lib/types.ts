// export interface MedicalRecord {
//   id?: number;
//   disease?: string;
//   drug?: string;
//   medicine?: string;
//   tridose?: string;
//   pss?: string;
//   planet?: string;
//   author?: string;
//   // Add any other fields you need but these will be the only ones populated
// }

// export interface DatabaseConfig {
//   url: string;
//   anonKey: string;
//   serviceKey?: string;  
//   tableName: string;
// }
// lib/types.ts

export interface MedicalRecord {
  id?: number;
  disease?: string;
  drug?: string;
  medicine?: string;
  tridose?: string;
  pss?: string;
  planet?: string;
  author?: string;
    [key: string]: string | number | undefined; 
}
  // Add any other fields you need but these will be the only ones populated


export interface DatabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;
  tableName: string;
}
