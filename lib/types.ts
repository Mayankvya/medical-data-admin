export interface MedicalRecord {
  id?: number;
  disease?: string;
  drug?: string;
  medicine?: string;
  tridose?: string;
  pss?: string;
  planet?: string;
  author?: string;
  // Add any other fields you need but these will be the only ones populated
}

export interface DatabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;  
  tableName: string;
}