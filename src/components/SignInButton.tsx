'use client';

import { signIn } from 'next-auth/react';

const SignInButton: React.FC = () => {
  return (
    <button
      onClick={() => signIn()}
      className='px-4 py-2 bg-white text-black rounded-md'
    >
      Sign in
    </button>
  );
};

export default SignInButton;
