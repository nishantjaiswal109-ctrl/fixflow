import React from 'react';
import { Wrench, ShieldCheck, Cpu, Heart } from 'lucide-react';

interface Props {
  onNav: (tab: string) => void;
}

export const Footer: React.FC<Props> = ({ onNav }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Fix<span className="text-cyan-400">Flow</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              FixFlow is an intelligent campus maintenance and issue-management platform.
              Powered by genuine NLP duplicate detection, transparent rule-based prioritization,
              and end-to-end lifecycle tracking.
            </p>
            <blockquote className="border-l-2 border-cyan-400 pl-3 italic text-xs text-slate-400">
              "FixFlow is not just a platform for reporting problems; it is a smarter way to make campuses more responsive, accountable and efficient."
            </blockquote>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNav('student-dashboard')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Student Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('submit-report')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Submit Maintenance Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('admin-dashboard')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Administrative Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('duplicate-review')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  NLP Duplicate Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNav('analytics')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Institutional Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Project & Hackathon Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Hackathon Documentation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNav('overview')}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  Project Overview (13 Sections)
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>TF-IDF & Cosine Similarity Engine</span>
              </li>
              <li className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Role-Based Access Control (RBAC)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} FixFlow Platform. Built for Smart Campus Innovation.</p>
          <p className="flex items-center gap-1">
            Engineered with Fast & Precision for Campus Facilities Management
          </p>
        </div>
      </div>
    </footer>
  );
};

