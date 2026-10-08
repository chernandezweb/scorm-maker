import React, { useState } from 'react';
import courseConfig from '../course/course.json';
import { CourseProvider, SlideMetadata, useCourse } from './engine/state/CourseContext';
import { Stage } from './engine/player/Stage';
import { PlayerHeader } from './engine/player/PlayerHeader';
import { PlayerFooter } from './engine/player/PlayerFooter';
import { MenuDrawer } from './engine/player/MenuDrawer';
import { LmsDebugger } from './engine/player/LmsDebugger';
import { TweakOverlay } from './engine/inspector/TweakOverlay';

// Course Slides
import { Slide01Welcome } from '../course/slides/slide-01-welcome';
import { Slide02PhishingSim } from '../course/slides/slide-02-phishing-sim';
import { Slide03Branching } from '../course/slides/slide-03-branching';
import { Slide04DiceGame } from '../course/slides/slide-04-dice-game';
import { Slide05KnowledgeCheck } from '../course/slides/slide-05-knowledge-check';

const COURSE_SLIDES: SlideMetadata[] = [
  {
    id: 'slide-01',
    title: 'Welcome & Mission Briefing',
    description: 'Overview of threat defense objectives and guidance.',
    hasAudio: true,
  },
  {
    id: 'slide-02',
    title: 'Interactive Email Phishing Sim',
    description: 'Hands-on webmail client inspection exercise.',
    hasAudio: true,
  },
  {
    id: 'slide-03',
    title: 'Branching Scenario: 2FA Request',
    description: 'Critical decision tree with adaptive character poses.',
  },
  {
    id: 'slide-04',
    title: 'Cyber Trail Board Game',
    description: 'Interactive dice rolling gamification challenge.',
  },
  {
    id: 'slide-05',
    title: 'Final Assessment & Certification',
    description: 'SCORM 2004 certified assessment and score submission.',
  },
];

const PlayerShell: React.FC = () => {
  const { currentSlideIndex, lmsDebuggerOpen, setLmsDebuggerOpen } = useCourse();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Render current slide component based on index
  const renderSlideContent = () => {
    switch (currentSlideIndex) {
      case 0:
        return <Slide01Welcome />;
      case 1:
        return <Slide02PhishingSim />;
      case 2:
        return <Slide03Branching />;
      case 3:
        return <Slide04DiceGame />;
      case 4:
        return <Slide05KnowledgeCheck />;
      default:
        return <Slide01Welcome />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden font-sans select-none">
      {/* Top Player Header */}
      <PlayerHeader
        courseTitle={courseConfig.title}
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      {/* Main 16:9 Responsive Stage */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
        <Stage baseWidth={1920} baseHeight={1080}>
          {renderSlideContent()}

          {/* Overlays inside the Stage */}
          <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          <LmsDebugger
            isOpen={lmsDebuggerOpen}
            onClose={() => setLmsDebuggerOpen(false)}
          />
          <TweakOverlay />
        </Stage>
      </div>

      {/* Bottom Player Footer Navigation */}
      <PlayerFooter />
    </div>
  );
};

export function App() {
  return (
    <CourseProvider
      slides={COURSE_SLIDES}
      passingScore={courseConfig.passingScore}
      initialVariables={{ employeeTrust: 100 }}
    >
      <PlayerShell />
    </CourseProvider>
  );
}

export default App;
