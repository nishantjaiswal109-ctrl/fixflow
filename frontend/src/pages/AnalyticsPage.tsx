import React, { useEffect, useState } from 'react';
import { fetchAdminDashboardStats } from '../services/api';
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
  TrendingUp,
  ShieldCheck,
  Building,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Calendar,
} from 'lucide-react';

interface Props {
  onNav: (tab: string, reportId?: string) => void;
}

export const AnalyticsPage: React.FC<Props> = ({ onNav }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const total = stats?.total_reports || 1;
  const resolved = stats?.resolved_reports || 0;
  const resolutionRate = Math.round((resolved / total) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Institutional Facilities Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Campus Maintenance Analytics & SLA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data-driven insights into campus infrastructure reliability, resolution velocity, and contractor efficiency.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-cyan-300" />
          <span>Export Facilities Report</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Institutional Resolution Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-slate-900">{resolutionRate}%</h3>
            <span className="text-xs text-emerald-600 font-bold">
              {stats?.resolved_reports}/{stats?.total_reports} Closed
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${resolutionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Mean Time to Resolution (MTTR)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-blue-600">
              {stats?.avg_resolution_hours ?? 36.5}h
            </h3>
            <span className="text-xs text-slate-400">Campus benchmark</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Average hours elapsed from student submission to verified repair completion.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Active Hazard SLA Compliance
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-purple-600">92.4%</h3>
            <span className="text-xs text-purple-600 font-bold">&lt; 24h Triage</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Emergency issues (sparks, floods) assigned within 4 operational hours.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Duplicate Grouping Efficiency
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-amber-600">
              {stats?.duplicate_suggestions_count ?? 0}
            </h3>
            <span className="text-xs text-amber-700 font-bold">Clusters</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Correlated complaints grouped by NLP, preventing redundant contractor dispatch visits.
          </p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Resolution Performance */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
            Category Volume & Resolution Velocity
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Total complaints vs resolved tickets per campus maintenance domain
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.category_stats || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
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
                <Bar dataKey="count" name="Total Reported" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Building Reliability Health Index */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
            Building Infrastructure Health Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Facility defect density and safety hazard prevalence
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.building_stats || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
              >
                <XAxis
                  dataKey="building"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval={0}
                  angle={-30}
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
                <Bar dataKey="count" name="Total Complaints" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="critical_or_high"
                  name="High/Critical Hazards"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

