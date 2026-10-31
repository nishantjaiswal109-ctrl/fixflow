import React from 'react';
import { IssueCategory } from '../types';
import {
  Zap,
  Droplets,
  Building2,
  Armchair,
  Sparkles,
  Wifi,
  FlaskConical,
  HelpCircle,
} from 'lucide-react';

interface Props {
  category: IssueCategory | string;
  className?: string;
}

export const CategoryIcon: React.FC<Props> = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'Electrical':
      return <Zap className={`${className} text-amber-500`} />;
    case 'Plumbing':
      return <Droplets className={`${className} text-cyan-500`} />;
    case 'Infrastructure':
      return <Building2 className={`${className} text-indigo-500`} />;
    case 'Furniture':
      return <Armchair className={`${className} text-amber-700`} />;
    case 'Cleaning and Hygiene':
      return <Sparkles className={`${className} text-emerald-500`} />;
    case 'Internet and Networking':
      return <Wifi className={`${className} text-blue-500`} />;
    case 'Laboratory Equipment':
      return <FlaskConical className={`${className} text-purple-500`} />;
    default:
      return <HelpCircle className={`${className} text-slate-500`} />;
  }
};

