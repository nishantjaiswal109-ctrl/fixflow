import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { SubmitReportPage } from './pages/SubmitReportPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageReportsPage } from './pages/ManageReportsPage';
import { DuplicateReviewPage } from './pages/DuplicateReviewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProjectOverviewPage } from './pages/ProjectOverviewPage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleNav = (tab: string, reportId?: string) => {
    if (reportId) {
      setSelectedReportId(reportId);
    }

    // Role-based route guard
    const adminOnlyTabs = ['admin-dashboard', 'manage-reports', 'duplicate-review', 'analytics'];
    if (adminOnlyTabs.includes(tab)) {
      if (!user) {
        setCurrentTab('login');
        return;
      }
      if (user.role !== 'admin') {
        alert('Access Restricted: Administrator privileges required to access facilities management.');
        setCurrentTab('student-dashboard');
        return;
      }
    }

    const studentTabs = ['student-dashboard', 'submit-report', 'my-reports'];
    if (studentTabs.includes(tab) && !user) {
      setCurrentTab('login');
      return;
    }

    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-slate-300">Initializing FixFlow Platform...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentTab) {
      case 'landing':
        return <LandingPage onNav={handleNav} />;
      case 'login':
        return <LoginPage onNav={handleNav} />;
      case 'register':
        return <RegisterPage onNav={handleNav} />;
      case 'student-dashboard':
        return <StudentDashboard onNav={handleNav} />;
      case 'submit-report':
        return <SubmitReportPage onNav={handleNav} />;
      case 'my-reports':
        return <MyReportsPage onNav={handleNav} />;
      case 'issue-detail':
        return selectedReportId ? (
          <IssueDetailPage reportId={selectedReportId} onNav={handleNav} />
        ) : (
          <MyReportsPage onNav={handleNav} />
        );
      case 'admin-dashboard':
        return <AdminDashboard onNav={handleNav} />;
      case 'manage-reports':
        return <ManageReportsPage onNav={handleNav} />;
      case 'duplicate-review':
        return <DuplicateReviewPage onNav={handleNav} />;
      case 'analytics':
        return <AnalyticsPage onNav={handleNav} />;
      case 'overview':
        return <ProjectOverviewPage onNav={handleNav} />;
      default:
        return <LandingPage onNav={handleNav} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => handleNav(tab)}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNav={(tab) => handleNav(tab)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
