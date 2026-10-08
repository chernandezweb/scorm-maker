import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { scorm } from '../scorm/scorm2004';
import { ScormSuspendData, ScormInteractionData } from '../scorm/types';

export interface SlideMetadata {
  id: string;
  title: string;
  description?: string;
  hasAudio?: boolean;
  lockUntilAudioEnds?: boolean;
}

export interface GamificationState {
  points: number;
  inventory: string[];
  badges: string[];
  gameTilePosition: number;
}

export interface CourseContextValue {
  // Navigation
  currentSlideIndex: number;
  currentSlide: SlideMetadata;
  slides: SlideMetadata[];
  canGoNext: boolean;
  canGoPrev: boolean;
  isNavigationLocked: boolean;
  setNavigationLocked: (locked: boolean) => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  visitedSlideIds: string[];

  // Scoring & Completion
  score: number;
  passingScore: number;
  isCompleted: boolean;
  isPassed: boolean;

  // Gamification & Custom Variables
  variables: Record<string, any>;
  setVariable: (key: string, value: any) => void;
  gamification: GamificationState;
  addPoints: (pts: number) => void;
  unlockBadge: (badge: string) => void;
  setGameTilePosition: (pos: number) => void;
  addInventoryItem: (item: string) => void;

  // Quizzes
  submitQuiz: (params: {
    id: string;
    description: string;
    selectedAnswer: string;
    isCorrect: boolean;
    points: number;
  }) => void;

  // Audio State & Cue Points
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
  isAudioMuted: boolean;
  setIsAudioMuted: (muted: boolean) => void;
  currentAudioTime: number;
  setCurrentAudioTime: (time: number) => void;
  audioDuration: number;
  setAudioDuration: (dur: number) => void;
  triggerAudioFinished: () => void;

  // Integrator Tools
  tweakMode: boolean;
  setTweakMode: (enabled: boolean) => void;
  lmsDebuggerOpen: boolean;
  setLmsDebuggerOpen: (open: boolean) => void;
}

const CourseContext = createContext<CourseContextValue | null>(null);

interface CourseProviderProps {
  children: React.ReactNode;
  slides: SlideMetadata[];
  passingScore?: number;
  initialVariables?: Record<string, any>;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({
  children,
  slides,
  passingScore = 80,
  initialVariables = {},
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [visitedSlideIds, setVisitedSlideIds] = useState<string[]>([slides[0]?.id || 'slide-01']);
  const [isNavigationLocked, setNavigationLocked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [variables, setVariables] = useState<Record<string, any>>(initialVariables);
  const [gamification, setGamification] = useState<GamificationState>({
    points: 0,
    inventory: [],
    badges: [],
    gameTilePosition: 0,
  });
  const [quizResults, setQuizResults] = useState<Record<string, { answered: boolean; correct: boolean; score: number }>>({});

  // Audio
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [currentAudioTime, setCurrentAudioTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  // Devtools
  const [tweakMode, setTweakMode] = useState<boolean>(false);
  const [lmsDebuggerOpen, setLmsDebuggerOpen] = useState<boolean>(false);

  // Initialize SCORM on load
  useEffect(() => {
    scorm.initialize();

    // Check for existing suspend_data bookmarking
    const saved = scorm.loadSuspendData();
    if (saved) {
      if (saved.visitedSlideIds) setVisitedSlideIds(saved.visitedSlideIds);
      if (saved.variables) setVariables(saved.variables);
      if (saved.gamification) setGamification(saved.gamification);
      if (saved.quizResults) setQuizResults(saved.quizResults);
      if (saved.score !== undefined) setScore(saved.score);

      // Bookmark restoration
      if (saved.currentSlideId) {
        const foundIdx = slides.findIndex((s) => s.id === saved.currentSlideId);
        if (foundIdx >= 0) {
          setCurrentSlideIndex(foundIdx);
        }
      }
    }

    const handleBeforeUnload = () => {
      scorm.terminate();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      scorm.terminate();
    };
  }, [slides]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Helper to persist current state
  const syncToScorm = useCallback(
    (nextSlideId: string, nextVisited: string[], nextScore: number, nextGamification: GamificationState, nextVars: Record<string, any>, nextQuizzes: any) => {
      const suspendPayload: ScormSuspendData = {
        currentSlideId: nextSlideId,
        visitedSlideIds: nextVisited,
        variables: nextVars,
        score: nextScore,
        gamification: nextGamification,
        quizResults: nextQuizzes,
      };

      scorm.setLocation(nextSlideId);
      scorm.setProgressMeasure(nextVisited.length / slides.length);
      scorm.saveSuspendData(suspendPayload);

      // Status check
      if (nextVisited.length === slides.length) {
        scorm.setCompletionStatus('completed');
      } else {
        scorm.setCompletionStatus('incomplete');
      }

      if (nextScore >= passingScore) {
        scorm.setSuccessStatus('passed');
      }
    },
    [slides.length, passingScore]
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index < 0 || index >= slides.length) return;
      const targetSlide = slides[index];
      setCurrentSlideIndex(index);
      setCurrentAudioTime(0);

      // Locked navigation reset if target slide has lockUntilAudioEnds
      if (targetSlide.lockUntilAudioEnds) {
        setNavigationLocked(true);
      } else {
        setNavigationLocked(false);
      }

      setVisitedSlideIds((prev) => {
        const updated = prev.includes(targetSlide.id) ? prev : [...prev, targetSlide.id];
        syncToScorm(targetSlide.id, updated, score, gamification, variables, quizResults);
        return updated;
      });
    },
    [slides, score, gamification, variables, quizResults, syncToScorm]
  );

  const nextSlide = useCallback(() => {
    if (isNavigationLocked) return;
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, slides.length, isNavigationLocked, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }, [currentSlideIndex, goToSlide]);

  const setVariable = useCallback((key: string, value: any) => {
    setVariables((prev) => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  }, []);

  const addPoints = useCallback((pts: number) => {
    setGamification((prev) => {
      const newPoints = prev.points + pts;
      const updated = { ...prev, points: newPoints };
      return updated;
    });
  }, []);

  const unlockBadge = useCallback((badge: string) => {
    setGamification((prev) => {
      if (prev.badges.includes(badge)) return prev;
      return { ...prev, badges: [...prev.badges, badge] };
    });
  }, []);

  const setGameTilePosition = useCallback((pos: number) => {
    setGamification((prev) => ({ ...prev, gameTilePosition: pos }));
  }, []);

  const addInventoryItem = useCallback((item: string) => {
    setGamification((prev) => {
      if (prev.inventory.includes(item)) return prev;
      return { ...prev, inventory: [...prev.inventory, item] };
    });
  }, []);

  const triggerAudioFinished = useCallback(() => {
    setNavigationLocked(false);
    setIsAudioPlaying(false);
  }, []);

  const submitQuiz = useCallback(
    ({
      id,
      description,
      selectedAnswer,
      isCorrect,
      points,
    }: {
      id: string;
      description: string;
      selectedAnswer: string;
      isCorrect: boolean;
      points: number;
    }) => {
      // 1. SCORM 2004 interaction recording
      const interaction: ScormInteractionData = {
        id,
        type: 'choice',
        description,
        learnerResponse: selectedAnswer,
        result: isCorrect ? 'correct' : 'incorrect',
        weighting: points,
      };
      scorm.recordInteraction(interaction);

      // 2. Score update
      const newResults = {
        ...quizResults,
        [id]: { answered: true, correct: isCorrect, score: isCorrect ? points : 0 },
      };
      setQuizResults(newResults);

      const totalCalculatedScore = Object.values(newResults).reduce((sum, item) => sum + item.score, 0);
      setScore(totalCalculatedScore);
      scorm.setScore(totalCalculatedScore, 0, 100);

      if (totalCalculatedScore >= passingScore) {
        scorm.setSuccessStatus('passed');
      }

      syncToScorm(currentSlide.id, visitedSlideIds, totalCalculatedScore, gamification, variables, newResults);
    },
    [currentSlide.id, visitedSlideIds, gamification, variables, quizResults, passingScore, syncToScorm]
  );

  const isCompleted = visitedSlideIds.length >= slides.length;
  const isPassed = score >= passingScore;

  const value: CourseContextValue = useMemo(
    () => ({
      currentSlideIndex,
      currentSlide,
      slides,
      canGoNext: currentSlideIndex < slides.length - 1 && !isNavigationLocked,
      canGoPrev: currentSlideIndex > 0,
      isNavigationLocked,
      setNavigationLocked,
      goToSlide,
      nextSlide,
      prevSlide,
      visitedSlideIds,
      score,
      passingScore,
      isCompleted,
      isPassed,
      variables,
      setVariable,
      gamification,
      addPoints,
      unlockBadge,
      setGameTilePosition,
      addInventoryItem,
      submitQuiz,
      isAudioPlaying,
      setIsAudioPlaying,
      isAudioMuted,
      setIsAudioMuted,
      currentAudioTime,
      setCurrentAudioTime,
      audioDuration,
      setAudioDuration,
      triggerAudioFinished,
      tweakMode,
      setTweakMode,
      lmsDebuggerOpen,
      setLmsDebuggerOpen,
    }),
    [
      currentSlideIndex,
      currentSlide,
      slides,
      isNavigationLocked,
      goToSlide,
      nextSlide,
      prevSlide,
      visitedSlideIds,
      score,
      passingScore,
      isCompleted,
      isPassed,
      variables,
      setVariable,
      gamification,
      addPoints,
      unlockBadge,
      setGameTilePosition,
      addInventoryItem,
      submitQuiz,
      isAudioPlaying,
      isAudioMuted,
      currentAudioTime,
      audioDuration,
      triggerAudioFinished,
      tweakMode,
      lmsDebuggerOpen,
    ]
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
