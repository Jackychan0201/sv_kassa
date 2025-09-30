import Settings from '@/components/organisms/Settings';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

export default async function SettingsPage() {
  const user = await checkAuth();
  return <Settings user={user} />;
}


