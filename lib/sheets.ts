import { google } from 'googleapis';

function sheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key || !process.env.GOOGLE_SHEET_ID) throw new Error('Google Sheets credentials/env belum lengkap.');
  const auth = new google.auth.JWT({ email, key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  return google.sheets({ version: 'v4', auth });
}
export const sheetId = () => process.env.GOOGLE_SHEET_ID!;
export const masterName = () => process.env.SHEET_MASTER_DO || 'MASTER_DO';
export const scanName = () => process.env.SHEET_SCAN_RESULT || 'SCAN_RESULT';
export async function readRows(range: string) {
  const sheets = sheetsClient();
  const response = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId(), range });
  return response.data.values || [];
}
export async function appendRows(range: string, values: unknown[][]) {
  const sheets = sheetsClient();
  return sheets.spreadsheets.values.append({ spreadsheetId: sheetId(), range, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values } });
}
