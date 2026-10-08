import React, { useState, useEffect } from 'react';
import { mockLms } from '../scorm/mockLms';
import { ScormLogEntry } from '../scorm/types';
import { useCourse } from '../state/CourseContext';
import { X, Activity, RefreshCw, Database, Terminal } from 'lucide-react';

interface LmsDebuggerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LmsDebugger: React.FC<LmsDebuggerProps> = ({ isOpen, onClose }) => {
  const { lmsDebuggerOpen, setLmsDebuggerOpen } = useCourse();
  const [logs, setLogs] = useState<ScormLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'suspend' | 'logs'>('status');
  const [rawData, setRawData] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsubscribe = mockLms.onLog((newLogs) => {
      setLogs([...newLogs]);
      setRawData(mockLms.getRawData());
    });
    setRawData(mockLms.getRawData());
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  let parsedSuspendData: any = null;
  try {
    if (rawData['cmi.suspend_data']) {
      parsedSuspendData = JSON.parse(rawData['cmi.suspend_data']);
    }
  } catch {
    parsedSuspendData = rawData['cmi.suspend_data'];
  }

  return (
    <div className="absolute inset-y-0 right-0 w-96 sm:w-[460px] bg-slate-950/98 backdrop-blur-xl border-l border-slate-800 z-50 shadow-2xl flex flex-col font-mono text-xs">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>SCORM 2004 4th Ed Inspector</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              mockLms.resetDefaults();
              window.location.reload();
            }}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
            title="Reset LMS Session"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/40 text-slate-400">
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2 px-3 text-center border-b-2 transition-all ${
            activeTab === 'status'
              ? 'border-emerald-500 text-emerald-400 font-semibold bg-emerald-500/10'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          CMI Status
        </button>
        <button
          onClick={() => setActiveTab('suspend')}
          className={`flex-1 py-2 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeTab === 'suspend'
              ? 'border-emerald-500 text-emerald-400 font-semibold bg-emerald-500/10'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>suspend_data</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-2 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-1 ${
            activeTab === 'logs'
              ? 'border-emerald-500 text-emerald-400 font-semibold bg-emerald-500/10'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Live Logs ({logs.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'status' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">cmi.completion_status</div>
                <div
                  className={`text-sm font-bold capitalize ${
                    rawData['cmi.completion_status'] === 'completed'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {rawData['cmi.completion_status'] || 'unknown'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">cmi.success_status</div>
                <div
                  className={`text-sm font-bold capitalize ${
                    rawData['cmi.success_status'] === 'passed'
                      ? 'text-emerald-400'
                      : rawData['cmi.success_status'] === 'failed'
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {rawData['cmi.success_status'] || 'unknown'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">cmi.score.raw / max</div>
                <div className="text-sm font-bold text-blue-400">
                  {rawData['cmi.score.raw'] || '0'} / {rawData['cmi.score.max'] || '100'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">cmi.score.scaled</div>
                <div className="text-sm font-bold text-blue-400">
                  {rawData['cmi.score.scaled'] || '0.00'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">cmi.location (Bookmark):</span>
                <span className="text-slate-200 font-semibold">{rawData['cmi.location'] || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">cmi.progress_measure:</span>
                <span className="text-slate-200 font-semibold">{rawData['cmi.progress_measure'] || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">cmi.interactions._count:</span>
                <span className="text-slate-200 font-semibold">{rawData['cmi.interactions._count'] || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">cmi.session_time:</span>
                <span className="text-slate-200 font-semibold">{rawData['cmi.session_time'] || 'PT0S'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suspend' && (
          <div className="space-y-2">
            <div className="text-slate-400 text-[11px]">
              64,000 char capacity in SCORM 2004 4th Ed. Current payload:{' '}
              <span className="text-emerald-400 font-bold">
                {(rawData['cmi.suspend_data'] || '').length} bytes
              </span>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-blue-300 overflow-x-auto whitespace-pre-wrap max-h-96 leading-relaxed">
              {parsedSuspendData
                ? JSON.stringify(parsedSuspendData, null, 2)
                : 'No suspend_data recorded yet.'}
            </pre>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-1.5">
            {logs.map((log, i) => (
              <div
                key={i}
                className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[11px] flex flex-col gap-0.5"
              >
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span className="font-bold text-slate-400">{log.action}</span>
                  <span>{log.timestamp}</span>
                </div>
                {log.element && (
                  <div className="text-emerald-400 truncate">
                    {log.element}
                    {log.value !== undefined && (
                      <span className="text-slate-300"> = "{log.value}"</span>
                    )}
                  </div>
                )}
                {log.diagnostic && (
                  <div className="text-slate-500 text-[10px]">{log.diagnostic}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
