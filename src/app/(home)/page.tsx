import Home from '@/app/(home)/components/Home';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return <h1>no session token, please login</h1>;
  }
  if (session) {
    return (
      <>
        <Home accessToken={session.accessToken} />
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
