import '@/app/globals.css';
import { SessionErrorBoundary } from '@/components/session/SessionErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          <SessionErrorBoundary>
            {children}
          </SessionErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}