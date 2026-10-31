import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  ShieldAlert,
  UserCheck,
  LogOut,
  PlusCircle,
  BarChart3,
  CopyCheck,
  FileText,
  Home,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenReportModal?: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  setCurrentTab,
  onOpenReportModal,
}) => {
  const { user, logout, quickLoginDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav(user?.role === 'admin' ? 'admin-dashboard' : user ? 'student-dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  Fix<span className="text-cyan-400">Flow</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
                  Campus AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block">
                Report It. Track It. Fix It.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                <button
                  onClick={() => handleNav('landing')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'landing' ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNav('overview')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'overview' ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Project Overview</span>
                </button>
              </>
            ) : user.role === 'admin' ? (
              <>
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'admin-dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => handleNav('manage-reports')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'manage-reports' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>All Reports</span>
                </button>
                <button
                  onClick={() => handleNav('duplicate-review')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    currentTab === 'duplicate-review' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <CopyCheck className="w-4 h-4 text-amber-400" />
                  <span>AI Duplicates</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                </button>
                <button
                  onClick={() => handleNav('analytics')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => handleNav('overview')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'overview' ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Project Overview</span>
                </button>
              </>
            ) : (
              // Student navigation
              <>
                <button
                  onClick={() => handleNav('student-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'student-dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>My Dashboard</span>
                </button>
                <button
                  onClick={() => handleNav('submit-report')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'submit-report' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Report an Issue</span>
                </button>
                <button
                  onClick={() => handleNav('my-reports')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'my-reports' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>My Reports</span>
                </button>
                <button
                  onClick={() => handleNav('overview')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'overview' ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Project Overview</span>
                </button>
              </>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Demo Switcher for Judges */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                title="Quickly switch accounts for hackathon demonstration"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Judge Demo Switch</span>
              </button>

              {demoMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs"
                  onClick={() => setDemoMenuOpen(false)}
                >
                  <p className="px-2 py-1 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Switch Demo Persona
                  </p>
                  <button
                    onClick={async () => {
                      await quickLoginDemo('student');
                      handleNav('student-dashboard');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-700 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white">Alex Chen</div>
                      <div className="text-[11px] text-slate-400">Student (Computer Science)</div>
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                      Student
                    </span>
                  </button>

                  <button
                    onClick={async () => {
                      await quickLoginDemo('priya');
                      handleNav('student-dashboard');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-700 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white">Priya Sharma</div>
                      <div className="text-[11px] text-slate-400">Student (Submitted Fan Duplicate)</div>
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                      Student
                    </span>
                  </button>

                  <button
                    onClick={async () => {
                      await quickLoginDemo('admin');
                      handleNav('admin-dashboard');
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-700 flex items-center justify-between text-slate-200 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-white">Dr. Robert Vance</div>
                      <div className="text-[11px] text-slate-400">Campus Facilities Director</div>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-700">
                <div className="text-right">
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5 justify-end">
                    <span>{user.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 max-w-[160px] truncate">
                    {user.department || user.email}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {!user ? (
            <>
              <button
                onClick={() => handleNav('landing')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 text-sm font-medium"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('overview')}
                className="w-full text-left px-3 py-2 rounded-lg text-cyan-400 hover:bg-slate-800 text-sm font-medium"
              >
                Project Overview (13 Sections)
              </button>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2 text-center rounded-lg bg-slate-800 text-white text-sm font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2 text-center rounded-lg bg-blue-600 text-white text-sm font-semibold"
                >
                  Register
                </button>
              </div>
            </>
          ) : user.role === 'admin' ? (
            <>
              <button
                onClick={() => handleNav('admin-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium"
              >
                Admin Overview
              </button>
              <button
                onClick={() => handleNav('manage-reports')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium"
              >
                All Reports
              </button>
              <button
                onClick={() => handleNav('duplicate-review')}
                className="w-full text-left px-3 py-2 rounded-lg text-amber-400 hover:bg-slate-800 text-sm font-medium"
              >
                AI Duplicate Review
              </button>
              <button
                onClick={() => handleNav('analytics')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium"
              >
                Analytics & SLA
              </button>
              <button
                onClick={() => handleNav('overview')}
                className="w-full text-left px-3 py-2 rounded-lg text-cyan-400 hover:bg-slate-800 text-sm font-medium"
              >
                Project Overview
              </button>
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={logout}
                  className="w-full py-2 text-center rounded-lg bg-rose-500/20 text-rose-300 text-sm font-semibold"
                >
                  Sign Out ({user.name})
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('student-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium"
              >
                Student Dashboard
              </button>
              <button
                onClick={() => handleNav('submit-report')}
                className="w-full text-left px-3 py-2 rounded-lg text-emerald-400 hover:bg-slate-800 text-sm font-medium"
              >
                + Report a Problem
              </button>
              <button
                onClick={() => handleNav('my-reports')}
                className="w-full text-left px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800 text-sm font-medium"
              >
                My Reports
              </button>
              <button
                onClick={() => handleNav('overview')}
                className="w-full text-left px-3 py-2 rounded-lg text-cyan-400 hover:bg-slate-800 text-sm font-medium"
              >
                Project Overview
              </button>
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={logout}
                  className="w-full py-2 text-center rounded-lg bg-rose-500/20 text-rose-300 text-sm font-semibold"
                >
                  Sign Out ({user.name})
                </button>
              </div>
            </>
          )}

          {/* Judge Demo quick switcher in mobile */}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-1.5">
            <span className="text-[11px] text-amber-300 font-semibold">Judge Demo Persona Switch:</span>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await quickLoginDemo('student');
                  handleNav('student-dashboard');
                }}
                className="flex-1 py-1.5 text-xs bg-slate-800 text-slate-200 rounded border border-slate-700"
              >
                Alex (Student)
              </button>
              <button
                onClick={async () => {
                  await quickLoginDemo('admin');
                  handleNav('admin-dashboard');
                }}
                className="flex-1 py-1.5 text-xs bg-purple-900/50 text-purple-200 rounded border border-purple-700"
              >
                Dr. Vance (Admin)
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

