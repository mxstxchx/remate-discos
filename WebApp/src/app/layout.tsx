import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '../components/providers/SessionProvider';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Remate Discos',
  description: 'Browse and reserve vinyl records',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={cn(
        inter.className,
        'min-h-screen bg-background font-sans antialiased'
      )}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}