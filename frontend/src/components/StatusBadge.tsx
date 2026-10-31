import React from 'react';
import { IssueStatus } from '../types';
import { Clock, CheckCircle2, AlertCircle, Wrench, FileSearch, Lock } from 'lucide-react';

interface Props {
  status: IssueStatus | string;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<Props> = ({ status, className = '', showIcon = true }) => {
  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = AlertCircle;

  switch (status) {
    case 'Submitted':
      bg = 'bg-blue-50 text-blue-700 border-blue-200';
      Icon = Clock;
      break;
    case 'Under Review':
      bg = 'bg-amber-50 text-amber-700 border-amber-200';
      Icon = FileSearch;
      break;
    case 'Assigned':
      bg = 'bg-purple-50 text-purple-700 border-purple-200';
      Icon = Wrench;
      break;
    case 'In Progress':
      bg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      Icon = Wrench;
      break;
    case 'Resolved':
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      Icon = CheckCircle2;
      break;
    case 'Closed':
      bg = 'bg-slate-100 text-slate-600 border-slate-200';
      Icon = Lock;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{status}</span>
    </span>
  );
};

