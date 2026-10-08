import React from 'react';
import { useCourse } from '../state/CourseContext';
import { CheckCircle2, Circle, X, BookOpen } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose }) => {
  const { slides, currentSlideIndex, goToSlide, visitedSlideIds } = useCourse();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-y-0 left-0 w-80 bg-slate-900/98 backdrop-blur-md border-r border-slate-800 z-40 shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-blue-400 font-bold text-base">
          <BookOpen className="w-5 h-5" />
          <span>Course Outline</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Slide List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {slides.map((slide, idx) => {
          const isCurrent = idx === currentSlideIndex;
          const isVisited = visitedSlideIds.includes(slide.id);

          return (
            <button
              key={slide.id}
              onClick={() => {
                goToSlide(idx);
                onClose();
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                isCurrent
                  ? 'bg-blue-600/20 border-blue-500/80 text-white shadow-md shadow-blue-500/10'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              {/* Status Icon */}
              <div className="mt-0.5 shrink-0">
                {isVisited ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>

              {/* Title & Index */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  Slide {idx + 1}
                </div>
                <div className={`text-sm font-medium truncate ${isCurrent ? 'text-blue-300 font-bold' : 'text-slate-200'}`}>
                  {slide.title}
                </div>
                {slide.description && (
                  <div className="text-xs text-slate-400 truncate mt-0.5">
                    {slide.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        SCORM 2004 4th Edition Engine
      </div>
    </div>
  );
};
