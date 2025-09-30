import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Statistics from '@/components/organisms/Statistics';

async function checkAuth() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('Authentication')?.value;

  const res = await fetch("http://localhost:3000/auth/me", {
    headers: {
      cookie: authToken ? `Authentication=${authToken}` : '',
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/login");
  }

  const user = await res.json();
  return user;
}

export default async function StatisticsPage() {
  const user = await checkAuth();
  return <Statistics user={user} />;
}


