import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  Cpu,
  Layers,
  TrendingUp,
  Target,
  Users,
  Building,
  CheckCircle2,
  Workflow,
  DollarSign,
  Award,
  Lock,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  onNav: (tab: string) => void;
}

export const ProjectOverviewPage: React.FC<Props> = ({ onNav }) => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (idx: number) => {
    setActiveSection(activeSection === idx ? null : idx);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Official Project Justification Dossier
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 mb-4 tracking-tight">
          About FixFlow
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Comprehensive Architectural, Functional, Strategic & Engineering Specification.
          Designed for hackathon judges, university administrators, and software evaluators.
        </p>
      </div>

      {/* Quick Jump Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl mb-12 shadow-lg border border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>13 Justification Sections Navigation</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            '1. Introduction',
            '2. Problem Statement',
            '3. Proposed Solution',
            '4. Project Objectives',
            '5. Target Audience',
            '6. Key Features',
            '7. How System Works',
            '8. Technical Architecture',
            '9. Monetization Strategy',
            '10. Competitive Advantage',
            '11. Data Privacy & Security',
            '12. Future Scope',
            '13. Conclusion',
          ].map((sec, i) => (
            <a
              key={i}
              href={`#section-${i + 1}`}
              className="bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors border border-slate-700/60"
            >
              {sec}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-12 text-slate-800">
        {/* SECTION 1: INTRODUCTION */}
        <section id="section-1" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              1
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">INTRODUCTION</h2>
          </div>
          <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              Educational institutions encompass diverse, complex physical infrastructures comprising lecture halls,
              research laboratories, student residences, athletic centers, libraries, and central administration blocks.
              With thousands of students and faculty members utilizing these facilities daily, equipment wear-and-tear and
              structural faults are inevitable. However, managing maintenance across expansive university campuses remains
              one of higher education's most persistent operational challenges.
            </p>
            <p>
              <strong>FixFlow</strong> is an intelligent, full-stack campus maintenance and issue-resolution platform engineered
              specifically to modernize institutional facility management. FixFlow connects students, campus administrators,
              and maintenance teams through a single, responsive digital platform.
            </p>
            <p>
              By leveraging genuine Natural Language Processing (NLP) techniques and transparent priority scoring, FixFlow
              transforms unstructured student complaints into organized, actionable work orders. The platform eliminates
              the chaos of duplicate reports, provides students with transparent real-time resolution tracking, and equips
              campus directors with granular facilities analytics.
            </p>
          </div>
        </section>

        {/* SECTION 2: PROBLEM STATEMENT */}
        <section id="section-2" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              2
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">PROBLEM STATEMENT</h2>
          </div>
          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              In traditional university setups, reporting campus maintenance issues is disorganized, frustrating, and opaque.
              Specific operational challenges observed in real institutional environments include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Fragmented Communication Channels</h4>
                <p className="text-xs text-slate-600">
                  Complaints are scattered across informal WhatsApp messages, physical logbooks in hostel lobbies,
                  verbal mentions to janitorial staff, and disparate department emails. Tickets easily get lost.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Unfiltered Duplicate Flooding</h4>
                <p className="text-xs text-slate-600">
                  When a classroom projector, ceiling fan, or corridor water pipe fails, dozens of students report the same problem
                  using different phrasing. Facilities managers treat them as unrelated tickets, wasting technician triage hours.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Zero Visibility & "Black Box" Triage</h4>
                <p className="text-xs text-slate-600">
                  Students receive no confirmation or progress tracking after reporting a fault. Without updates, students
                  submit repeat tickets or assume administration negligence.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Lack of Maintenance Intelligence</h4>
                <p className="text-xs text-slate-600">
                  Facilities directors lack aggregate data on which buildings fail most frequently, which equipment has recurring
                  defects, or whether contractor SLAs are being upheld.
                </p>
              </div>
            </div>
            <p>
              These deficiencies degrade the student academic experience, cause structural damage escalation (such as unaddressed
              water leaks deteriorating masonry), and increase long-term institutional repair costs.
            </p>
          </div>
        </section>

        {/* SECTION 3: PROPOSED SOLUTION */}
        <section id="section-3" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              3
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">PROPOSED SOLUTION</h2>
          </div>
          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              FixFlow replaces chaotic, fragmented reporting with a unified, cloud-ready digital platform. The solution
              integrates structured student reporting, automated text analysis, duplicate clustering, and operational dispatch:
            </p>
            <ul className="space-y-2 pl-4 list-disc marker:text-blue-600">
              <li>
                <strong>Structured Digital Reporting:</strong> Students submit maintenance tickets in seconds, categorized across 8 standardized domains with building, floor, room specifics, and optional photo verification.
              </li>
              <li>
                <strong>NLP-Driven Duplicate Correlation:</strong> A built-in Scikit-Learn TF-IDF vectorization and cosine similarity engine detects incoming reports describing existing unresolved issues and highlights matches for administrative grouping.
              </li>
              <li>
                <strong>Transparent Priority Scoring:</strong> Rule-based algorithmic scoring factors reported severity, repeat corroboration count, active hazard urgency, and unresolved aging without black-box opacity.
              </li>
              <li>
                <strong>Lifecycle Status Progression:</strong> End-to-end tracking (Submitted → Under Review → Assigned → In Progress → Resolved → Closed) with timestamped activity history.
              </li>
              <li>
                <strong>Centralized Administrative Command:</strong> Facilities leadership monitors campus hotspots, assigns specialized crews, and tracks resolution velocity (MTTR).
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 4: PROJECT OBJECTIVES */}
        <section id="section-4" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              4
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">PROJECT OBJECTIVES</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            {[
              { num: '01', title: 'Centralize Maintenance', desc: 'Provide a single official digital channel replacing paper logs, verbal complaints, and scattered emails.' },
              { num: '02', title: 'Simplify Student Reporting', desc: 'Enable quick, intuitive issue submission with photo upload and location specifics in under 30 seconds.' },
              { num: '03', title: 'Detect Duplicate Reports via NLP', desc: 'Correlate semantically related complaints using TF-IDF cosine similarity to prevent redundant work orders.' },
              { num: '04', title: 'Improve Issue Prioritization', desc: 'Compute objective, explainable priority recommendations based on safety hazards, corroboration, and duration.' },
              { num: '05', title: 'Increase Administrative Transparency', desc: 'Eliminate the black-box reporting experience by keeping students informed at every lifecycle step.' },
              { num: '06', title: 'Track Complete Lifecycle', desc: 'Record a persistent, timestamped audit trail of status transitions, crew dispatches, and resolution notes.' },
              { num: '07', title: 'Generate Actionable Insights', desc: 'Provide facilities directors with interactive metrics on building reliability, category volume, and MTTR.' },
              { num: '08', title: 'Enhance Campus Collaboration', desc: 'Bridge the communication gap between students, facility managers, and specialized maintenance crews.' },
            ].map((obj, i) => (
              <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="font-extrabold text-blue-600 font-mono text-sm">{obj.num}</span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-0.5">{obj.title}</h4>
                  <p className="text-slate-500">{obj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: TARGET AUDIENCE */}
        <section id="section-5" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              5
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">TARGET AUDIENCE</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 text-sm mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Primary Stakeholders</span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <strong className="text-slate-900 block">College and University Students:</strong>
                  Benefit from a reliable, modern portal to report classroom, lab, and hostel malfunctions with transparent progress updates.
                </li>
                <li>
                  <strong className="text-slate-900 block">Campus Facilities Administrators:</strong>
                  Benefit from a centralized dashboard, automated duplicate warnings, SLA aging timers, and automated priority triage.
                </li>
                <li>
                  <strong className="text-slate-900 block">Campus Maintenance Teams & Contractors:</strong>
                  Benefit from structured work orders specifying precise building, floor, room locations, and photo evidence.
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-600" />
                <span>Secondary & Institutional Stakeholders</span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <strong className="text-slate-900 block">Educational Institutions & Universities:</strong>
                  Gain institutional data on asset reliability and optimize annual maintenance budgeting.
                </li>
                <li>
                  <strong className="text-slate-900 block">Hostel & Student Housing Management:</strong>
                  Streamlines residential repairs (plumbing leaks, electrical faults) that directly impact living conditions.
                </li>
                <li>
                  <strong className="text-slate-900 block">Laboratory Supervisors:</strong>
                  Rapidly isolate hazardous instrument malfunctions (centrifuges, autoclaves, ventilation).
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 6: KEY FEATURES */}
        <section id="section-6" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              6
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">KEY FEATURES</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Clearly distinguishing implemented, tested MVP capabilities from future roadmap enhancements:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fully Implemented & Functional in MVP</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {[
                  'Secure Role-Based Authentication (Student vs Admin with PBKDF2 hashing & JWT tokens)',
                  'Personal Student Dashboard with live stats and submission history',
                  'Structured Issue Submission Form (8 categories, building, floor, room, severity, photo)',
                  'NLP Duplicate Detection using Scikit-Learn TF-IDF vectorization & Cosine Similarity',
                  'Transparent Rule-Based Priority Engine with explainable scoring breakdown',
                  'Administrative Review Center to confirm or reject suggested duplicates',
                  'End-to-End Status Lifecycle Stepper (Submitted → Under Review → Assigned → In Progress → Resolved → Closed)',
                  'Timestamped Activity History Log for every status transition and work order note',
                  'Comprehensive Admin Dashboard with Recharts analytics (Categories, Buildings, Priorities, Aging)',
                  'Full search, multi-criteria filtering, and column sorting on reports table',
                  'One-click demo account switcher for hackathon judges with pre-seeded demo records',
                ].map((feat, i) => (
                  <div key={i} className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Planned Future Features (Roadmap)</span>
              </h3>
              <div className="space-y-2 text-xs text-slate-600">
                {[
                  'Native iOS & Android mobile applications with push notifications',
                  'Deep-learning Computer Vision model to detect cracked walls & leaks from photos',
                  'QR-Code desk/room stickers for instant scan-and-report without typing',
                  'WhatsApp & SMS chatbot integration for quick verbal defect logging',
                  'Direct integration with institutional ERPs (SAP Higher Ed, Ellucian Banner)',
                  'Automated contractor invoicing and procurement work order generation',
                  'IoT sensor integration for proactive automated fault logging',
                ].map((feat, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                    <span className="text-slate-400 font-bold">○</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: HOW THE SYSTEM WORKS */}
        <section id="section-7" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              7
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">HOW THE SYSTEM WORKS</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            The end-to-end 10-step institutional workflow powering FixFlow:
          </p>

          <div className="space-y-3">
            {[
              { step: 1, title: 'Student Authentication', desc: 'Student securely logs into FixFlow via institutional email credentials.' },
              { step: 2, title: 'Defect Submission', desc: 'Student fills out the report form with title, description, category, building, floor, room number, urgency, and optional photo.' },
              { step: 3, title: 'Backend Validation & Ingestion', desc: 'FastAPI validates inputs, inspects MIME type and size of uploaded photos, and generates a unique ID (e.g. FIX-2026-8492).' },
              { step: 4, title: 'NLP Duplicate Scanning', desc: 'The NLP engine extracts title and description, runs TF-IDF vectorization against existing open issues, and computes cosine similarity.' },
              { step: 5, title: 'Composite Match Computation', desc: 'The engine combines text similarity, category matching, and building/room correlation. Matches exceeding the threshold are flagged.' },
              { step: 6, title: 'Transparent Priority Scoring', desc: 'The priority engine evaluates severity, repeat corroboration, active hazard status, and unresolved aging, outputting an explainable priority level.' },
              { step: 7, title: 'Administrative Review & Triage', desc: 'Facilities directors review pending duplicate suggestions, confirming or dismissing them, and assign specialized maintenance crews.' },
              { step: 8, title: 'Maintenance Field Execution', desc: 'Technicians receive structured location details and work order notes, proceeding to the site to execute physical repairs.' },
              { step: 9, title: 'Status Transition & Audit Logging', desc: 'Administrator transitions status to "In Progress" and eventually "Resolved", appending notes to the timestamped history.' },
              { step: 10, title: 'Student Notification & Closure', desc: 'Student tracks the live progression on their dashboard and inspects technician resolution comments.' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {s.step}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">{s.title}</h4>
                  <p className="text-slate-600 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Diagram Card */}
          <div className="mt-8 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-4 flex items-center gap-2">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <span>Interactive Workflow Diagram</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <div className="font-bold text-white mb-1">Student</div>
                <div className="text-[11px] text-slate-400">Reports defect with photo & room</div>
              </div>
              <div className="flex items-center justify-center text-cyan-400 font-bold">→</div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <div className="font-bold text-cyan-300 mb-1">AI NLP Engine</div>
                <div className="text-[11px] text-slate-400">TF-IDF & Cosine Similarity match</div>
              </div>
              <div className="flex items-center justify-center text-cyan-400 font-bold">→</div>
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <div className="font-bold text-purple-300 mb-1">Admin Triage</div>
                <div className="text-[11px] text-slate-400">Confirms duplicate & assigns crew</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: TECHNICAL ARCHITECTURE */}
        <section id="section-8" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              8
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">TECHNICAL ARCHITECTURE</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">Frontend</strong>
              <p className="text-slate-600">
                React 19 + TypeScript + Vite. Fast reactive SPA, component modularity, strict typing, Lucide icons, and Tailwind CSS v4 styling.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">Backend API</strong>
              <p className="text-slate-600">
                Python 3.15 + FastAPI. Asynchronous, high-performance RESTful API endpoints with Pydantic schema validation and PBKDF2 password hashing.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">AI / NLP Engine</strong>
              <p className="text-slate-600">
                Scikit-Learn (TF-IDF Vectorization, n-gram ranges 1-2, sublinear term frequency, cosine similarity matrix calculation).
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block text-sm mb-1">Database & ORM</strong>
              <p className="text-slate-600">
                SQLite 3 with SQLAlchemy 2.0 ORM. Clean relational schema readily migratable to PostgreSQL in enterprise production.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 font-mono text-xs">
            <p className="text-cyan-400 font-bold mb-2">// Information Flow Architecture</p>
            <p className="text-slate-300">
              User (Browser) ⇄ React Vite UI ⇄ HTTP REST (JSON & Multipart) ⇄ FastAPI Server ⇄ SQLAlchemy ORM ⇄ SQLite DB
            </p>
            <p className="text-slate-400 mt-2">
              ↳ During Submission: FastAPI ⇄ Scikit-Learn TF-IDF Cosine Similarity Matrix ⇄ DuplicateSuggestion Records
            </p>
          </div>
        </section>

        {/* SECTION 9: MONETIZATION STRATEGY */}
        <section id="section-9" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              9
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">MONETIZATION STRATEGY</h2>
          </div>
          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              FixFlow operates on a realistic <strong>B2B Enterprise SaaS subscription model</strong> where educational
              institutions pay an annual or monthly license based on student enrollment count and campus facilities scale.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <span className="font-extrabold text-slate-900 text-sm block mb-1">Tier 1: Starter Campus</span>
                <p className="text-slate-500 mb-3">For single-site colleges (&lt; 2,500 students)</p>
                <ul className="space-y-1 text-slate-600">
                  <li>• Unlimited student reports</li>
                  <li>• NLP duplicate detection</li>
                  <li>• Standard email notifications</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                <span className="font-extrabold text-blue-900 text-sm block mb-1">Tier 2: Institutional Pro</span>
                <p className="text-blue-700/80 mb-3">For large universities (2,500 – 15,000 students)</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• Advanced analytics & MTTR metrics</li>
                  <li>• Custom priority weighting rules</li>
                  <li>• Multi-department work order routing</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
                <span className="font-extrabold text-purple-900 text-sm block mb-1">Tier 3: Multi-Campus Enterprise</span>
                <p className="text-purple-700/80 mb-3">For university systems with multiple regional sites</p>
                <ul className="space-y-1 text-slate-700">
                  <li>• Multi-campus unified dashboard</li>
                  <li>• Institutional ERP & SSO integration</li>
                  <li>• Dedicated SLA & on-prem deployment</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Secondary revenue streams include customized ERP integrations, enterprise single sign-on (SSO) configuration,
              and specialized contractor mobile license add-ons.
            </p>
          </div>
        </section>

        {/* SECTION 10: COMPETITIVE ADVANTAGE */}
        <section id="section-10" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              10
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">COMPETITIVE ADVANTAGE</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Direct comparison between traditional campus workflows and FixFlow:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider">
                  <th className="p-3 border border-slate-200">Feature Dimension</th>
                  <th className="p-3 border border-slate-200">Traditional Physical Register</th>
                  <th className="p-3 border border-slate-200">WhatsApp / Email Groups</th>
                  <th className="p-3 border border-slate-200">Generic Issue Trackers (JIRA)</th>
                  <th className="p-3 border border-slate-200 bg-blue-50 text-blue-900 font-extrabold">FixFlow Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Duplicate Handling</td>
                  <td className="p-3 text-rose-600">None (Manual reading)</td>
                  <td className="p-3 text-rose-600">None (Chat flood)</td>
                  <td className="p-3 text-amber-600">Exact title search only</td>
                  <td className="p-3 bg-blue-50/50 font-bold text-blue-700">NLP TF-IDF + Cosine Similarity</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Campus Location Awareness</td>
                  <td className="p-3 text-slate-500">Unstandardized handwritten</td>
                  <td className="p-3 text-slate-500">Ambiguous informal text</td>
                  <td className="p-3 text-slate-500">Generic custom fields</td>
                  <td className="p-3 bg-blue-50/50 font-bold text-blue-700">Hierarchical (Building/Floor/Room)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Student Progress Visibility</td>
                  <td className="p-3 text-rose-600">Zero (Black box)</td>
                  <td className="p-3 text-amber-600">Unorganized replies</td>
                  <td className="p-3 text-slate-500">Overly technical UI</td>
                  <td className="p-3 bg-blue-50/50 font-bold text-blue-700">Clean 6-Step Visual Timeline</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Priority Scoring</td>
                  <td className="p-3 text-slate-500">Arbitrary</td>
                  <td className="p-3 text-slate-500">Whoever complains loudest</td>
                  <td className="p-3 text-slate-500">Manual triage field</td>
                  <td className="p-3 bg-blue-50/50 font-bold text-blue-700">Transparent Rule-Based Scoring</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-800">Facilities Analytics</td>
                  <td className="p-3 text-rose-600">None</td>
                  <td className="p-3 text-rose-600">None</td>
                  <td className="p-3 text-slate-500">Developer-centric charts</td>
                  <td className="p-3 bg-blue-50/50 font-bold text-blue-700">Building Hotspots & MTTR SLA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 11: DATA PRIVACY AND SECURITY */}
        <section id="section-11" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              11
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">DATA PRIVACY AND SECURITY</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <strong className="text-slate-900 block text-sm">Role-Based Access Control (RBAC)</strong>
              <p>Strict endpoint authorization ensures students cannot inspect other students' private complaints or perform administrative triage simply by manipulating client-side state.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <strong className="text-slate-900 block text-sm">Cryptographic Password Protection</strong>
              <p>Passwords are never stored in plaintext. They are protected using PBKDF2-HMAC-SHA256 with cryptographically random unique salts and constant-time digest comparison.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <strong className="text-slate-900 block text-sm">Zero External AI Data Leaks</strong>
              <p>FixFlow's NLP engine runs entirely locally inside the institutional backend using Scikit-Learn. Student complaint text is never sent to external commercial AI APIs.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <strong className="text-slate-900 block text-sm">Secure Media Upload Inspection</strong>
              <p>All file uploads are inspected on the backend for authorized image MIME types (JPG, PNG, WEBP), sanitized with randomized UUID identifiers, and capped at 5MB.</p>
            </div>
          </div>
        </section>

        {/* SECTION 12: FUTURE SCOPE */}
        <section id="section-12" className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-600/30">
              12
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">FUTURE SCOPE</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Mobile Native Apps</h4>
              <p>React Native cross-platform apps for iOS and Android with camera quick-capture and push notification alerts.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Computer Vision Classification</h4>
              <p>Automated visual defect identification to recognize water leaks, electrical hazards, and broken furniture from pictures.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 text-sm mb-1">QR-Code Fast Reporting</h4>
              <p>Desks, classrooms, and laboratory stations equipped with unique QR codes for instant single-tap defect logging.</p>
            </div>
          </div>
        </section>

        {/* SECTION 13: CONCLUSION */}
        <section id="section-13" className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-blue-800 scroll-mt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center">
              13
            </span>
            <h2 className="text-2xl font-extrabold text-white">CONCLUSION</h2>
          </div>
          <div className="text-sm text-slate-200 leading-relaxed space-y-4">
            <p>
              FixFlow transforms an unorganized, opaque campus complaint process into a centralized, transparent,
              and intelligent resolution workflow. By combining modern web technologies, accessible student UI,
              genuine NLP duplicate detection, explainable priority calculations, and granular facilities analytics,
              FixFlow offers an immediate, practical solution for colleges, universities, and educational campuses.
            </p>
            <p>
              The platform demonstrates how focused artificial intelligence and modern software engineering can resolve
              real-world institutional bottlenecks, reduce campus operational costs, and elevate student satisfaction.
            </p>
            <blockquote className="border-l-4 border-cyan-400 pl-4 py-2 italic font-semibold text-base sm:text-lg text-cyan-200 bg-slate-800/60 rounded-r-xl">
              "FixFlow is not just a platform for reporting problems; it is a smarter way to make campuses more responsive, accountable and efficient."
            </blockquote>
          </div>
        </section>
      </div>

      {/* Bottom Action */}
      <div className="mt-12 text-center">
        <button
          onClick={() => onNav('landing')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
        >
          <span>Return to Application Demo</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
