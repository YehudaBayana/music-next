'use client';
import { signIn } from 'next-auth/react';
import React from 'react';

const Error = () => {
  return <button onClick={() => signIn()}>error</button>;
};

export default Error;
