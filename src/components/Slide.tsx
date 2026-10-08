import React from 'react';

interface SlideProps {
  id: string;
  title?: string;
  layout?: 'default' | 'split' | 'hero' | 'canvas';
  background?: string;
  children: React.ReactNode;
  className?: string;
}

export const Slide: React.FC<SlideProps> = ({
  children,
  layout = 'default',
  background = 'bg-slate-900',
  className = '',
}) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden p-8 sm:p-12 select-none ${background} ${className}`}
    >
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Slide Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
