'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    const err = searchParams.get('error');
    if (err) setErrorMsg(err);
    const info = searchParams.get('info');
    if (info) setInfoMsg(info);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/workspace');
      router.refresh();
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

<<<<<<< HEAD
    const demoEmail = 'demo@veritas.ai';
=======
    // Try logging in with a default demo account.
    // If it doesn't exist, we will try to sign it up first, then log in.
    const demoEmail = 'demo@veriq.ai';
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
    const demoPassword = 'password123';

    let { error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (error) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            full_name: 'Demo Researcher',
          },
        },
      });

      if (signUpError) {
        setErrorMsg('Failed to initialize demo account: ' + signUpError.message);
        setLoading(false);
        return;
      }

      const { error: secondTryError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (secondTryError) {
        setErrorMsg('Failed to log in with demo account: ' + secondTryError.message);
        setLoading(false);
        return;
      }
    }

    router.push('/workspace');
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

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
<<<<<<< HEAD
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-12 font-sans selection:bg-[#d3e5ff]">
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200 via-violet-100 to-transparent opacity-40 blur-[80px]" />
=======
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] dark:bg-[#09090b] px-4 py-12 font-sans selection:bg-[#d3e5ff] dark:selection:bg-zinc-800">
      {/* Decorative Top-Middle Mesh Gradient */}
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200 dark:from-zinc-800 via-violet-100 dark:via-zinc-900 to-transparent opacity-40 dark:opacity-20 blur-[80px]" />
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c

      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/">
            <span className="text-[36px] font-bold tracking-[-0.8px] text-[#171717] dark:text-white">
              Veriq
            </span>
          </Link>
<<<<<<< HEAD
          <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.6px] text-[#171717]">
            Log in to Veritas AI
          </h1>
        </div>

        <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
=======
          <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.6px] text-[#171717] dark:text-white">
            Log in to Veriq
          </h1>
        </div>

        {/* Auth Card */}
        <div className="rounded-[12px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          {errorMsg && (
            <div className="mb-4 rounded-[6px] border border-[#ee0000]/10 bg-[#ee0000]/5 px-3 py-2.5 text-[13px] text-[#ee0000]">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 rounded-[6px] border border-[#0070f3]/10 bg-[#0070f3]/5 px-3 py-2.5 text-[13px] text-[#0070f3] dark:text-blue-400">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[12px] font-medium uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400 mb-1.5 font-mono"
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
                className="w-full rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3 py-2 text-[14px] text-[#171717] dark:text-white placeholder-[#a1a1a1] dark:placeholder-zinc-500 transition-colors focus:border-[#171717] dark:focus:border-zinc-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-[12px] font-medium uppercase tracking-wider text-[#8f8f8f] dark:text-zinc-400 font-mono"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-800 px-3 py-2 text-[14px] text-[#171717] dark:text-white placeholder-[#a1a1a1] dark:placeholder-zinc-500 transition-colors focus:border-[#171717] dark:focus:border-zinc-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-[40px] w-full items-center justify-center rounded-[6px] bg-[#171717] dark:bg-white px-4 text-[14px] font-medium text-white dark:text-[#171717] transition-colors hover:bg-[#2c2c2c] dark:hover:bg-zinc-200 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="my-6 flex items-center justify-between">
            <span className="h-[1px] w-full bg-[#ebebeb] dark:bg-zinc-800"></span>
            <span className="px-3 text-[12px] font-mono text-[#a1a1a1] dark:text-zinc-500 uppercase">or</span>
            <span className="h-[1px] w-full bg-[#ebebeb] dark:bg-zinc-800"></span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mb-3 flex h-[40px] w-full items-center justify-center rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-800 px-4 text-[14px] font-medium text-[#171717] dark:text-white transition-all hover:bg-[#fafafa] dark:hover:bg-zinc-700 dark:bg-[#09090b] hover:border-[#171717] dark:hover:border-zinc-500 focus:outline-none disabled:opacity-50"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="flex h-[40px] w-full items-center justify-center rounded-[6px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-800 px-4 text-[14px] font-medium text-[#171717] dark:text-white transition-all hover:bg-[#fafafa] dark:hover:bg-zinc-700 dark:bg-[#09090b] hover:border-[#171717] dark:hover:border-zinc-500 focus:outline-none disabled:opacity-50"
          >
            Sign in with Demo Account
          </button>
        </div>

<<<<<<< HEAD
        <p className="mt-6 text-center text-[13px] text-[#4d4d4d]">
=======
        {/* Footer Links */}
        <p className="mt-6 text-center text-[13px] text-[#4d4d4d] dark:text-zinc-300">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-[#0070f3] dark:text-blue-400 hover:text-[#0761d1] dark:hover:text-blue-300 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
<<<<<<< HEAD
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#fafafa]">Loading...</div>}>
      <LoginForm />
=======
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] dark:bg-[#09090b]">
        <div className="text-[14px] text-[#8f8f8f] dark:text-zinc-400">Loading...</div>
      </div>
    }>
      <LoginContent />
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
    </Suspense>
  );
}

