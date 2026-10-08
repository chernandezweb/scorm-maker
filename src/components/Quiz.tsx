import React, { useState } from 'react';
import { useCourse } from '../engine/state/CourseContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, HelpCircle, ArrowRight } from 'lucide-react';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

interface QuizProps {
  id: string;
  question: string;
  explanation?: string;
  options: QuizOption[];
  points?: number;
  onComplete?: (isCorrect: boolean) => void;
}

export const Quiz: React.FC<QuizProps> = ({
  id,
  question,
  explanation,
  options,
  points = 25,
  onComplete,
}) => {
  const { submitQuiz, addPoints } = useCourse();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;

    const chosen = options.find((opt) => opt.id === selectedOptionId);
    if (!chosen) return;

    const isCorrect = chosen.isCorrect;
    setIsSubmitted(true);

    if (isCorrect) {
      addPoints(points);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    submitQuiz({
      id,
      description: question,
      selectedAnswer: chosen.text,
      isCorrect,
      points,
    });

    if (onComplete) {
      onComplete(isCorrect);
    }
  };

  const selectedOption = options.find((o) => o.id === selectedOptionId);

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6 select-none">
      {/* Header & Question */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-600/20 border border-blue-500/40 rounded-xl text-blue-400 shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <span>Knowledge Check</span>
            <span>•</span>
            <span className="text-amber-400 font-extrabold">+{points} XP</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {question}
          </h2>
        </div>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          let borderStyle = 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700 text-slate-200';

          if (isSubmitted) {
            if (opt.isCorrect) {
              borderStyle = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-200';
            } else if (isSelected && !opt.isCorrect) {
              borderStyle = 'border-rose-500/80 bg-rose-500/10 text-rose-200';
            } else {
              borderStyle = 'border-slate-800/50 bg-slate-900/30 text-slate-500 opacity-60';
            }
          } else if (isSelected) {
            borderStyle = 'border-blue-500 bg-blue-600/20 text-white shadow-md shadow-blue-500/10';
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-sm sm:text-base font-medium ${borderStyle}`}
            >
              <span>{opt.text}</span>
              {isSubmitted && opt.isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
              )}
              {isSubmitted && isSelected && !opt.isCorrect && (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Submit or Feedback Area */}
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOptionId}
          className={`w-full py-3 px-6 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
            selectedOptionId
              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-98'
              : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
          }`}
        >
          <span>Submit Answer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div
          className={`p-4 rounded-xl border flex flex-col gap-2 animate-in fade-in duration-300 ${
            selectedOption?.isCorrect
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {selectedOption?.isCorrect ? (
              <>
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Correct! +{points} XP gained</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Not quite. Review the explanation below.</span>
              </>
            )}
          </div>
          {(selectedOption?.feedback || explanation) && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedOption?.feedback || explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
