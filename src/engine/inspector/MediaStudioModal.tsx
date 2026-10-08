import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Image,
  Video,
  Layout,
  Volume2,
  Copy,
  Check,
  Play,
  Film,
  User,
  Shield,
} from 'lucide-react';

interface MediaStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaStudioModal: React.FC<MediaStudioModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'ui' | 'audio'>('image');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>ElevenLabs & Multimodal AI Studio</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Generative Assets
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate and embed character poses, UI software simulations, AI video avatars, and voiceovers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'image'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>AI Images & Characters</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'video'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>AI Video & Presenters</span>
          </button>

          <button
            onClick={() => setActiveTab('ui')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'ui'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>UI & Software Simulations</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'audio'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Voiceover & Auto-Cues</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: IMAGES & CHARACTERS */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 flex items-center justify-between">
                <span>Generate character poses, high-res corporate backdrops, and achievement badges.</span>
                <span className="font-mono text-purple-300 font-bold">Assets: course/assets/images/</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Character Pose */}
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">Character Pose: Alex Alert</div>
                      <div className="text-xs text-slate-400">Pose: "warning" with hand raised</div>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-blue-300">
                    {'<Character name="Alex" pose="warning" position="right" />'}
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard('<Character name="Alex" pose="warning" position="right" />', 'char-1')
                    }
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedSnippet === 'char-1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'char-1' ? 'Copied to Clipboard!' : 'Copy Component Code'}</span>
                  </button>
                </div>

                {/* Badge Icon */}
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">Badge: Cyber Champion</div>
                      <div className="text-xs text-slate-400">Reward token for completing game</div>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-amber-300">
                    {'unlockBadge("Cyber Champion");'}
                  </div>
                  <button
                    onClick={() => copyToClipboard('unlockBadge("Cyber Champion");', 'badge-1')}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedSnippet === 'badge-1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSnippet === 'badge-1' ? 'Copied to Clipboard!' : 'Copy Trigger Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI VIDEO & PRESENTERS */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300">
                Embed talking-head AI presenters and animated motion scenarios. Supports transparent WebM videos floating seamlessly over slides.
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">AI Video Presenter: Alex</div>
                      <div className="text-xs text-slate-400">Talking-head avatar with transparent background</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                    Transparent WebM
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-purple-300 leading-relaxed">
                  {`<AvatarVideo
  name="Alex Vance"
  role="Security Officer"
  position="bottom-right"
  width={320}
  transparent={true}
/>`}
                </div>

                <button
                  onClick={() =>
                    copyToClipboard(
                      `<AvatarVideo name="Alex Vance" role="Security Officer" position="bottom-right" width={320} transparent={true} />`,
                      'vid-1'
                    )
                  }
                  className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                >
                  {copiedSnippet === 'vid-1' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSnippet === 'vid-1' ? 'Copied to Clipboard!' : 'Copy <AvatarVideo /> Code'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: UI SIMULATIONS */}
          {activeTab === 'ui' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300">
                Replace static screenshots with interactive software simulation shells (Outlook, ERP, Web Portals) with clickable red flags.
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col gap-3">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Layout className="w-4 h-4 text-blue-400" />
                  <span>Interactive Outlook Webmail Simulation</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-blue-300">
                  {'<SoftwareSim />'}
                </div>
                <button
                  onClick={() => copyToClipboard('<SoftwareSim />', 'ui-1')}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedSnippet === 'ui-1' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSnippet === 'ui-1' ? 'Copied to Clipboard!' : 'Copy <SoftwareSim /> Code'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: VOICEOVER & AUTO-CUES */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300">
                ElevenLabs voice synthesis automatically calculates word-level alignment cue timestamps so elements appear when specific words are spoken.
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col gap-3">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Audio Narration Controller</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-amber-300 leading-relaxed">
                  {`<AudioNarration
  transcript="Welcome to the 2026 Cybersecurity Briefing."
  duration={8}
  lockUntilFinished={true}
/>`}
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `<AudioNarration transcript="Welcome to the 2026 Cybersecurity Briefing." duration={8} lockUntilFinished={true} />`,
                      'audio-1'
                    )
                  }
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedSnippet === 'audio-1' ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSnippet === 'audio-1' ? 'Copied to Clipboard!' : 'Copy <AudioNarration /> Code'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-between text-xs text-slate-400">
          <span>Run <code className="text-purple-300 font-mono">npm run generate-media</code> to batch-generate all assets.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
