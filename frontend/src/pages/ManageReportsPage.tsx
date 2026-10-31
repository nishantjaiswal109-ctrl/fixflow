import React, { useEffect, useState } from 'react';
import { fetchReports, updateReportStatus } from '../services/api';
import { ReportItem, IssueStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import {
  Search,
  Filter,
  Building,
  MapPin,
  Calendar,
  Wrench,
  ArrowRight,
  RefreshCw,
  CopyCheck,
  Check,
} from 'lucide-react';

interface Props {
  onNav: (tab: string, reportId?: string) => void;
}

const BUILDINGS = [
  'All',
  'Science & Technology Block',
  'Engineering Annex',
  'Central Library',
  'Life Sciences Research Complex',
  'Humanities Auditorium',
  'Student Center & Cafeteria',
  'Management Institute',
  'Hostels & Residential Halls',
];

export const ManageReportsPage: React.FC<Props> = ({ onNav }) => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [building, setBuilding] = useState('All');
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchReports({
        category: category !== 'All' ? category : undefined,
        building: building !== 'All' ? building : undefined,
        priority: priority !== 'All' ? priority : undefined,
        status: status !== 'All' ? status : undefined,
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
      });
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [category, building, priority, status, sortBy, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadReports();
  };

  const handleQuickStatusChange = async (repId: string, newStat: IssueStatus) => {
    try {
      await updateReportStatus(repId, {
        new_status: newStat,
        comment: `Quick transition to ${newStat} from manage registry table.`,
      });
      await loadReports();
    } catch (err: any) {
      alert(err.message || 'Status transition failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Institutional Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Manage All Campus Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, update statuses, and triage complaints submitted across the campus.
          </p>
        </div>

        <button
          onClick={loadReports}
          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-xs transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter and Control Panel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm mb-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID (e.g. FIX-2026-1001), keywords, submitter, building or room..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Furniture">Furniture</option>
              <option value="Cleaning and Hygiene">Cleaning & Hygiene</option>
              <option value="Internet and Networking">Networking</option>
              <option value="Laboratory Equipment">Lab Equipment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Building
            </label>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BUILDINGS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Sort Field
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">Date Created</option>
              <option value="priority">Priority</option>
              <option value="severity">Severity</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
            Loading campus reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No campus records found matching the active filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Issue ID & Category</th>
                  <th className="py-3 px-4">Title & Location</th>
                  <th className="py-3 px-4">Submitter</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status & Quick Update</th>
                  <th className="py-3 px-4">Assigned Crew</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((rep) => (
                  <tr
                    key={rep.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                    onClick={() => onNav('issue-detail', rep.id)}
                  >
                    {/* ID & Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                        {rep.id}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 font-medium">
                        <CategoryIcon category={rep.category} className="w-3.5 h-3.5" />
                        <span>{rep.category}</span>
                      </div>
                      {rep.duplicate_count ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded mt-1">
                          <CopyCheck className="w-3 h-3" />
                          <span>{rep.duplicate_count} Dup</span>
                        </span>
                      ) : null}
                    </td>

                    {/* Title & Location */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {rep.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                        <span>{rep.building}</span>
                        <span>•</span>
                        <span className="font-semibold">{rep.room}</span>
                      </div>
                    </td>

                    {/* Submitter */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                      <div className="font-semibold">{rep.user_name || 'Student'}</div>
                      <div className="text-[10px] text-slate-400">{rep.user_department}</div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge
                        priority={rep.priority}
                        isOverridden={rep.is_priority_overridden}
                      />
                    </td>

                    {/* Status & Quick Transition */}
                    <td
                      className="py-3.5 px-4 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={rep.status}
                        onChange={(e) => handleQuickStatusChange(rep.id, e.target.value as IssueStatus)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Assigned Crew */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                          rep.assigned_team
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-400 italic'
                        }`}
                      >
                        {rep.assigned_team || 'Unassigned'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNav('issue-detail', rep.id);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        Detail →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

