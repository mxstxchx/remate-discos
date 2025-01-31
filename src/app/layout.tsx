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
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionErrorBoundary>
            {children}
          </SessionErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}