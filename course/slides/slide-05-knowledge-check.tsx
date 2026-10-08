import React, { useState } from 'react';
import { Slide } from '../../src/components/Slide';
import { Quiz } from '../../src/components/Quiz';
import { Character } from '../../src/components/Character';
import { useCourse } from '../../src/engine/state/CourseContext';
import { Award, CheckCircle2, ShieldCheck, Trophy } from 'lucide-react';

export const Slide05KnowledgeCheck: React.FC = () => {
  const { score, gamification, passingScore, isPassed } = useCourse();
  const [quizFinished, setQuizFinished] = useState(false);

  return (
    <Slide id="slide-05" className="justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Final Assessment &bull; SCORM 2004 Certified
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Knowledge Check & Course Completion
          </h2>
        </div>

        <Character
          name="Alex"
          pose={quizFinished && isPassed ? 'celebrating' : 'thinking'}
          position="right"
          speech={
            quizFinished && isPassed
              ? 'Congratulations! You passed the cybersecurity briefing and mastered all safety protocols.'
              : 'Answer this final scenario to submit your score to the LMS.'
          }
          scale={0.9}
        />
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col justify-center my-auto">
        {!quizFinished ? (
          <Quiz
            id="q_phishing_response"
            question="Which action is the SAFEST response when receiving an unexpected email requesting urgent credentials validation?"
            points={40}
            options={[
              {
                id: 'opt1',
                text: 'Click the link and input dummy credentials to see if the website is legitimate.',
                isCorrect: false,
                feedback: 'Never interact with suspicious links; attacker sites may deploy drive-by malware.',
              },
              {
                id: 'opt2',
                text: 'Independently contact IT Support or visit official intranet portals directly, without using links in the email.',
                isCorrect: true,
                feedback: 'Out-of-band verification via official known channels is the gold standard of defense.',
              },
              {
                id: 'opt3',
                text: 'Forward the email to all colleagues in your department asking if anyone else received it.',
                isCorrect: false,
                feedback: 'Forwarding risks spreading malicious payloads or causing widespread panic.',
              },
              {
                id: 'opt4',
                text: 'Reply directly to the sender requesting proof of identity.',
                isCorrect: false,
                feedback: 'Attackers control the reply inbox and will readily falsify documentation.',
              },
            ]}
            onComplete={() => setQuizFinished(true)}
          />
        ) : (
          /* Certificate / Completion Summary Card */
          <div className="w-full max-w-2xl mx-auto bg-slate-900/90 border border-emerald-500/50 rounded-2xl p-8 shadow-2xl backdrop-blur-md flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Course Successfully Completed!
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Your progress, game score, and quiz interactions have been officially recorded to SCORM 2004 4th Edition.
              </p>
            </div>

            {/* Score & Badges Summary */}
            <div className="grid grid-cols-3 gap-4 w-full py-2 border-y border-slate-800">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Final Score</span>
                <span className="text-xl font-black text-blue-400">{score} / 100</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Status</span>
                <span className={`text-xl font-black ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isPassed ? 'PASSED' : 'COMPLETED'}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Total XP</span>
                <span className="text-xl font-black text-amber-300">{gamification.points} XP</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>cmi.completion_status: "completed" &bull; cmi.success_status: "passed"</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-500 text-center border-t border-slate-800 pt-2">
        You may now safely exit the course or review previous slides using the menu.
      </div>
    </Slide>
  );
};
