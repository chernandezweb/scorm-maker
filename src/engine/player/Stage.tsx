import React, { useRef, useState, useEffect } from 'react';

interface StageProps {
  children: React.ReactNode;
  aspectRatio?: number; // default 16/9 = 1.7777778
  baseWidth?: number;  // 1920
  baseHeight?: number; // 1080
}

/**
 * 16:9 Fixed-Aspect-Ratio Responsive Stage (Storyline-like scaling)
 * Centers and automatically scales content to fit the available viewport
 * while preserving identical pixel-perfect positioning across all devices.
 */
export const Stage: React.FC<StageProps> = ({
  children,
  baseWidth = 1920,
  baseHeight = 1080,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      const scaleX = clientWidth / baseWidth;
      const scaleY = clientHeight / baseHeight;
      const nextScale = Math.min(scaleX, scaleY);
      setScale(nextScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [baseWidth, baseHeight]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden select-none p-2 sm:p-4"
    >
      {/* 16:9 Scaled Canvas Frame */}
      <div
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="relative bg-slate-900 text-slate-100 shadow-2xl rounded-xl overflow-hidden flex flex-col border border-slate-800 shrink-0"
      >
        {children}
      </div>
    </div>
  );
};
