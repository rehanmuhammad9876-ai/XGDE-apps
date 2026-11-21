import { NextResponse } from 'next/server';
import { readRows, scanName } from '@/lib/sheets';
export const runtime = 'nodejs';
export async function GET() {
  try { const rows = await readRows(`${scanName()}!A:J`); return NextResponse.json({ rows: rows.slice(1).reverse().slice(0,500) }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'Gagal membaca history.' }, { status: 500 }); }
}
