import Home from '@/app/(home)/components/Home';
// import TestC from '@/app/(home)/TestC';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  // if (!session?.accessToken) {
  //   throw new Error('no session token, please login');
  // }
  console.log('access ', session?.accessToken);

  if (session?.accessToken) {
    return (
      <>
        {/* <TestC /> */}
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
