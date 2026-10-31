import React from 'react';
import { PriorityLevel } from '../types';
import { Flame, AlertTriangle, MinusCircle, ShieldCheck } from 'lucide-react';

interface Props {
  priority: PriorityLevel | string;
  isOverridden?: boolean;
  className?: string;
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<Props> = ({
  priority,
  isOverridden = false,
  className = '',
  showIcon = true,
}) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = MinusCircle;

  switch (priority) {
    case 'Critical':
      style = 'bg-rose-50 text-rose-700 border-rose-200';
      Icon = Flame;
      break;
    case 'High':
      style = 'bg-orange-50 text-orange-700 border-orange-200';
      Icon = AlertTriangle;
      break;
    case 'Medium':
      style = 'bg-amber-50 text-amber-700 border-amber-200';
      Icon = MinusCircle;
      break;
    case 'Low':
      style = 'bg-slate-50 text-slate-600 border-slate-200';
      Icon = ShieldCheck;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${style} ${className}`}
      title={isOverridden ? 'Administrator priority override applied' : 'Calculated by AI Priority Engine'}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{priority}</span>
      {isOverridden && (
        <span className="text-[10px] uppercase font-bold tracking-wider px-1 bg-white/70 rounded">
          manual
        </span>
      )}
    </span>
  );
};

