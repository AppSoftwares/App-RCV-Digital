import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  step: number;
  total: number;
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step, total, progress }) => (
  <div className="mb-10">
    <div className="flex justify-between items-center mb-3">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{step} / {total} ETAPAS</span>
      <span className="text-xs font-bold text-brand-primary">{progress}%</span>
    </div>
    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full transition-all duration-500"
      />
    </div>
  </div>
);
