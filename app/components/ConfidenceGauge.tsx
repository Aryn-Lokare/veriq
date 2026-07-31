'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConfidenceBreakdown } from '@/lib/types';
<<<<<<< HEAD
import { ShieldCheck, Info, ChevronDown, Award, AlertTriangle } from 'lucide-react';
=======
import { ShieldCheck, Info, Award, AlertTriangle } from 'lucide-react';
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c

interface ConfidenceGaugeProps {
  confidence: ConfidenceBreakdown;
}

export default function ConfidenceGauge({ confidence }: ConfidenceGaugeProps) {
  const [showMath, setShowMath] = useState(false);
  const score = confidence.finalScore;

  // SVG Gauge Math
<<<<<<< HEAD
  const radius = 70;
  const stroke = 12;
=======
  const radius = 65;
  const stroke = 10;
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

<<<<<<< HEAD
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'stroke-emerald-400 text-emerald-400';
    if (s >= 70) return 'stroke-cyan-400 text-cyan-400';
    if (s >= 50) return 'stroke-amber-400 text-amber-400';
    return 'stroke-rose-400 text-rose-400';
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#121215]/90 p-6 shadow-2xl backdrop-blur-2xl text-center">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
=======
  return (
    <div className="rounded-[16px] border border-[#ebebeb] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-center font-sans">
      <div className="flex items-center justify-between border-b border-[#f2f2f2] dark:border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#171717] dark:text-white" />
          <h3 className="text-[11px] font-mono font-medium text-[#171717] dark:text-white uppercase tracking-wider">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            Overall Confidence Score
          </h3>
        </div>
        <button
          onClick={() => setShowMath(!showMath)}
<<<<<<< HEAD
          className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20"
=======
          className="flex items-center gap-1 font-mono text-[11px] text-[#171717] dark:text-white hover:bg-[#171717] hover:text-white dark:hover:bg-white dark:hover:text-[#171717] bg-[#fafafa] dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-[#ebebeb] dark:border-zinc-700 transition-all"
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
        >
          <Info className="h-3 w-3" /> Math Breakdown
        </button>
      </div>

      {/* Large SVG Circular Gauge */}
      <div className="relative flex items-center justify-center my-4">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90 transform">
          {/* Track Circle */}
          <circle
<<<<<<< HEAD
            stroke="rgba(255, 255, 255, 0.08)"
=======
            stroke="currentColor"
            className="text-[#f2f2f2] dark:text-zinc-800"
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Animated Value Circle */}
          <motion.circle
            stroke="currentColor"
<<<<<<< HEAD
=======
            className="text-[#171717] dark:text-white"
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
<<<<<<< HEAD
            className={getScoreColor(score)}
=======
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
<<<<<<< HEAD
            className={`text-4xl font-extrabold tracking-tight ${getScoreColor(score)}`}
          >
            {score}%
          </motion.span>
          <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Verified Trust</span>
=======
            className="text-4xl font-extrabold tracking-tighter text-[#171717] dark:text-white"
          >
            {score}%
          </motion.span>
          <span className="text-[10px] font-mono text-[#8f8f8f] dark:text-zinc-400 uppercase font-medium">Verified Score</span>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
        </div>
      </div>

      {/* Explanation Text */}
<<<<<<< HEAD
      <p className="text-xs text-zinc-300 font-sans leading-relaxed mt-2 text-left bg-white/5 p-3 rounded-2xl border border-white/5">
=======
      <p className="text-[13px] text-[#4d4d4d] dark:text-zinc-300 leading-relaxed mt-2 text-left bg-[#fafafa] dark:bg-zinc-800/60 p-3.5 rounded-[12px] border border-[#ebebeb] dark:border-zinc-800">
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
        {confidence.explanation}
      </p>

      {/* Algorithmic Breakdown Accordion */}
      {showMath && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
<<<<<<< HEAD
          className="mt-4 border-t border-white/10 pt-3 text-left space-y-2 text-xs font-mono"
        >
          <div className="text-[11px] font-bold text-white mb-1">Explainable Formula Factors:</div>

          <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
            <span className="text-zinc-400">Base Certainty Score</span>
            <span className="font-bold text-white">+50</span>
          </div>

          <div className="flex justify-between items-center bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-300">
            <span className="flex items-center gap-1">
              <Award className="h-3 w-3" /> Trusted Sources (+10 ea, max +30)
            </span>
            <span className="font-bold">+{confidence.trustedSourceBonus}</span>
          </div>

          <div className="flex justify-between items-center bg-purple-500/10 p-2 rounded-xl border border-purple-500/20 text-purple-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Peer-Reviewed / Gov Bonus
            </span>
            <span className="font-bold">+{confidence.peerReviewedBonus}</span>
          </div>

          {confidence.contradictionPenalty !== 0 && (
            <div className="flex justify-between items-center bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 text-rose-300">
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Contradiction Discrepancy Penalty
              </span>
              <span className="font-bold">{confidence.contradictionPenalty}</span>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-white/10 pt-2 font-bold text-sm text-white">
            <span>Final Clamped Score (0-100)</span>
            <span className={getScoreColor(score)}>{score}%</span>
=======
          className="mt-4 border-t border-[#ebebeb] dark:border-zinc-800 pt-3 text-left space-y-2 text-[12px] font-mono text-[#4d4d4d] dark:text-zinc-300"
        >
          <div className="flex justify-between py-1 border-b border-[#f2f2f2] dark:border-zinc-800">
            <span>Base Model Certainty:</span>
            <span className="font-bold text-[#171717] dark:text-white">+{confidence.baseScore}%</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f2f2f2] dark:border-zinc-800">
            <span>Trusted Sources Bonus:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">+{confidence.trustedSourceBonus}%</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f2f2f2] dark:border-zinc-800">
            <span>Gov/Academic .edu Bonus:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">+{confidence.peerReviewedBonus}%</span>
          </div>
          {confidence.contradictionPenalty < 0 && (
            <div className="flex justify-between py-1 border-b border-[#f2f2f2] dark:border-zinc-800 text-rose-600 dark:text-rose-400">
              <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Contradiction Penalty:</span>
              <span className="font-bold">{confidence.contradictionPenalty}%</span>
            </div>
          )}
          <div className="flex justify-between py-1 pt-2 text-[#171717] dark:text-white font-bold text-[13px]">
            <span>Final Clamped Score:</span>
            <span className="flex items-center gap-1 text-[#171717] dark:text-white"><Award className="h-4 w-4" /> {confidence.finalScore}%</span>
>>>>>>> b794ed2ace0d8b7c8266a346a8470e01ac3f119c
          </div>
        </motion.div>
      )}
    </div>
  );
}
