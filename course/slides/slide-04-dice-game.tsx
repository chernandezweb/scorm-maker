import React from 'react';
import { Slide } from '../../src/components/Slide';
import { DiceGame } from '../../src/components/DiceGame';
import { Character } from '../../src/components/Character';
import { Trophy } from 'lucide-react';

export const Slide04DiceGame: React.FC = () => {
  return (
    <Slide id="slide-04" className="justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            Gamification Module &bull; Interactive Board
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Cyber Trail: The Dice Navigation Game
          </h2>
        </div>

        <Character
          name="Alex"
          pose="celebrating"
          position="right"
          speech="Roll the dice to advance your pawn across checkpoints!"
          scale={0.9}
        />
      </div>

      {/* Main Dice Board Game */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <DiceGame />
      </div>

      {/* Footer */}
      <div className="text-xs text-slate-500 text-center border-t border-slate-800 pt-2">
        Player position and stacked XP points are automatically persisted into SCORM 2004 suspend_data.
      </div>
    </Slide>
  );
};
