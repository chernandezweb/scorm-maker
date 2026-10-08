import React from 'react';
import { Slide } from '../../src/components/Slide';
import { SoftwareSim } from '../../src/components/SoftwareSim';
import { Character } from '../../src/components/Character';
import { AudioNarration } from '../../src/components/AudioNarration';

export const Slide02PhishingSim: React.FC = () => {
  return (
    <Slide id="slide-02" className="justify-between">
      <AudioNarration
        transcript="An urgent message just landed in your corporate mailbox. Inspect the sender, the deadline, and the link destination before taking action."
        duration={7}
      />

      {/* Top Slide Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Hands-On Exercise &bull; Software Simulation
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Inspect the Suspicious Corporate Email
          </h2>
        </div>

        {/* Character Assistant Badge */}
        <Character
          name="Alex"
          pose="warning"
          position="right"
          speech="Click the sender domain and link to inspect the red flags!"
          scale={0.9}
        />
      </div>

      {/* Simulation Frame */}
      <div className="flex-1 flex items-center justify-center my-auto">
        <SoftwareSim />
      </div>

      {/* Slide Instructions */}
      <div className="text-xs text-slate-400 text-center border-t border-slate-800 pt-2">
        Click on the three red flag hotspots inside the email and click "Report Phishing" to advance.
      </div>
    </Slide>
  );
};
