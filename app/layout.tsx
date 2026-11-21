import type { Metadata } from 'next';
import './globals.css';
import PwaRegister from './pwa-register';
export const metadata: Metadata = { title: 'XGDE Apps', description: 'Warehouse PDA scanner', manifest: '/manifest.json', appleWebApp: { capable: true, statusBarStyle: 'default', title: 'XGDE Apps' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body><PwaRegister />{children}</body></html>; }
