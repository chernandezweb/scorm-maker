import React, { useState } from 'react';
import { Slide } from '../../src/components/Slide';
import { Character, CharacterPose } from '../../src/components/Character';
import { useCourse } from '../../src/engine/state/CourseContext';
import { GitBranch, ShieldCheck, AlertTriangle, ShieldX } from 'lucide-react';

export const Slide03Branching: React.FC = () => {
  const { addPoints } = useCourse();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [marcusPose, setMarcusPose] = useState<CharacterPose>('thinking');

  const branches = [
    {
      id: 1,
      title: 'Option A: Share your 2FA token',
      text: '"Sure Marcus, here is my code: 849-210. Good luck with the client deck!"',
      points: -15,
      isBest: false,
      pose: 'warning' as CharacterPose,
      feedback:
        '❌ Policy Breach: 2FA tokens must NEVER be shared. If Marcus’s workstation or Slack account is compromised, the attacker now possesses your authorized identity.',
    },
    {
      id: 2,
      title: 'Option B: Guide to Official IT Emergency Access',
      text: '"I cannot share credentials, but let’s call IT Helpdesk immediately to request a temporary hardware key."',
      points: 30,
      isBest: true,
      pose: 'celebrating' as CharacterPose,
      feedback:
        '✅ Excellent Leadership! You upheld the Zero Trust security policy while still actively assisting your colleague through sanctioned IT channels.',
    },
    {
      id: 3,
      title: 'Option C: Ghost Marcus entirely',
      text: 'Ignore his Slack message completely and say nothing.',
      points: 5,
      isBest: false,
      pose: 'neutral' as CharacterPose,
      feedback:
        '⚠️ Sub-optimal: While you did not violate credentials policy, leaving an urgent team member in the dark without directing them to IT hurts team resilience.',
    },
  ];

  const handleChoose = (branch: typeof branches[0]) => {
    if (selectedBranch !== null) return;
    setSelectedBranch(branch.id);
    setMarcusPose(branch.pose);
    addPoints(branch.points);
  };

  const currentBranch = branches.find((b) => b.id === selectedBranch);

  return (
    <Slide id="slide-03" className="justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" />
            Branching Decision Tree
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Scenario: The Urgent 2FA Request
          </h2>
        </div>
      </div>

      {/* Main Grid: Character on Left, Branching Choices on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto">
        {/* Left Column: Marcus */}
        <div className="md:col-span-5 flex flex-col items-center">
          <Character
            name="Marcus (Colleague)"
            pose={marcusPose}
            position="center"
            speech={
              selectedBranch === null
                ? 'Hey! My phone battery died and the VP needs this financial deck in 10 minutes. Can you please shoot me your 2FA code so I can log into the client VPN?'
                : currentBranch?.isBest
                ? 'That makes total sense! I’ll ring IT for a temp bypass right now.'
                : 'Uh oh... Security operations just flagged both our accounts for unauthorized access.'
            }
            scale={1.05}
          />
        </div>

        {/* Right Column: Choices & Decision Outcomes */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            How do you respond?
          </span>

          <div className="space-y-3">
            {branches.map((b) => {
              const isSelected = selectedBranch === b.id;
              let btnStyle = 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-slate-200';

              if (selectedBranch !== null) {
                if (isSelected) {
                  btnStyle = b.isBest
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-200 shadow-md'
                    : 'border-rose-500 bg-rose-500/20 text-rose-200 shadow-md';
                } else {
                  btnStyle = 'border-slate-800/40 bg-slate-950/40 text-slate-500 opacity-40';
                }
              }

              return (
                <button
                  key={b.id}
                  onClick={() => handleChoose(b)}
                  disabled={selectedBranch !== null}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1 ${btnStyle}`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{b.title}</span>
                    {selectedBranch !== null && isSelected && (
                      <span className={`text-xs font-extrabold ${b.points > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {b.points > 0 ? `+${b.points}` : b.points} XP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{b.text}</p>
                </button>
              );
            })}
          </div>

          {/* Branch Outcome Box */}
          {currentBranch && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-300 ${
                currentBranch.isBest
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              {currentBranch.isBest ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs sm:text-sm leading-relaxed">
                {currentBranch.feedback}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-500 text-center border-t border-slate-800 pt-2">
        Branch choices dynamically adapt variables and character poses in real-time.
      </div>
    </Slide>
  );
};
