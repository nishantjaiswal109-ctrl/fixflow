import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAdminDashboardStats, resetDemoData } from '../services/api';
import { DashboardStats } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CopyCheck,
  TrendingUp,
  Building,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Flame,
  RotateCcw,
} from 'lucide-react';

interface Props {
  onNav: (tab: string, reportId?: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#e11d48',
  High: '#ea580c',
  Medium: '#d97706',
  Low: '#64748b',
};

export const AdminDashboard: React.FC<Props> = ({ onNav }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleResetData = async () => {
    if (!window.confirm('Reset database to clean hackathon demonstration data?')) return;
    setResetting(true);
    try {
      await resetDemoData();
      await loadStats();
      alert('Database successfully reset to official demonstration state.');
    } catch (err: any) {
      alert(err.message || 'Reset failed');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Directorate Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Campus Facilities Directorate
            </span>
            <span className="text-xs text-slate-400">Institutional Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Administrative Command Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time oversight of campus complaints, NLP duplicate detections, SLA aging,
            and contractor crew assignments across all campus zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNav('duplicate-review')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <CopyCheck className="w-4 h-4" />
            <span>Review Duplicates ({stats?.duplicate_suggestions_count ?? 0})</span>
          </button>

          <button
            onClick={handleResetData}
            disabled={resetting}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Reset database to demo baseline"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={loadStats}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Issues
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
            {stats?.total_reports ?? 0}
          </h3>
          <span className="text-[10px] text-slate-500">All-time campus logged</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
            Pending Triage
          </span>
          <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
            {stats?.pending_reports ?? 0}
          </h3>
          <span className="text-[10px] text-amber-600/80">Submitted & Reviewing</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
            Critical
          </span>
          <h3 className="text-2xl font-extrabold text-rose-600 mt-1">
            {stats?.critical_reports ?? 0}
          </h3>
          <span className="text-[10px] text-rose-600/80">Urgent safety priority</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
            In Progress
          </span>
          <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">
            {stats?.in_progress_reports ?? 0}
          </h3>
          <span className="text-[10px] text-indigo-600/80">Crew active</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Resolved
          </span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
            {stats?.resolved_reports ?? 0}
          </h3>
          <span className="text-[10px] text-emerald-600/80">Closed defects</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Avg MTTR
          </span>
          <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
            {stats?.avg_resolution_hours ?? 0}h
          </h3>
          <span className="text-[10px] text-blue-600/80">Mean resolution time</span>
        </div>
      </div>

      {/* Duplicate Alert Banner */}
      {(stats?.duplicate_suggestions_count ?? 0) > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <CopyCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 text-sm">
                {stats?.duplicate_suggestions_count} Unreviewed Duplicate Report Suggestion(s)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                The NLP engine flagged correlated student reports describing identical malfunctions. Review and group them to prevent duplicate technician dispatches.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNav('duplicate-review')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            Open Review Center →
          </button>
        </div>
      )}

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Reports by Category
              </h3>
              <p className="text-xs text-slate-500">Distribution across campus domains</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.category_stats || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Total Issues" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Building Hotspots Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Campus Building Hotspots
              </h3>
              <p className="text-xs text-slate-500">Volume of complaints per campus facility</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.building_stats?.slice(0, 5) || []}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 40, bottom: 0 }}
              >
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis
                  dataKey="building"
                  type="category"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Total Issues" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                <Bar
                  dataKey="critical_or_high"
                  name="High/Critical"
                  fill="#f43f5e"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Chart */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Priority Distribution
              </h3>
              <p className="text-xs text-slate-500">Severity weighting of active tickets</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.priority_stats || []}
                  dataKey="count"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {(stats?.priority_stats || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PRIORITY_COLORS[entry.priority] || '#3b82f6'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unresolved Issue Aging Histogram */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Unresolved Issue Aging (SLA)
              </h3>
              <p className="text-xs text-slate-500">Duration tickets have remained open</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.aging_buckets || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Open Issues" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Launch Bottom Bar */}
      <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900">Manage Campus Operations</h4>
          <p className="text-xs text-slate-500">
            Open the full searchable registry to filter, assign crews, and update statuses.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNav('manage-reports')}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Open All Reports Registry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

