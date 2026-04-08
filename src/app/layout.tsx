import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthModalsProvider } from '@/components/auth/auth-modals-provider';
import Header from '@/components/header/header';
import { layoutConfig } from '@/config/layout.config';
import { appConfig } from '@/config/app.config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body style={{ height: `calc(100vh - ${layoutConfig.headerHeight})` }}>
        <AuthModalsProvider>
          <Header />
          <main className="h-full flex flex-col">{children}</main>
        </AuthModalsProvider>
      </body>
    </html>
  );
}
