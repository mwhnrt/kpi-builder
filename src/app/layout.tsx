import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SWRProvider from '@/components/providers/SWRProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KPI Builder',
  description: 'Build and manage your KPIs with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <SWRProvider>
            <ErrorBoundary>
              <ThemeToggle />
              <main className="container mx-auto max-w-5xl px-4 py-8">
                {children}
              </main>
            </ErrorBoundary>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
