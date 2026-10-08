import React, { useEffect, useRef } from 'react';
import { useCourse } from '../engine/state/CourseContext';

interface CuePoint {
  time: number; // in seconds
  id: string;
}

interface AudioNarrationProps {
  src?: string;
  transcript?: string;
  voice?: string;
  duration?: number;
  cues?: CuePoint[];
  lockUntilFinished?: boolean;
  onCue?: (cueId: string) => void;
}

export const AudioNarration: React.FC<AudioNarrationProps> = ({
  src,
  transcript,
  duration = 10,
  cues = [],
  lockUntilFinished = false,
  onCue,
}) => {
  const {
    isAudioPlaying,
    setIsAudioPlaying,
    isAudioMuted,
    currentAudioTime,
    setCurrentAudioTime,
    setAudioDuration,
    triggerAudioFinished,
    setNavigationLocked,
  } = useCourse();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  // Lock navigation if mandatory
  useEffect(() => {
    if (lockUntilFinished) {
      setNavigationLocked(true);
    }
    setAudioDuration(duration);
  }, [lockUntilFinished, duration, setNavigationLocked, setAudioDuration]);

  // Audio / Speech handling
  useEffect(() => {
    if (src) {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.muted = isAudioMuted;

      audio.onended = () => {
        triggerAudioFinished();
      };

      audio.ontimeupdate = () => {
        setCurrentAudioTime(audio.currentTime);
      };

      return () => {
        audio.pause();
        audio.src = '';
      };
    } else if (transcript && 'speechSynthesis' in window) {
      // High-fidelity fallback Web Speech synthesis for development/preview
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.rate = 1.0;
      speechRef.current = utterance;

      utterance.onend = () => {
        triggerAudioFinished();
      };

      return () => {
        window.speechSynthesis.cancel();
      };
    }
  }, [src, transcript, isAudioMuted, triggerAudioFinished, setCurrentAudioTime]);

  // Play/Pause coordination
  useEffect(() => {
    if (src && audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    } else if (transcript && 'speechSynthesis' in window) {
      if (isAudioPlaying && speechRef.current) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speechRef.current);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  }, [isAudioPlaying, src, transcript]);

  // Simulated playback time increment if no native audio file exists
  useEffect(() => {
    if (!src && isAudioPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentAudioTime((prev) => {
          if (prev >= duration) {
            triggerAudioFinished();
            return duration;
          }
          return prev + 0.25;
        });
      }, 250);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAudioPlaying, src, duration, triggerAudioFinished, setCurrentAudioTime]);

  // Cue point checks
  useEffect(() => {
    if (!onCue) return;
    cues.forEach((cue) => {
      if (Math.abs(currentAudioTime - cue.time) < 0.3) {
        onCue(cue.id);
      }
    });
  }, [currentAudioTime, cues, onCue]);

  return null;
};
