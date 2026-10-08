import React, { useState, useEffect } from 'react';
import { useCourse } from '../state/CourseContext';
import {
  Wrench,
  Copy,
  Check,
  Move,
  Maximize,
  RotateCw,
  Sun,
  Grid,
} from 'lucide-react';

export interface TweakValues {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number; // 0.5 - 2.0
  rotation: number; // -180 to 180
  opacity: number; // 0.1 - 1.0
}

interface TweakOverlayProps {
  currentValues?: TweakValues;
  onChange?: (values: TweakValues) => void;
}

export const TweakOverlay: React.FC<TweakOverlayProps> = ({
  currentValues = { x: 50, y: 50, scale: 1, rotation: 0, opacity: 1 },
  onChange,
}) => {
  const { tweakMode, setTweakMode } = useCourse();
  const [values, setValues] = useState<TweakValues>(currentValues);
  const [copied, setCopied] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    setValues(currentValues);
  }, [currentValues]);

  // Arrow key nudging when tweak mode is active
  useEffect(() => {
    if (!tweakMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 5 : 1;
      let newValues: TweakValues | null = null;

      if (e.key === 'ArrowLeft') {
        newValues = { ...values, x: Math.max(0, values.x - step) };
      } else if (e.key === 'ArrowRight') {
        newValues = { ...values, x: Math.min(100, values.x + step) };
      } else if (e.key === 'ArrowUp') {
        newValues = { ...values, y: Math.max(0, values.y - step) };
      } else if (e.key === 'ArrowDown') {
        newValues = { ...values, y: Math.min(100, values.y + step) };
      }

      if (newValues) {
        e.preventDefault();
        setValues(newValues);
        if (onChange) onChange(newValues);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tweakMode, values, onChange]);

  const updateProp = (prop: keyof TweakValues, val: number) => {
    const updated = { ...values, [prop]: val };
    setValues(updated);
    if (onChange) onChange(updated);
  };

  const copyCode = () => {
    const snippet = `x={${values.x}} y={${values.y}} scale={${values.scale}} rotation={${values.rotation}} opacity={${values.opacity}}`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tweakMode) return null;

  return (
    <>
      {/* 16:9 Alignment Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-40 opacity-20 border border-blue-500">
          {/* Rule of thirds / 12-column lines */}
          <div className="w-full h-full grid grid-cols-12 grid-rows-6 divide-x divide-y divide-blue-400">
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} />
            ))}
          </div>
          {/* Center crosshair */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-rose-500 opacity-60" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rose-500 opacity-60" />
        </div>
      )}

      {/* Floating Tweak Inspector Box */}
      <div className="absolute bottom-20 right-6 w-80 bg-slate-900/95 backdrop-blur-xl border border-amber-500/50 rounded-xl shadow-2xl p-4 text-white z-50 font-sans text-xs select-none">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Wrench className="w-4 h-4" />
            <span>Visual Nudge Inspector</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1 rounded ${showGrid ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Toggle Alignment Grid"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTweakMode(false)}
              className="text-slate-400 hover:text-white px-1 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Nudge Controls */}
        <div className="space-y-3 py-3">
          {/* X & Y position */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span className="flex items-center gap-1"><Move className="w-3 h-3" /> X (%)</span>
                <span className="font-mono text-amber-300 font-bold">{values.x}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={values.x}
                onChange={(e) => updateProp('x', parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span className="flex items-center gap-1"><Move className="w-3 h-3" /> Y (%)</span>
                <span className="font-mono text-amber-300 font-bold">{values.y}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={values.y}
                onChange={(e) => updateProp('y', parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Scale & Opacity */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> Scale</span>
                <span className="font-mono text-amber-300 font-bold">{values.scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={values.scale}
                onChange={(e) => updateProp('scale', parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Opacity</span>
                <span className="font-mono text-amber-300 font-bold">{Math.round(values.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={values.opacity}
                onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="text-[10px] text-slate-500 italic">
            Tip: Use arrow keys (or Shift + Arrow keys) to nudge 1% or 5%
          </div>
        </div>

        {/* Copy Props Code Button */}
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
          <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[10px] text-amber-300 truncate">
            {`x={${values.x}} y={${values.y}} scale={${values.scale}}`}
          </div>

          <button
            onClick={copyCode}
            className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy JSX Props'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
