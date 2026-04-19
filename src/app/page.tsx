import { LandingPage } from '@/components/landing/landing-page';

/** Залогиненных с `/` уводит middleware — здесь только лендинг для гостей. */
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <LandingPage />;
}
