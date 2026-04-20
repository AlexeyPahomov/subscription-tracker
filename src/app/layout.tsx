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
import { NavigationProvider } from '@/components/navigation/navigation-provider';
import { ThemePreferenceProvider } from '@/components/theme/theme-preference-provider';
import Header from '@/components/header/header';
import { resolveTheme } from '@/config/theme-preference';
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
  /** Без чтения cookie темы: иначе Next.js при каждом изменении cookie перезапрашивает RSC и возможен цикл перезагрузок */
  const clientHintTheme = headerList.get('sec-ch-prefers-color-scheme');
  const systemIsDark = clientHintTheme === 'dark';
  const initialResolved = resolveTheme('system', systemIsDark);

  const gravityBodyClassName = getRootClassName({ theme: initialResolved });

  const htmlClassName = [
    geistSans.variable,
    geistMono.variable,
    'h-full antialiased',
    initialResolved === 'dark' ? 'dark' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <html lang="en" className={htmlClassName} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={gravityBodyClassName}
        style={{ minHeight: '100dvh' }}
      >
        <ThemePreferenceProvider initialResolved={initialResolved}>
          <GravityThemeProvider>
            <AuthSessionProvider session={session}>
              <NavigationProvider>
                <AuthModalsProvider>
                  <Header />
                  <main className="flex min-h-0 flex-1 flex-col overflow-x-clip">
                    {children}
                  </main>
                </AuthModalsProvider>
              </NavigationProvider>
            </AuthSessionProvider>
          </GravityThemeProvider>
        </ThemePreferenceProvider>
      </body>
    </html>
  );
}
