'use server';
import CanvasAnimation from '@/app/(home)/components/landingPage/CanvasAnimation';
import SignInButton from '@/components/SignInButton';
import Image from 'next/image';

const LandingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        position: 'relative',
        padding: 0,
        margin: 0,
        maxWidth: '100%',
        overflow: 'hidden',
        background: 'black',
      }}
    >
      {/* Canvas Animation (Client Component) */}
      <CanvasAnimation />

      {/* Left Image */}
      <Image
        src='/images/zikup_singer_1.png'
        alt='Left Side Image'
        width={500}
        height={500}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: 'auto',
        }}
      />

      {/* Right Image */}
      <Image
        src='/images/zikup_singer_2.png'
        alt='Right Side Image'
        width={500}
        height={500}
        style={{
          position: 'absolute',
          right: 0,
          top: 90,
          height: '80%',
          width: 'auto',
        }}
      />

      {/* Main Content */}
      <h2 className='-mt-40 text-5xl text-cyan-50'>Welcome to Our Platform</h2>
      <h6 className='my-10 text-2xl text-cyan-50'>
        Explore our features and start your journey with us.
      </h6>
      <SignInButton />
    </div>
  );
};

export default LandingPage;
