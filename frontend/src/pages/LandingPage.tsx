import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  Sparkles,
  ShieldCheck,
  Zap,
  Droplets,
  Building2,
  Armchair,
  Wifi,
  FlaskConical,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Clock,
  Layers,
  CopyCheck,
} from 'lucide-react';

interface Props {
  onNav: (tab: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onNav }) => {
  const { user, quickLoginDemo } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI-Powered Smart Campus Resolution Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            A Smarter Way to Fix <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
              Campus Problems
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            FixFlow centralizes university infrastructure complaints into an intelligent,
            transparent workflow. Featuring genuine <strong className="text-white">NLP duplicate-report detection</strong>,
            transparent rule-based priority scoring, and end-to-end status tracking for students and campus facilities.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNav(user ? 'submit-report' : 'login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-base group"
            >
              <span>Report a Problem</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNav('overview')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 text-base"
            >
              <span>Project Overview (13 Sections)</span>
            </button>
          </div>

          {/* Quick Demo Switcher Cards for Hackathon Judges */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-md max-w-3xl mx-auto shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Hackathon Evaluation Access — One-Click Personas
                </span>
              </div>
              <span className="text-xs text-slate-400">Pre-seeded realistic campus data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      STUDENT PERSONA
                    </span>
                    <span className="text-xs text-slate-400">Alex Chen (CS Dept)</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Student Experience Portal</h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Submit new issues, test duplicate suggestions, and track personal report lifecycles.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await quickLoginDemo('student');
                    onNav('student-dashboard');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Launch Student Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      ADMINISTRATOR PERSONA
                    </span>
                    <span className="text-xs text-slate-400">Dr. Robert Vance</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Facilities Admin Dashboard</h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Review NLP duplicate detections, assign maintenance teams, and review campus metrics.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await quickLoginDemo('admin');
                    onNav('admin-dashboard');
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Launch Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Differentiator: NLP Duplicate Detection Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            FixFlow Innovation Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4">
            How NLP Eliminates Campus Duplicate Chaos
          </h2>
          <p className="text-base text-slate-600">
            When 20 students report the same broken ceiling fan or ruptured pipe, traditional maintenance teams
            get flooded with disconnected tickets. FixFlow uses TF-IDF cosine similarity to cluster and highlight duplicates.
          </p>
        </div>

        {/* Live Duplicate Example Card Comparison */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-10 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                Real-World Institutional Scenario
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Room 204 Ceiling Fan Outage in Science Block
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-amber-800 font-bold text-sm">
              <CopyCheck className="w-5 h-5 text-amber-600" />
              <span>87.5% NLP Match Detected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Existing Report #FIX-2026-1001</span>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Under Review</span>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">"Fan is not working in Room 204"</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                "The ceiling fan in classroom 204 makes a buzzing noise when switched on and does not rotate at all. It is getting very hot during afternoon lectures."
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span className="bg-white px-2 py-1 rounded border border-slate-200">Science Block</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200">2nd Floor</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200">Room 204</span>
                <span className="bg-white px-2 py-1 rounded border border-slate-200">Electrical</span>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-600 uppercase">Incoming Report #FIX-2026-1002</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">Submitted</span>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">"The ceiling fan in classroom 204 has stopped working"</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                "Fan stopped spinning completely in room 204 science block. Needs urgent electrical inspection or capacitor replacement."
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span className="bg-white px-2 py-1 rounded border border-blue-200">Science Block</span>
                <span className="bg-white px-2 py-1 rounded border border-blue-200">2nd Floor</span>
                <span className="bg-white px-2 py-1 rounded border border-blue-200">Room 204</span>
                <span className="bg-white px-2 py-1 rounded border border-blue-200">Electrical</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-slate-700">
                <strong>FixFlow AI Verdict:</strong> High text correlation (81.2%), matching facility category, and identical classroom location. Suggested for administrative grouping to save technician labor hours.
              </p>
            </div>
            <button
              onClick={async () => {
                await quickLoginDemo('admin');
                onNav('duplicate-review');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
            >
              Test Review Action →
            </button>
          </div>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Fast Issue Submission</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Report campus faults with building, floor, room number, urgency tags, and photo evidence in under 30 seconds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <CopyCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">NLP Duplicate Detection</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uses Scikit-Learn TF-IDF vectorization and cosine similarity to prevent fragmented duplicate work orders.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Transparent Prioritization</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rule-based scoring mechanism that analyzes severity, repeat complaints, safety hazards, and unresolved aging.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 mb-2">End-to-End Tracking</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students and administrators track every status transition with timestamped activity history from submission to resolution.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="py-16 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step-by-Step Lifecycle</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">How FixFlow Resolves Issues</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-3">1</span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Student Submits</h4>
              <p className="text-xs text-slate-500">Student logs in and submits report with category, room, and photo.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-3">2</span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">AI Duplicate Scan</h4>
              <p className="text-xs text-slate-500">NLP engine runs TF-IDF vectorization against unresolved complaints.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-3">3</span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Priority Suggested</h4>
              <p className="text-xs text-slate-500">Transparent engine calculates Critical, High, Medium, or Low priority.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center mb-3">4</span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Admin Triage</h4>
              <p className="text-xs text-slate-500">Facilities director assigns maintenance team and confirms duplicates.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-3">5</span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Issue Resolved</h4>
              <p className="text-xs text-slate-500">Technician completes repair, updates status, and student gets notified.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Comprehensive Campus Coverage</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Standardized Maintenance Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Electrical', desc: 'Fans, lights, wiring & switches', icon: Zap, color: 'text-amber-500' },
            { name: 'Plumbing', desc: 'Leaks, washrooms & water coolers', icon: Droplets, color: 'text-cyan-500' },
            { name: 'Infrastructure', desc: 'Doors, windows, stairs & walls', icon: Building2, color: 'text-indigo-500' },
            { name: 'Furniture', desc: 'Desks, benches, podiums & chairs', icon: Armchair, color: 'text-amber-700' },
            { name: 'Cleaning & Hygiene', desc: 'Waste disposal & sanitization', icon: Sparkles, color: 'text-emerald-500' },
            { name: 'Internet & Networking', desc: 'Wi-Fi APs, Ethernet & LAN', icon: Wifi, color: 'text-blue-500' },
            { name: 'Laboratory Equipment', desc: 'Centrifuges, scopes & sensors', icon: FlaskConical, color: 'text-purple-500' },
            { name: 'General Facilities', desc: 'Signage, grounds & other assets', icon: Wrench, color: 'text-slate-500' },
          ].map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:border-blue-300 transition-colors">
                <Icon className={`w-8 h-8 ${cat.color} mx-auto mb-2`} />
                <h4 className="font-bold text-sm text-slate-900 mb-1">{cat.name}</h4>
                <p className="text-[11px] text-slate-500">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-slate-900 text-white py-16 px-4 text-center mt-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience FixFlow?</h2>
          <p className="text-slate-300 text-sm mb-8">
            Explore the live application now. Switch between student reporting and facilities administration in one click.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={async () => {
                await quickLoginDemo('student');
                onNav('student-dashboard');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all"
            >
              Sign In as Student Demo
            </button>
            <button
              onClick={async () => {
                await quickLoginDemo('admin');
                onNav('admin-dashboard');
              }}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all"
            >
              Sign In as Admin Demo
            </button>
            <button
              onClick={() => onNav('overview')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm"
            >
              Read Project Overview (13 Sections)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

