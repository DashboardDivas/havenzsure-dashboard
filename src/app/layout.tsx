import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/layout/Providers';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'HavenzSure',
  description: 'MUI + Next.js prototype',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
