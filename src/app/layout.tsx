import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { getRootClassName } from '@gravity-ui/uikit/server';
import { headers } from 'next/headers';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import './globals.css';
import { GravityThemeProvider } from '@/components/gravity-theme-provider/gravity-theme-provider';
import { AuthModalsProvider } from '@/components/auth/auth-modals-provider';
import { AuthSessionProvider } from '@/components/auth/auth-session-provider';
import Header from '@/components/header/header';
import { gravitySystemThemeInlineScript } from '@/config/gravity-system-theme-script';
import { layoutConfig } from '@/config/layout.config';
import { appConfig } from '@/config/app.config';
import { auth } from '@/auth';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const headerList = await headers();
  const clientHintTheme = headerList.get('sec-ch-prefers-color-scheme');
  const ssrTheme =
    clientHintTheme === 'dark'
      ? 'dark'
      : clientHintTheme === 'light'
        ? 'light'
        : 'light';
  const gravityBodyClassName = getRootClassName({ theme: ssrTheme });

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className={gravityBodyClassName}
        style={{ height: `calc(100vh - ${layoutConfig.headerHeight})` }}
      >
        <script
          // До гидрации выставляет тему по prefers-color-scheme, если SSR не угадал
          dangerouslySetInnerHTML={{ __html: gravitySystemThemeInlineScript }}
        />
        <GravityThemeProvider>
          <AuthSessionProvider session={session}>
            <AuthModalsProvider>
              <Header />
              <main className="h-full flex flex-col">{children}</main>
            </AuthModalsProvider>
          </AuthSessionProvider>
        </GravityThemeProvider>
      </body>
    </html>
  );
}
