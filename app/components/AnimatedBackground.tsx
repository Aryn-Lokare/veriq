'use client';

import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fafafa] dark:bg-[#09090b] transition-colors duration-200">
      {/* Subtle Vercel Hairline Spec Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ebebeb_1px,transparent_1px),linear-gradient(to_bottom,#ebebeb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#222225_1px,transparent_1px),linear-gradient(to_bottom,#222225_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 dark:opacity-30 pointer-events-none" />
    </div>
  );
}
