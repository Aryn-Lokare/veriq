'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, Sparkles, User } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  provider?: string;
}

export default function WorkspacePage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Verify auth session
  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setProfile({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || 'Researcher',
        provider: user.app_metadata?.provider || 'email',
      });
      setLoadingAuth(false);
    }
    checkUser();
  }, [router]);

  // Logout Handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#171717] border-t-transparent" />
          <span className="text-[13px] font-mono text-[#8f8f8f] uppercase tracking-wider">
            Loading Workspace...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 font-sans selection:bg-[#d3e5ff] overflow-hidden">
      {/* Decorative background bloom mesh gradient */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-200/40 via-violet-100/30 to-[#fafafa] opacity-70 blur-[100px]" />

      <div className="w-full max-w-[440px] text-center">
        {/* Workspace Card */}
        <div className="relative overflow-hidden rounded-[16px] border border-[#ebebeb] bg-white/80 p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.03)] backdrop-blur-md">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400" />

          <div className="mb-6 flex justify-center">
            <span className="text-[32px] font-bold tracking-[-0.8px] text-[#171717]">
              Veriq
            </span>
          </div>

          {/* Welcome Message */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50/50 px-3 py-0.5 text-[11px] font-medium text-violet-700 font-mono mb-4">
            <Sparkles className="h-3 w-3" />
            Verified Session
          </div>

          <h1 className="text-[26px] font-bold tracking-[-0.8px] text-[#171717] leading-tight">
            Welcome to Veritas AI
          </h1>
          <p className="mt-2 text-[14px] text-[#8f8f8f]">
            You have successfully logged in to your research workspace.
          </p>

          {/* User Details Box */}
          <div className="my-6 rounded-[10px] border border-[#ebebeb] bg-[#fafafa]/50 p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[#171717] truncate">
                  {profile?.full_name}
                </p>
                <p className="text-[12px] text-[#8f8f8f] truncate">{profile?.email}</p>
              </div>
            </div>

            <div className="mt-3.5 border-t border-[#ebebeb]/60 pt-3 flex items-center justify-between text-[11px] font-mono text-[#a1a1a1]">
              <span>AUTH PROVIDER</span>
              <span className="rounded bg-white border border-[#ebebeb] px-1.5 py-0.5 uppercase text-[#4d4d4d] font-semibold">
                {profile?.provider}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex h-[40px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#171717] px-4 text-[14px] font-medium text-white transition-all hover:bg-[#2c2c2c] hover:shadow-sm focus:outline-none"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Small footer brand label */}
        <p className="mt-6 text-[12px] font-mono text-[#a1a1a1] uppercase tracking-wider">
          Veritas AI • Enterprise Agent Network
        </p>
      </div>
    </div>
  );
}
