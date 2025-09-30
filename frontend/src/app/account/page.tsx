import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Account from '@/components/organisms/Account';

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

export default async function AccountPage() {
  const user = await checkAuth();
  return <Account user={user} />;
}


