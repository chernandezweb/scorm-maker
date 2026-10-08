import React, { useRef, useState, useEffect } from 'react';
import { useCourse } from '../engine/state/CourseContext';
import { Play, Pause, Video, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface AvatarVideoProps {
  src?: string;
  poster?: string;
  name?: string;
  role?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'center' | 'custom';
  x?: number; // 0-100%
  y?: number; // 0-100%
  width?: number; // px e.g. 320
  aspectRatio?: string; // '16/9' or '1/1' or '9/16'
  transparent?: boolean; // WebM transparent video support
  syncWithNarration?: boolean;
  className?: string;
}

export const AvatarVideo: React.FC<AvatarVideoProps> = ({
  src,
  poster,
  name = 'AI Presenter',
  role = 'Course Instructor',
  position = 'bottom-right',
  x,
  y,
  width = 300,
  transparent = false,
  className = '',
}) => {
  const { isAudioMuted } = useCourse();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setHasStarted(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isAudioMuted;
    }
  }, [isAudioMuted]);

  // Position styles
  const positionClasses = {
    'bottom-right': 'absolute bottom-6 right-6',
    'bottom-left': 'absolute bottom-6 left-6',
    'top-right': 'absolute top-6 right-6',
    'center': 'relative mx-auto my-auto',
    'custom': 'absolute',
  }[position];

  const customStyle: React.CSSProperties =
    position === 'custom' && x !== undefined && y !== undefined
      ? {
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          width: `${width}px`,
        }
      : {
          width: `${width}px`,
        };

  return (
    <div
      style={customStyle}
      className={`z-20 select-none flex flex-col items-center ${positionClasses} ${className}`}
    >
      {/* Video Frame */}
      <div
        className={`relative overflow-hidden rounded-2xl border shadow-2xl transition-all ${
          transparent
            ? 'border-transparent bg-transparent'
            : 'border-slate-700/80 bg-slate-900/90 backdrop-blur-md ring-1 ring-blue-500/20'
        }`}
        style={{ width: '100%' }}
      >
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            onEnded={() => setIsPlaying(false)}
            className="w-full h-auto object-cover rounded-xl"
          />
        ) : (
          /* Simulated AI Video Avatar Placeholder */
          <div className="w-full aspect-[4/3] bg-gradient-to-b from-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Ambient presenter glow */}
            <div className="absolute inset-0 bg-blue-500/10 blur-xl pointer-events-none" />

            {/* Avatar graphic */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-1 shadow-xl mb-3 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <Video className="w-10 h-10 text-blue-400" />
              </div>
              {isPlaying && (
                <div className="absolute -inset-1 rounded-full border-2 border-blue-400 animate-ping opacity-75" />
              )}
            </div>

            <div className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>{name}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xs text-slate-400">{role}</span>

            {/* Play Overlay */}
            <button
              onClick={togglePlay}
              className="mt-3 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Presenter' : 'Play Video Presenter'}</span>
            </button>
          </div>
        )}

        {/* Video Overlay Info Pill */}
        {src && (
          <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg flex items-center justify-between text-[11px] text-slate-200">
            <span className="font-semibold truncate">{name}</span>
            <button onClick={togglePlay} className="p-1 hover:text-white">
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
