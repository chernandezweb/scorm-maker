import React from 'react';
import { MessageSquare, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

export type CharacterPose = 'neutral' | 'explaining' | 'warning' | 'celebrating' | 'thinking';

interface CharacterProps {
  name: string;
  pose?: CharacterPose;
  speech?: string;
  position?: 'left' | 'right' | 'center' | 'custom';
  x?: number; // 0-100 percentage
  y?: number; // 0-100 percentage
  scale?: number;
  className?: string;
}

export const Character: React.FC<CharacterProps> = ({
  name,
  pose = 'neutral',
  speech,
  position = 'left',
  x,
  y,
  scale = 1,
  className = '',
}) => {
  // Color palette for the illustrated avatar
  const poseMeta = {
    neutral: {
      color: 'from-blue-600 to-indigo-700',
      badge: 'Expert Guide',
      icon: null,
      eyes: '^^',
      mouth: '︶',
      armLeft: 'M 10 70 Q 15 85 20 95',
      armRight: 'M 90 70 Q 85 85 80 95',
    },
    explaining: {
      color: 'from-blue-500 to-cyan-600',
      badge: 'Presenting',
      icon: <Sparkles className="w-3.5 h-3.5 text-cyan-300" />,
      eyes: '••',
      mouth: 'O',
      armLeft: 'M 10 70 Q 5 60 15 50',
      armRight: 'M 90 70 Q 95 85 90 95',
    },
    warning: {
      color: 'from-amber-500 to-rose-600',
      badge: 'Caution!',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-300" />,
      eyes: 'ÒÓ',
      mouth: '―',
      armLeft: 'M 10 70 Q 5 50 15 40',
      armRight: 'M 90 70 Q 95 50 85 40',
    },
    celebrating: {
      color: 'from-emerald-500 to-teal-600',
      badge: 'Success!',
      icon: <Sparkles className="w-3.5 h-3.5 text-yellow-300" />,
      eyes: '★ ★',
      mouth: '▽',
      armLeft: 'M 10 70 Q 0 40 20 25',
      armRight: 'M 90 70 Q 100 40 80 25',
    },
    thinking: {
      color: 'from-purple-600 to-indigo-700',
      badge: 'Analyzing',
      icon: <HelpCircle className="w-3.5 h-3.5 text-purple-300" />,
      eyes: '¬ ¬',
      mouth: '~',
      armLeft: 'M 10 70 Q 25 65 35 55',
      armRight: 'M 90 70 Q 85 85 80 95',
    },
  }[pose];

  // Alignment styles
  const positionClasses = {
    left: 'self-start items-start',
    right: 'self-end items-end',
    center: 'self-center items-center',
    custom: '',
  }[position];

  const customStyle: React.CSSProperties =
    position === 'custom' && x !== undefined && y !== undefined
      ? {
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }
      : {
          transform: `scale(${scale})`,
        };

  return (
    <div
      style={customStyle}
      className={`flex flex-col gap-3 select-none transition-all duration-300 ${positionClasses} ${className}`}
    >
      {/* Speech Bubble */}
      {speech && (
        <div className="relative max-w-md p-4 rounded-2xl bg-slate-800/90 backdrop-blur-md border border-slate-700/80 shadow-xl text-slate-100 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-blue-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{name}</span>
          </div>
          <p>{speech}</p>
          {/* Speech tail */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-slate-800 border-r border-b border-slate-700 transform rotate-45" />
        </div>
      )}

      {/* Illustrated Character Avatar Card */}
      <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 shadow-lg backdrop-blur">
        {/* Vector Avatar */}
        <div className={`relative w-16 h-16 rounded-full bg-gradient-to-tr ${poseMeta.color} p-1 shadow-md shrink-0 flex items-center justify-center overflow-hidden`}>
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            {/* Body */}
            <circle cx="50" cy="40" r="22" fill="#FFE0BD" />
            <path d="M 25 90 Q 50 65 75 90 Z" fill="currentColor" opacity="0.9" />
            {/* Hair */}
            <path d="M 28 35 Q 50 15 72 35 Q 70 20 50 18 Q 30 20 28 35" fill="#3D2314" />
            {/* Face details */}
            <text x="50" y="38" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#333">
              {poseMeta.eyes}
            </text>
            <text x="50" y="48" fontSize="7" textAnchor="middle" fill="#333">
              {poseMeta.mouth}
            </text>
          </svg>
        </div>

        {/* Character Info & Status */}
        <div className="flex flex-col pr-2">
          <span className="font-bold text-slate-100 text-sm">{name}</span>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            {poseMeta.icon}
            <span>{poseMeta.badge}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
