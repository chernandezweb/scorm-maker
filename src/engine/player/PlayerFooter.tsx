import React from 'react';
import { useCourse } from '../state/CourseContext';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Lock,
  RotateCcw,
} from 'lucide-react';

export const PlayerFooter: React.FC = () => {
  const {
    currentSlideIndex,
    slides,
    canGoNext,
    canGoPrev,
    isNavigationLocked,
    nextSlide,
    prevSlide,
    isAudioPlaying,
    setIsAudioPlaying,
    currentAudioTime,
    setCurrentAudioTime,
    audioDuration,
    currentSlide,
  } = useCourse();

  const progressPercent = ((currentSlideIndex + 1) / slides.length) * 100;
  const audioProgressPercent =
    audioDuration > 0 ? Math.min(100, (currentAudioTime / audioDuration) * 100) : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="h-16 px-6 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex items-center justify-between text-white shrink-0 z-30 select-none">
      {/* Left: Previous Button & Slide Counter */}
      <div className="flex items-center gap-4">
        <button
          onClick={prevSlide}
          disabled={!canGoPrev}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
            canGoPrev
              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100 shadow-sm active:scale-95'
              : 'bg-slate-900/50 border-slate-800/50 text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <div className="flex flex-col">
          <div className="text-xs text-slate-400 font-medium">
            Slide <span className="font-bold text-slate-200">{currentSlideIndex + 1}</span> of{' '}
            <span className="font-bold text-slate-200">{slides.length}</span>
          </div>
          {/* Mini progress bar */}
          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center: Audio Narration Scrubber */}
      {currentSlide.hasAudio && (
        <div className="flex items-center gap-3 w-1/3 max-w-md">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-transform active:scale-95"
            title={isAudioPlaying ? 'Pause Narration' : 'Play Narration'}
          >
            {isAudioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Time & Bar */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>{formatTime(currentAudioTime)}</span>
              <span>{formatTime(audioDuration || 0)}</span>
            </div>
            <div
              className="h-2 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (audioDuration > 0) {
                  setCurrentAudioTime(pos * audioDuration);
                }
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all group-hover:from-blue-400 group-hover:to-indigo-400"
                style={{ width: `${audioProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Reset Audio button */}
          <button
            onClick={() => setCurrentAudioTime(0)}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded transition-colors"
            title="Replay Audio"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Right: Next Button with Audio Lock indicator */}
      <div className="flex items-center gap-3">
        {isNavigationLocked && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-md animate-pulse">
            <Lock className="w-3.5 h-3.5" />
            <span>Listen to audio to continue</span>
          </div>
        )}

        <button
          onClick={nextSlide}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-all shadow-md ${
            canGoNext
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-95'
              : 'bg-slate-800 border border-slate-700/50 text-slate-500 cursor-not-allowed opacity-50'
          }`}
          title={isNavigationLocked ? 'Audio narration must finish first' : 'Next Slide'}
        >
          <span>Next</span>
          {isNavigationLocked ? (
            <Lock className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </footer>
  );
};
