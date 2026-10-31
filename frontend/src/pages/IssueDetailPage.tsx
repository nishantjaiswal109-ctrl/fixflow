import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchReportDetail,
  updateReportStatus,
  overrideReportPriority,
} from '../services/api';
import { ReportItem, IssueStatus, PriorityLevel } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  ArrowLeft,
  Calendar,
  Building,
  MapPin,
  User,
  Wrench,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  CopyCheck,
  Send,
  ShieldAlert,
  Flame,
  FileText,
} from 'lucide-react';

interface Props {
  reportId: string;
  onNav: (tab: string, reportId?: string) => void;
}

const LIFECYCLE_STEPS: IssueStatus[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

const MAINTENANCE_TEAMS = [
  'Electrical Maintenance Crew',
  'Plumbing & Sanitation Team',
  'Civil Maintenance & Masonry Unit',
  'Carpentry & Facilities Services',
  'Campus Janitorial & Sanitation',
  'IT & Network Infrastructure Unit',
  'Precision Lab Instrument Specialist',
  'HVAC & Facilities Unit',
];

export const IssueDetailPage: React.FC<Props> = ({ reportId, onNav }) => {
  const { user } = useAuth();
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin action states
  const [newStatus, setNewStatus] = useState<IssueStatus>('Under Review');
  const [assignedTeam, setAssignedTeam] = useState<string>('');
  const [statusComment, setStatusComment] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Admin priority override state
  const [overridePriorityVal, setOverridePriorityVal] = useState<PriorityLevel>('High');
  const [overrideComment, setOverrideComment] = useState('');
  const [priorityUpdating, setPriorityUpdating] = useState(false);

  const loadDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReportDetail(reportId);
      setReport(data);
      setNewStatus(data.status);
      setAssignedTeam(data.assigned_team || MAINTENANCE_TEAMS[0]);
      setOverridePriorityVal(data.priority);
    } catch (err: any) {
      setError(err.message || 'Failed to load report details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [reportId]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;
    setStatusUpdating(true);
    try {
      await updateReportStatus(report.id, {
        new_status: newStatus,
        assigned_team: assignedTeam,
        comment: statusComment.trim() || undefined,
      });
      setStatusComment('');
      await loadDetail();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handlePriorityOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;
    setPriorityUpdating(true);
    try {
      await overrideReportPriority(report.id, {
        priority: overridePriorityVal,
        comment: overrideComment.trim() || undefined,
      });
      setOverrideComment('');
      await loadDetail();
    } catch (err: any) {
      alert(err.message || 'Priority override failed');
    } finally {
      setPriorityUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
        <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
        Loading complete issue record and timeline...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Issue Record Unavailable</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'Report could not be retrieved.'}</p>
        <button
          onClick={() => onNav(user?.role === 'admin' ? 'manage-reports' : 'my-reports')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Reports Registry
        </button>
      </div>
    );
  }

  const currentStepIdx = LIFECYCLE_STEPS.indexOf(report.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => onNav(user?.role === 'admin' ? 'manage-reports' : 'my-reports')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500">ID: {report.id}</span>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                {report.id}
              </span>
              <PriorityBadge priority={report.priority} isOverridden={report.is_priority_overridden} />
              <StatusBadge status={report.status} />
              {report.is_urgent && (
                <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full uppercase">
                  Urgent Hazard
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {report.title}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-slate-500">
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported By</span>
              <span className="font-semibold text-slate-800">{report.user_name || 'Student'}</span>
              <span className="text-[10px] text-slate-400 block">{report.user_department}</span>
            </div>
          </div>
        </div>

        {/* 6-Step Visual Lifecycle Stepper */}
        <div className="py-6 border-b border-slate-100 overflow-x-auto">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Resolution Lifecycle Progress
          </p>
          <div className="flex items-center min-w-[580px] justify-between relative">
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
            {LIFECYCLE_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 whitespace-nowrap ${
                      isCurrent ? 'text-blue-600 font-bold' : isPast ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metadata Details Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
              <CategoryIcon category={report.category} className="w-4 h-4" />
              <span>{report.category}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Campus Location</span>
            <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{report.building}</span>
            </div>
            <span className="text-[11px] text-slate-500">{report.room} ({report.floor})</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Team</span>
            <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
              <Wrench className="w-3.5 h-3.5 text-indigo-500" />
              <span className={report.assigned_team ? 'text-indigo-700' : 'text-slate-400 italic'}>
                {report.assigned_team || 'Pending Assignment'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted Date</span>
            <div className="flex items-center gap-1 font-semibold text-slate-800 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(report.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Column (Description & Image) & Right Column (AI Insights & Admin Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description, Media & Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
              Detailed Issue Description
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {report.description}
            </p>

            {/* Attached Photo */}
            {report.image_path && (
              <div className="mt-6">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Uploaded Photo Evidence
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-w-md shadow-sm">
                  <img
                    src={report.image_path}
                    alt="Campus issue photograph"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Complete Timestamped Activity History */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Activity & Status History Timeline</span>
            </h3>

            {!report.status_history || report.status_history.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No activity recorded yet.</p>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {report.status_history.map((hist) => (
                  <div key={hist.id} className="relative group">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={hist.new_status} />
                          <span className="text-xs font-bold text-slate-800">
                            by {hist.updated_by}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {new Date(hist.created_at).toLocaleString()}
                        </span>
                      </div>
                      {hist.comment && (
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {hist.comment}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Intelligence & Administrator Controls */}
        <div className="space-y-6">
          {/* AI Priority Reasoning Card */}
          <div className="bg-gradient-to-b from-blue-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm tracking-wide">
                FixFlow AI Priority Engine
              </h3>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Suggested Priority
                </span>
                <PriorityBadge priority={report.suggested_priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  Active Priority
                </span>
                <PriorityBadge
                  priority={report.priority}
                  isOverridden={report.is_priority_overridden}
                />
              </div>
            </div>

            <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
              Transparent Scoring Factors:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {report.priority_reason ? (
                report.priority_reason.split(';').map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{reason.trim()}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400 italic">Standard institutional baseline applied.</li>
              )}
            </ul>
          </div>

          {/* Linked / Suggested Duplicates Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CopyCheck className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  NLP Duplicate Correlations
                </h3>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {report.duplicate_count || 0}
              </span>
            </div>

            {!report.potential_duplicates || report.potential_duplicates.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No duplicate reports correlated with this issue.
              </p>
            ) : (
              <div className="space-y-3">
                {report.potential_duplicates.map((dup) => (
                  <div
                    key={dup.id}
                    onClick={() => onNav('issue-detail', dup.matching_report_id)}
                    className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 hover:border-amber-400 transition-colors cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-blue-700">{dup.matching_report_id}</span>
                      <span className="font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        {dup.similarity_score}% Match
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 truncate mb-1">
                      "{dup.matching_title}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{dup.matching_building}</span>
                      <span className="capitalize font-medium text-slate-700">
                        Status: {dup.review_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Administrator Action Panel */}
          {user?.role === 'admin' && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-sm">Administrator Triage Controls</h3>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleStatusUpdate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Transition Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {LIFECYCLE_STEPS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Assign Maintenance Team
                  </label>
                  <select
                    value={assignedTeam}
                    onChange={(e) => setAssignedTeam(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {MAINTENANCE_TEAMS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Activity Note / Work Order Comment
                  </label>
                  <textarea
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    rows={2}
                    placeholder="e.g. Electrical crew dispatched with replacement ballast..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={statusUpdating}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {statusUpdating ? 'Updating Status...' : 'Apply Status Transition'}
                </button>
              </form>

              {/* Priority Override Form */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Override Calculated Priority
                </span>
                <div className="flex gap-2 mb-2">
                  {(['Low', 'Medium', 'High', 'Critical'] as PriorityLevel[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setOverridePriorityVal(p)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        overridePriorityVal === p
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={overrideComment}
                  onChange={(e) => setOverrideComment(e.target.value)}
                  placeholder="Reason for manual override..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <button
                  type="button"
                  onClick={handlePriorityOverride}
                  disabled={priorityUpdating}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold"
                >
                  {priorityUpdating ? 'Overriding...' : 'Save Priority Override'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

