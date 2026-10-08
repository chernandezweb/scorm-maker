import React from 'react';
import { Slide } from '../../src/components/Slide';
import { Character } from '../../src/components/Character';
import { AudioNarration } from '../../src/components/AudioNarration';
import { ShieldCheck, MailWarning, Award, Play } from 'lucide-react';
import { useCourse } from '../../src/engine/state/CourseContext';

export const Slide01Welcome: React.FC = () => {
  const { isAudioPlaying, setIsAudioPlaying } = useCourse();

  return (
    <Slide id="slide-01" className="justify-between">
      {/* Voice Narration Controller */}
      <AudioNarration
        transcript="Welcome to the 2026 Cybersecurity Briefing. In this interactive module, you will analyze simulated threats, play the cyber trail board game, and verify your skills."
        duration={8}
        lockUntilFinished={false}
      />

      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Module 1 &bull; Threat Recognition</span>
        </div>
      </div>

      {/* Main Grid: Character on Left, Content & Objectives on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
        {/* Left Column: Character Guide */}
        <div className="md:col-span-5 flex flex-col items-center">
          <Character
            name="Alex Vance"
            pose="explaining"
            position="center"
            speech="Welcome to the briefing! As security officers, our job is spotting deceptive lures before they compromise company assets."
            scale={1.05}
          />

          {!isAudioPlaying && (
            <button
              onClick={() => setIsAudioPlaying(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 rounded-xl text-blue-200 text-xs font-bold transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Listen to Alex's Narration</span>
            </button>
          )}
        </div>

        {/* Right Column: Mission Objectives */}
        <div className="md:col-span-7 flex flex-col gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Defend Against Phishing Attacks
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              Cyber criminals target human psychology, not just software bugs. Master the critical indicators to safeguard our organization.
            </p>
          </div>

          {/* Interactive Objective Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col gap-2">
              <MailWarning className="w-5 h-5 text-amber-400" />
              <div className="font-bold text-sm text-slate-100">Spot Deceptions</div>
              <p className="text-xs text-slate-400 leading-snug">
                Detect spoofed headers and manipulative urgency.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div className="font-bold text-sm text-slate-100">Live Simulation</div>
              <p className="text-xs text-slate-400 leading-snug">
                Inspect a real simulated webmail inbox for hazards.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <div className="font-bold text-sm text-slate-100">Earn Badges</div>
              <p className="text-xs text-slate-400 leading-snug">
                Roll the dice and complete the trail for certification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span>Estimated completion time: 5 minutes</span>
        <span>Click "Next" to enter the interactive email simulation &rarr;</span>
      </div>
    </Slide>
  );
};
