import React, { useState } from 'react';
import { useCourse } from '../engine/state/CourseContext';
import confetti from 'canvas-confetti';
import {
  Mail,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Trash2,
  Flag,
} from 'lucide-react';

export const SoftwareSim: React.FC = () => {
  const { addPoints, unlockBadge } = useCourse();
  const [flaggedClues, setFlaggedClues] = useState<string[]>([]);
  const [reported, setReported] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);

  const clues = [
    {
      id: 'sender',
      label: 'Sender Domain',
      feedback: '🚩 Red Flag: Sender is "IT-Support <helpdesk@micr0soft-update-portal.biz>". Look closely at the domain!',
    },
    {
      id: 'urgency',
      label: 'Urgent Tone',
      feedback: '🚩 Red Flag: "ACCOUNT TERMINATION IN 2 HOURS". Attackers fabricate panic to bypass logical thinking.',
    },
    {
      id: 'link',
      label: 'Suspicious Link',
      feedback: '🚩 Red Flag: Hovering shows destination "http://192.168.1.42/auth/login" instead of official company SSO!',
    },
  ];

  const handleInspect = (clueId: string) => {
    const clue = clues.find((c) => c.id === clueId);
    if (!clue) return;

    setActiveFeedback(clue.feedback);
    if (!flaggedClues.includes(clueId)) {
      const next = [...flaggedClues, clueId];
      setFlaggedClues(next);
      addPoints(15);
    }
  };

  const handleReport = () => {
    if (reported) return;
    setReported(true);
    addPoints(30);
    unlockBadge('Phishing Detective');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setActiveFeedback('✅ Outstanding! You correctly identified the phishing threat and reported it to Security Operations.');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col text-slate-200 text-xs sm:text-sm select-none">
      {/* Simulation Window Chrome */}
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-semibold text-slate-300 ml-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            Corporate Webmail Client (Interactive Simulation)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
            Find {flaggedClues.length} / 3 Red Flags
          </div>
        </div>
      </div>

      {/* Outlook Toolbar */}
      <div className="bg-slate-850 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleReport}
            disabled={reported}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm ${
              reported
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
            }`}
          >
            {reported ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            <span>{reported ? 'Threat Reported' : 'Report Phishing (+30 XP)'}</span>
          </button>

          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 text-slate-400 text-xs hover:bg-slate-700">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded text-slate-400 text-xs w-48">
          <Search className="w-3 h-3" />
          <span>Search Mailbox...</span>
        </div>
      </div>

      {/* Email Body & Header */}
      <div className="p-6 bg-slate-950 flex flex-col gap-4">
        {/* Email Header */}
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-base font-bold text-white">
                CRITICAL NOTICE: Mandatory Microsoft 365 Password Reset Required
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">From:</span>
                {/* Hotspot 1: Sender */}
                <button
                  onClick={() => handleInspect('sender')}
                  className={`px-2 py-0.5 rounded border transition-all text-left font-mono text-xs ${
                    flaggedClues.includes('sender')
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800 border-slate-700 text-blue-400 hover:border-amber-400 hover:bg-slate-750'
                  }`}
                  title="Click to inspect sender address"
                >
                  IT-Support &lt;helpdesk@micr0soft-update-portal.biz&gt; 🔍
                </button>
              </div>
            </div>
            <span className="text-[11px] text-slate-500">Today, 09:41 AM</span>
          </div>
        </div>

        {/* Email Content with Hotspots */}
        <div className="p-5 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-300 space-y-4 leading-relaxed">
          <p>Dear Employee,</p>

          <p>
            Our automated monitoring system detected suspicious logon attempts from an unknown device in Eastern Europe.
          </p>

          {/* Hotspot 2: Urgency */}
          <div
            onClick={() => handleInspect('urgency')}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              flaggedClues.includes('urgency')
                ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                : 'bg-slate-900 border-dashed border-slate-700 hover:border-amber-400 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>IMMEDIATE ACTION REQUIRED WITHIN 2 HOURS</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Failure to re-authenticate will result in permanent account suspension and IT security escalation. (Click to inspect)
            </p>
          </div>

          <p>Click the secure link below to verify your corporate credentials immediately:</p>

          {/* Hotspot 3: Phishing Link */}
          <div>
            <button
              onClick={() => handleInspect('link')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs transition-all shadow-md ${
                flaggedClues.includes('link')
                  ? 'bg-amber-600 text-white border border-amber-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white hover:ring-2 hover:ring-amber-400'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Verify Corporate Credentials Here 🔍</span>
            </button>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              Hover destination: http://192.168.1.42/auth/login?redirect=secure
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-4 border-t border-slate-800">
            Internal Corporate IT Helpdesk &bull; Global Operations
          </p>
        </div>

        {/* Feedback Display */}
        {activeFeedback && (
          <div className="p-3.5 rounded-xl bg-slate-800 border border-amber-500/40 text-amber-200 text-xs sm:text-sm animate-in fade-in flex items-start gap-2.5">
            <Flag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{activeFeedback}</div>
          </div>
        )}
      </div>
    </div>
  );
};
