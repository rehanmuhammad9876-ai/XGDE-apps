# XGDE Apps — warehouse PDA PWA

Next.js App Router + TypeScript, intended for Vercel. Google Sheets integration is through Google APIs and a Service Account (no Apps Script, no `.txt` storage).

## Google Sheet setup
Create a spreadsheet with two tabs and exact names (or configure env):

### `MASTER_DO` columns A:H
`DO | Date | Remark | CTN | SKU | Nama Barang | SHELF | Qty Sistem`

### `SCAN_RESULT` columns A:J
`Timestamp | DO (7 digit) | SKU | Nama Barang | SHELF | Qty Sistem | Qty Scan | Scanner | Status | Document Type`

The service account must have **Editor** access to the spreadsheet. Copy the spreadsheet ID from its URL.

## Vercel deploy
1. Push this project to GitHub.
2. Import the repository in Vercel. Framework should detect Next.js.
3. Add Environment Variables (Production and Preview as needed):
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (paste the private key; preserve newlines or use `\\n` escapes)
   - `SHEET_MASTER_DO=MASTER_DO`
   - `SHEET_SCAN_RESULT=SCAN_RESULT`
4. Redeploy after adding env vars.
5. Install/open the site on Android using Chrome menu → **Add to Home screen** / **Install app**.

## Local run
```bash
cp .env.example .env.local
# fill values
npm install
npm run dev
```

## API
- `GET /api/do?do=0597885`: fetch matching DO and its SKU lines from MASTER_DO.
- `POST /api/scan`: appends submitted rows to SCAN_RESULT. Body `{doNumber, scanner, documentType, items:[{sku,name,shelf,systemQty,scanQty,status}]}`.
- `GET /api/history`: returns recent scan rows.


## Notes / operational checks
- Sheet header names are read case-insensitively. `DO`, `SKU`, `Nama Barang`, `SHELF`, `Qty Sistem` are required for mapping.
- QR scanning reads a QR string and extracts its first 1–7 digit run; confirm your carton QR format matches this before warehouse rollout.
- The app's offline submission queue is stored in browser localStorage and uploads when connectivity returns. The service worker caches the app shell, but offline camera QR scanning requires the scanner library and camera permissions to be available/cached by the browser.
- Scanner identity is currently the configured default `SCANNER 2`; edit it in the QTA screen code if the PDA identity differs.
- This starter is a real API integration, not a simulated sheet: it requires valid Vercel env variables and Google Sheet permissions before API calls will succeed.
