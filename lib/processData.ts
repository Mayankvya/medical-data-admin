import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { MedicalRecord } from './types';

// Define interface for PapaParse results
interface PapaParseResult {
  data: Record<string, string>[];
  errors: any[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
  };
}

export const processExcelFile = (file: File): Promise<MedicalRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to CSV for easier processing with Papa Parse
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results: PapaParseResult) => {
            const records = results.data.map((row: Record<string, string>) => {
              // Extract only the fields we need
              return {
                disease: row.disease || row.Disease || '',
                drug: row.drug || row.Drug || '',
                medicine: row.medicine || row.Medicine || '',
                tridose: row.tridose || row.Tridose || '',
                pss: row.pss || row.Pss || '',
                planet: row.planet || row.Planet || '',
                author: row.author || row.Author || ''
              };
            });
            resolve(records);
          },
          error: (error: Error) => {
            reject(error);
          }
        });
      } catch (error: unknown) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    };
    
    reader.onerror = (event: ProgressEvent<FileReader>) => reject(new Error('File reading error'));
    reader.readAsBinaryString(file);
  });
};

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};