import { auth } from '@/auth';
import { LandingPage } from '@/components/landing/landing-page';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return <LandingPage />;
}
