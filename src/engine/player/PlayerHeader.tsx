import React, { useState, useEffect } from 'react';
import { useCourse } from '../state/CourseContext';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Wrench,
  Activity,
  Menu,
  Trophy,
  Award,
  Package,
  Check,
  Loader2,
  RefreshCw,
  FolderOpen,
  ChevronDown,
  Folder,
  Sparkles,
} from 'lucide-react';
import { MediaStudioModal } from '../inspector/MediaStudioModal';

interface PlayerHeaderProps {
  courseTitle: string;
  onToggleMenu: () => void;
  isMenuOpen: boolean;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  courseTitle,
  onToggleMenu,
  isMenuOpen,
}) => {
  const {
    currentSlide,
    gamification,
    isAudioMuted,
    setIsAudioMuted,
    tweakMode,
    setTweakMode,
    lmsDebuggerOpen,
    setLmsDebuggerOpen,
  } = useCourse();

  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  // Engine Update States
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdatingEngine, setIsUpdatingEngine] = useState(false);

  // Recent Projects States
  const [recentProjects, setRecentProjects] = useState<Array<{ path: string; title: string }>>([]);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isBrowsingFolder, setIsBrowsingFolder] = useState(false);

  // AI Media Studio Modal State
  const [isMediaStudioOpen, setIsMediaStudioOpen] = useState(false);

  // Check for updates & recent projects on mount
  useEffect(() => {
    fetch('/api/check-update')
      .then((res) => res.json())
      .then((data) => {
        if (data.updateAvailable) setUpdateAvailable(true);
      })
      .catch(() => {});

    fetch('/api/recent-projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) setRecentProjects(data.projects);
      })
      .catch(() => {});
  }, []);

  const handleBrowseProject = async () => {
    if (isBrowsingFolder) return;
    setIsBrowsingFolder(true);
    setIsProjectMenuOpen(false);

    try {
      const res = await fetch('/api/browse-project', { method: 'POST' });
      const data = await res.json();

      if (data.success && data.path) {
        // Switch to selected project
        const switchRes = await fetch('/api/switch-project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectPath: data.path }),
        });
        const switchData = await switchRes.json();

        if (switchData.success) {
          alert(`✅ Switched to course: "${data.title}"\nReloading stage...`);
          window.location.reload();
        }
      }
    } catch {
      alert('Folder browsing is active in desktop app mode.');
    } finally {
      setIsBrowsingFolder(false);
    }
  };

  const handleSelectRecentProject = async (projPath: string, title: string) => {
    setIsProjectMenuOpen(false);
    try {
      const res = await fetch('/api/switch-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectPath: projPath }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Switched to course: "${title}"\nReloading stage...`);
        window.location.reload();
      }
    } catch {
      alert('Could not switch project.');
    }
  };

  const handleApplyEngineUpdate = async () => {
    if (isUpdatingEngine) return;
    setIsUpdatingEngine(true);
    try {
      const res = await fetch('/api/update-engine', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('✅ SCORM Studio Engine updated successfully! Reloading...');
        window.location.reload();
      } else {
        alert('Notice: ' + (data.error || 'Update completed.'));
      }
    } catch {
      alert('Could not apply update automatically. Double-click Update-Engine.cmd to update.');
    } finally {
      setIsUpdatingEngine(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handle1ClickExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportSuccessMsg(null);

    try {
      const res = await fetch('/api/export-scorm', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setExportSuccessMsg(`Exported to exports/${data.fileName}`);
        setTimeout(() => setExportSuccessMsg(null), 4000);
      } else {
        alert('Export error: ' + (data.error || 'Unknown error'));
      }
    } catch {
      alert('1-Click Export is available in local preview server. Or run: npm run package');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-16 px-6 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between text-white shrink-0 z-30 select-none">
      {/* Left: Menu Toggle, Course Selector & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMenu}
          className={`p-2.5 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium ${
            isMenuOpen
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
          }`}
          title="Toggle Table of Contents"
        >
          <Menu className="w-5 h-5" />
          <span className="hidden md:inline">Menu</span>
        </button>

        {/* Project Selector Dropdown & Native Folder Picker */}
        <div className="relative">
          <button
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
            title="Open or Switch Course Project Folder from SharePoint/OneDrive"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="max-w-[140px] truncate">{courseTitle}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Project Switcher Popover */}
          {isProjectMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs flex flex-col gap-1">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                Course Projects
              </div>

              {/* Native Windows Explorer Folder Browser */}
              <button
                onClick={handleBrowseProject}
                disabled={isBrowsingFolder}
                className="w-full text-left px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 font-bold flex items-center gap-2 transition-colors"
              >
                <FolderOpen className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Browse SharePoint Folder...</span>
              </button>

              {/* Recent Courses List */}
              {recentProjects.length > 0 && (
                <div className="pt-1 space-y-0.5">
                  <div className="px-3 py-1 text-[10px] text-slate-500 font-medium">Recent Courses</div>
                  {recentProjects.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectRecentProject(p.path, p.title)}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center gap-2 truncate transition-colors"
                    >
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current Slide Title */}
        <div className="hidden lg:flex flex-col border-l border-slate-800 pl-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Active Slide
          </span>
          <h1 className="text-sm font-bold text-slate-100 truncate max-w-sm">
            {currentSlide.title}
          </h1>
        </div>
      </div>

      {/* Center: Gamification HUD (Points & Badges) */}
      <div className="flex items-center gap-3">
        {/* Points Pill */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-amber-300 shadow-sm">
          <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">XP:</span>
          <span className="text-sm font-extrabold tracking-wide text-amber-200">
            {gamification.points}
          </span>
        </div>

        {/* Badges Pill */}
        {gamification.badges.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/40 px-3 py-1.5 rounded-full text-blue-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-blue-400" />
            <span>{gamification.badges.length} Badge{gamification.badges.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Right: Tools & Controls */}
      <div className="flex items-center gap-2">
        {/* Engine Update Notification Pill (If developers pushed changes) */}
        {updateAvailable && (
          <button
            onClick={handleApplyEngineUpdate}
            disabled={isUpdatingEngine}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-400 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 text-xs font-bold transition-all animate-pulse"
            title="Click to update core engine and components with latest developer updates"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingEngine ? 'animate-spin' : ''}`} />
            <span>{isUpdatingEngine ? 'Updating...' : 'Update Engine'}</span>
          </button>
        )}

        {/* AI Media Studio Button (ElevenLabs Images, Video, UI, Voice) */}
        <button
          onClick={() => setIsMediaStudioOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/80 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold transition-all shadow-sm active:scale-95"
          title="ElevenLabs & Multimodal AI Studio: Generate images, videos, UI simulations, and audio"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>AI Media Studio</span>
        </button>

        {/* 1-Click SCORM Export Button (Zero Terminal!) */}
        <button
          onClick={handle1ClickExport}
          disabled={isExporting}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-md ${
            exportSuccessMsg
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : isExporting
              ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-wait'
              : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-emerald-600/20 active:scale-95'
          }`}
          title="1-Click: Build & Package SCORM 2004 4th Edition Zip into exports/"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : exportSuccessMsg ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Package className="w-3.5 h-3.5" />
          )}
          <span>{isExporting ? 'Packaging...' : exportSuccessMsg ? 'Packaged!' : 'Export SCORM'}</span>
        </button>

        {/* Tweak Mode Toggle (Integrator visual editor) */}
        <button
          onClick={() => setTweakMode(!tweakMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            tweakMode
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle Visual Tweak Mode (Integrator positioning tool)"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>{tweakMode ? 'Tweak Mode ON' : 'Tweak Mode'}</span>
        </button>

        {/* SCORM Debugger Toggle */}
        <button
          onClick={() => setLmsDebuggerOpen(!lmsDebuggerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            lmsDebuggerOpen
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Toggle SCORM 2004 LMS Communication Inspector"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">LMS Inspector</span>
        </button>

        {/* Audio Mute */}
        <button
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
          title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-slate-300" />
          )}
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* AI Media Studio Modal */}
      <MediaStudioModal
        isOpen={isMediaStudioOpen}
        onClose={() => setIsMediaStudioOpen(false)}
      />
    </header>
  );
};
