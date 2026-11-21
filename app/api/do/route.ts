import { NextRequest, NextResponse } from 'next/server';
import { masterName, readRows } from '@/lib/sheets';
export const runtime = 'nodejs';
const norm = (s: unknown) => String(s ?? '').trim();
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('do') || '';
  const doNumber = raw.replace(/\D/g, '').slice(-7).padStart(7, '0');
  if (!/^\d{7}$/.test(doNumber)) return NextResponse.json({ error: 'DO harus 7 digit.' }, { status: 400 });
  try {
    const rows = await readRows(`${masterName()}!A:H`);
    if (!rows.length) return NextResponse.json({ error: 'Sheet MASTER_DO kosong atau header belum diisi.' }, { status: 404 });
    const headers = rows[0].map(norm);
    const idx = (names: string[]) => headers.findIndex(h => names.some(n => h.toLowerCase() === n.toLowerCase()));
    const doIdx = idx(['DO','DO Number','D.O']);
    const matching = rows.slice(1).filter(r => norm(r[doIdx]).replace(/\D/g,'').slice(-7).padStart(7,'0') === doNumber);
    if (!matching.length) return NextResponse.json({ error: `DO ${doNumber} tidak ditemukan.` }, { status: 404 });
    const first = matching[0];
    const get = (r: unknown[], names: string[]) => norm(r[idx(names)]);
    const items = matching.map(r => ({ sku: get(r,['SKU','Barcode']), name: get(r,['Nama Barang','Name','Nama']), shelf: get(r,['SHELF','Location','Lokasi']), systemQty: Number(get(r,['Qty Sistem','System Qty','Qty'])) || 0 }));
    return NextResponse.json({ doNumber, date: get(first,['Date','Tanggal']), remark: get(first,['Remark','Remarks','Keterangan']), ctn: get(first,['CTN','Carton']), items, totalItem: items.length });
  } catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : 'Gagal membaca Google Sheet.' }, { status: 500 }); }
}
