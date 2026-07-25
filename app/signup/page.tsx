'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function SignupForm() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      const session = data?.session;
      if (session) {
        router.push('/workspace');
        router.refresh();
      } else {
        setSuccessMsg('Registration successful! Please check your email to confirm your account.');
        setLoading(false);
        setFullName('');
        setEmail('');
        setPassword('');
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-12 font-sans selection:bg-[#d3e5ff]">
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200 via-violet-100 to-transparent opacity-40 blur-[80px]" />

      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/">
            <span className="text-[36px] font-bold tracking-[-0.8px] text-[#171717]">
              Veriq
            </span>
          </Link>
          <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.6px] text-[#171717]">
            Create your account
          </h1>
          <p className="mt-1.5 text-[14px] text-[#8f8f8f]">
            Access autonomous collaborative AI research
          </p>
        </div>

        <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
          {errorMsg && (
            <div className="mb-4 rounded-[6px] border border-[#ee0000]/10 bg-[#ee0000]/5 px-3 py-2.5 text-[13px] text-[#ee0000]">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-[6px] border border-[#0070f3]/10 bg-[#0070f3]/5 px-3 py-2.5 text-[13px] text-[#0070f3]">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-[12px] font-medium uppercase tracking-wider text-[#8f8f8f] mb-1.5 font-mono"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                disabled={loading}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-[14px] text-[#171717] placeholder-[#a1a1a1] transition-colors focus:border-[#171717] focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[12px] font-medium uppercase tracking-wider text-[#8f8f8f] mb-1.5 font-mono"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-[14px] text-[#171717] placeholder-[#a1a1a1] transition-colors focus:border-[#171717] focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[12px] font-medium uppercase tracking-wider text-[#8f8f8f] mb-1.5 font-mono"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 6 characters)"
                className="w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-[14px] text-[#171717] placeholder-[#a1a1a1] transition-colors focus:border-[#171717] focus:outline-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-[40px] w-full items-center justify-center rounded-[6px] bg-[#171717] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#2c2c2c] focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="my-6 flex items-center justify-between">
            <span className="h-[1px] w-full bg-[#ebebeb]"></span>
            <span className="px-3 text-[12px] font-mono text-[#a1a1a1] uppercase">or</span>
            <span className="h-[1px] w-full bg-[#ebebeb]"></span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="flex h-[40px] w-full items-center justify-center rounded-[6px] border border-[#ebebeb] bg-white px-4 text-[14px] font-medium text-[#171717] transition-all hover:bg-[#fafafa] hover:border-[#171717] focus:outline-none disabled:opacity-50"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-6 text-center text-[13px] text-[#4d4d4d]">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#fafafa]">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

