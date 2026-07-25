'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginContent() {
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

    // Try logging in with a default demo account.
    // If it doesn't exist, we will try to sign it up first, then log in.
    const demoEmail = 'demo@veriq.ai';
    const demoPassword = 'password123';

    let { error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (error) {
      // Try to register the demo account if it doesn't exist
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

      // Try signing in again
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 py-12 font-sans selection:bg-[#d3e5ff]">
      {/* Decorative Top-Middle Mesh Gradient */}
      <div className="absolute top-0 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-200 via-violet-100 to-transparent opacity-40 blur-[80px]" />

      <div className="w-full max-w-[400px]">
        {/* Logo and Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/">
            <span className="text-[36px] font-bold tracking-[-0.8px] text-[#171717]">
              Veriq
            </span>
          </Link>
          <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.6px] text-[#171717]">
            Log in to Veriq
          </h1>
        </div>

        {/* Auth Card */}
        <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 shadow-[0px_1px_1px_rgba(0,0,0,0.04)]">
          {errorMsg && (
            <div className="mb-4 rounded-[6px] border border-[#ee0000]/10 bg-[#ee0000]/5 px-3 py-2.5 text-[13px] text-[#ee0000]">
              {errorMsg}
            </div>
          )}

          {infoMsg && (
            <div className="mb-4 rounded-[6px] border border-[#0070f3]/10 bg-[#0070f3]/5 px-3 py-2.5 text-[13px] text-[#0070f3]">
              {infoMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-[12px] font-medium uppercase tracking-wider text-[#8f8f8f] font-mono"
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
                className="w-full rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-[14px] text-[#171717] placeholder-[#a1a1a1] transition-colors focus:border-[#171717] focus:outline-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-[40px] w-full items-center justify-center rounded-[6px] bg-[#171717] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#2c2c2c] focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center justify-between">
            <span className="h-[1px] w-full bg-[#ebebeb]"></span>
            <span className="px-3 text-[12px] font-mono text-[#a1a1a1] uppercase">or</span>
            <span className="h-[1px] w-full bg-[#ebebeb]"></span>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mb-3 flex h-[40px] w-full items-center justify-center rounded-[6px] border border-[#ebebeb] bg-white px-4 text-[14px] font-medium text-[#171717] transition-all hover:bg-[#fafafa] hover:border-[#171717] focus:outline-none disabled:opacity-50"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" width="16" height="16">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Quick Demo Sign In */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="flex h-[40px] w-full items-center justify-center rounded-[6px] border border-[#ebebeb] bg-white px-4 text-[14px] font-medium text-[#171717] transition-all hover:bg-[#fafafa] hover:border-[#171717] focus:outline-none disabled:opacity-50"
          >
            Sign in with Demo Account
          </button>
        </div>

        {/* Footer Links */}
        <p className="mt-6 text-center text-[13px] text-[#4d4d4d]">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors"
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
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa]">
        <div className="text-[14px] text-[#8f8f8f]">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
