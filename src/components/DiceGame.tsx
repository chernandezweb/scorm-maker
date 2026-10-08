import React, { useState } from 'react';
import { useCourse } from '../engine/state/CourseContext';
import confetti from 'canvas-confetti';
import {
  Dices,
  Trophy,
  ShieldCheck,
  AlertTriangle,
  Gift,
  Zap,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface BoardTile {
  index: number;
  label: string;
  type: 'start' | 'bonus' | 'trap' | 'quiz' | 'finish';
  points: number;
  description: string;
}

const BOARD_TILES: BoardTile[] = [
  { index: 0, label: 'Start', type: 'start', points: 0, description: 'Roll the dice to embark on your security mission.' },
  { index: 1, label: '2FA Check', type: 'bonus', points: 25, description: 'Enabled Authenticator app! +25 XP' },
  { index: 2, label: 'Phishing Trap', type: 'trap', points: -10, description: 'Clicked an unverified link! -10 XP' },
  { index: 3, label: 'Password Vault', type: 'bonus', points: 30, description: 'Adopted corporate password manager! +30 XP' },
  { index: 4, label: 'Mystery Cache', type: 'bonus', points: 40, description: 'Discovered an encrypted backup! +40 XP' },
  { index: 5, label: 'Firewall Hub', type: 'bonus', points: 35, description: 'Configured corporate VPN & zero trust! +35 XP' },
  { index: 6, label: 'Audit Inspection', type: 'quiz', points: 50, description: 'Passed annual compliance audit! +50 XP' },
  { index: 7, label: 'Mastery Peak', type: 'finish', points: 100, description: '🏆 Reached Security Champion status! +100 XP' },
];

export const DiceGame: React.FC = () => {
  const { gamification, addPoints, setGameTilePosition, unlockBadge } = useCourse();
  const currentTileIdx = gamification.gameTilePosition || 0;

  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [eventLog, setEventLog] = useState<string>(
    'Welcome to Cyber Trail! Roll the dice to navigate across security checkpoints.'
  );

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    // Roll animation delay
    let rollCount = 0;
    const interval = setInterval(() => {
      setLastRoll(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount > 8) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 4) + 1; // 1 to 4 steps
        setLastRoll(finalValue);
        setIsRolling(false);

        // Move player piece
        const nextPos = Math.min(BOARD_TILES.length - 1, currentTileIdx + finalValue);
        setGameTilePosition(nextPos);

        const tile = BOARD_TILES[nextPos];
        if (tile.points !== 0) {
          addPoints(tile.points);
        }

        setEventLog(`Landed on "${tile.label}": ${tile.description}`);

        if (tile.type === 'finish') {
          unlockBadge('Cyber Board Master');
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }
    }, 70);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none">
      {/* Game Header & Controls */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Dices className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              The Cyber Trail Board Challenge
            </h2>
            <p className="text-xs text-slate-400">
              Stack points and collect badges by reaching security checkpoints
            </p>
          </div>
        </div>

        {/* Dice Roller Button */}
        <div className="flex items-center gap-4">
          {lastRoll !== null && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Rolled</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                {lastRoll}
              </span>
            </div>
          )}

          <button
            onClick={rollDice}
            disabled={isRolling || currentTileIdx >= BOARD_TILES.length - 1}
            className={`px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-xl ${
              currentTileIdx >= BOARD_TILES.length - 1
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : isRolling
                ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold shadow-amber-500/30 active:scale-95'
            }`}
          >
            <Dices className="w-5 h-5" />
            <span>{isRolling ? 'Rolling...' : currentTileIdx >= BOARD_TILES.length - 1 ? 'Completed!' : 'Roll Dice'}</span>
          </button>
        </div>
      </div>

      {/* Board Path (8 Interactive Checkpoint Tiles) */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {BOARD_TILES.map((tile, i) => {
          const isPlayerHere = currentTileIdx === i;
          const isPast = currentTileIdx > i;

          let badgeIcon = <ShieldCheck className="w-4 h-4 text-blue-400" />;
          if (tile.type === 'start') badgeIcon = <Zap className="w-4 h-4 text-emerald-400" />;
          if (tile.type === 'trap') badgeIcon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
          if (tile.type === 'quiz') badgeIcon = <Gift className="w-4 h-4 text-purple-400" />;
          if (tile.type === 'finish') badgeIcon = <Trophy className="w-4 h-4 text-amber-400" />;

          return (
            <div
              key={tile.index}
              className={`relative rounded-xl p-3 sm:p-4 border transition-all duration-300 flex flex-col justify-between min-h-[110px] ${
                isPlayerHere
                  ? 'bg-gradient-to-b from-blue-900/40 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/20 scale-102 ring-2 ring-amber-400/50'
                  : isPast
                  ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}
            >
              {/* Tile Index & Icon */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 font-mono">#{i + 1}</span>
                {badgeIcon}
              </div>

              {/* Title & Points */}
              <div className="my-1">
                <div className="text-xs sm:text-sm font-bold truncate text-white">
                  {tile.label}
                </div>
                {tile.points !== 0 && (
                  <div
                    className={`text-[11px] font-bold ${
                      tile.points > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tile.points > 0 ? `+${tile.points}` : tile.points} XP
                  </div>
                )}
              </div>

              {/* Player Token (When landed) */}
              {isPlayerHere ? (
                <div className="mt-1 flex items-center gap-1.5 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow animate-bounce">
                  <Sparkles className="w-3 h-3" />
                  <span>YOU ARE HERE</span>
                </div>
              ) : isPast ? (
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/80" />
                  <span>Visited</span>
                </div>
              ) : (
                <div className="text-[10px] text-slate-600">Locked</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Event Narrative Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-300 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
        <span className="font-medium text-slate-200">{eventLog}</span>
      </div>
    </div>
  );
};
