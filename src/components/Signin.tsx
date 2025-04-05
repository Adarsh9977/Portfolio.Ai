'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';

const SignIn = () => {
  // const router = useRouter();
  const handleGitHubSignIn = async () => {
    try {
      await signIn('github', {
        redirect: true,
        callbackUrl: `http://localhost:3000/generate-portfolio`,
      });
      toast.success('Successfully signed in with GitHub!')
    } catch (error) {
      console.error('GitHub sign-in failed:', error);
      toast.error('Failed to sign in with GitHub.');
    }
  };

  return (
    <div className="w-sm max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign In with GitHub</h2>

      <Button
        onClick={handleGitHubSignIn}
        className="w-full py-3 bg-black text-white font-semibold rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
      >
        Sign in with GitHub
      </Button>
    </div>
  );
};

export default SignIn;
