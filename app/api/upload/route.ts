// app/api/uploader/route.ts
import { NextResponse } from 'next/server';
import { uploadChunk } from '@/lib/supabase';
// import { DatabaseConfig, MedicalRecord } from '@/lib/types';
import { DatabaseConfig, MedicalRecord } from '@/lib/types';


interface BodyShape {
  config: DatabaseConfig;
  records: MedicalRecord[];
}

function isBodyShape(body: any): body is BodyShape {
  return (
    body &&
    typeof body === 'object' &&
    body.config &&
    Array.isArray(body.records)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!isBodyShape(body)) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    try {
      await uploadChunk(body.config, body.records);
    } catch (e) {
      console.error('Supabase upload error:', e);
      return NextResponse.json(
        { message: e instanceof Error ? e.message : 'Supabase error' },
        { status: 502 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

