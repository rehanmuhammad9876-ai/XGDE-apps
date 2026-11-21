import { NextRequest, NextResponse } from 'next/server';
import { appendRows, scanName } from '@/lib/sheets';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const doNumber = String(body.doNumber || '').replace(/\D/g,'').slice(-7).padStart(7,'0');
    if (!/^\d{7}$/.test(doNumber) || !Array.isArray(body.items) || !body.items.length) return NextResponse.json({ error: 'Payload DO/items tidak valid.' }, { status: 400 });
    const stamp = new Date().toISOString();
    const rows = body.items.map((item: any) => [stamp, doNumber, String(item.sku || ''), String(item.name || ''), String(item.shelf || ''), Number(item.systemQty || 0), Number(item.scanQty || 0), String(body.scanner || ''), String(item.status || 'OK'), String(body.documentType || 'B')]);
    await appendRows(`${scanName()}!A:J`, rows);
    return NextResponse.json({ success: true, message: 'Tersimpan ke Google Sheet via Vercel', count: rows.length });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'Gagal menyimpan ke Google Sheet.' }, { status: 500 }); }
}
