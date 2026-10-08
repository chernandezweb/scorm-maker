import React from 'react';
import { useCourse } from '../state/CourseContext';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Wrench,
  Activity,
  Menu,
  Trophy,
  Award,
} from 'lucide-react';

interface PlayerHeaderProps {
  courseTitle: string;
  onToggleMenu: () => void;
  isMenuOpen: boolean;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  courseTitle,
  onToggleMenu,
  isMenuOpen,
}) => {
  const {
    currentSlide,
    gamification,
    isAudioMuted,
    setIsAudioMuted,
    tweakMode,
    setTweakMode,
    lmsDebuggerOpen,
    setLmsDebuggerOpen,
  } = useCourse();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-16 px-6 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between text-white shrink-0 z-30">
      {/* Left: Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMenu}
          className={`p-2.5 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium ${
            isMenuOpen
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
          }`}
          title="Toggle Table of Contents"
        >
          <Menu className="w-5 h-5" />
          <span className="hidden md:inline">Menu</span>
        </button>

        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
            {courseTitle}
          </span>
          <h1 className="text-base font-bold text-slate-100 truncate max-w-md">
            {currentSlide.title}
          </h1>
        </div>
      </div>

      {/* Center: Gamification HUD (Points & Badges) */}
      <div className="flex items-center gap-3">
        {/* Points Pill */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-amber-300 shadow-sm">
          <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">XP:</span>
          <span className="text-sm font-extrabold tracking-wide text-amber-200">
            {gamification.points}
          </span>
        </div>

        {/* Badges Pill */}
        {gamification.badges.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/40 px-3 py-1.5 rounded-full text-blue-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-blue-400" />
            <span>{gamification.badges.length} Badge{gamification.badges.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Right: Tools & Controls */}
      <div className="flex items-center gap-2">
        {/* Tweak Mode Toggle (Integrator visual editor) */}
        <button
          onClick={() => setTweakMode(!tweakMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            tweakMode
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle Visual Tweak Mode (Integrator positioning tool)"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>{tweakMode ? 'Tweak Mode ON' : 'Tweak Mode'}</span>
        </button>

        {/* SCORM Debugger Toggle */}
        <button
          onClick={() => setLmsDebuggerOpen(!lmsDebuggerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            lmsDebuggerOpen
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle SCORM 2004 LMS Communication Inspector"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">LMS Inspector</span>
        </button>

        {/* Audio Mute */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-slate-300" />
          )}
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
