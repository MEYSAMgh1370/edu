import React, { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Views
import { DashboardView } from './views/DashboardView';
import { PeopleView } from './views/PeopleView';
import { RolesView } from './views/RolesView';
import { ClassesView } from './views/ClassesView';
import { StudentsView } from './views/StudentsView';
import { GradesView } from './views/GradesView';
import { AttendanceView } from './views/AttendanceView';
import { AttendanceSheetPrintView } from './views/AttendanceSheetPrintView';
import { TimetableGridView } from './views/TimetableGridView';
import { CurriculumView } from './views/CurriculumView';
import { ExamsView } from './views/ExamsView';
import { ExamTakeView } from './views/ExamTakeView';
import { QuestionBoxView } from './views/QuestionBoxView';
import { QuestionSheetPrintView } from './views/QuestionSheetPrintView';
import { StudyPlansView } from './views/StudyPlansView';
import { FinanceView } from './views/FinanceView';
import { ExpensesView } from './views/ExpensesView';
import {
  MyGradesView,
  MyExamsView,
  MyAttendanceView,
  MyStudyPlanView,
  MyTimetableView,
  MyInvoicesView
} from './views/PersonalPortalViews';
import { SettingsView } from './views/SettingsView';
import { CalendarView } from './views/CalendarView';
import { PromotionView } from './views/PromotionView';
import { SchoolNewView } from './views/SchoolNewView';
import { SchoolPublicView } from './views/SchoolPublicView';
import { LandingView } from './views/LandingView';

const MainAppContent: React.FC = () => {
  const { currentUser, currentSchool, login } = useApp();

  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeExamId, setActiveExamId] = useState<string>('exm-1');
  const [activeSheetId, setActiveSheetId] = useState<string>('qs-1');

  // Handle navigation
  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not logged in, show Landing page by default
  if (!currentUser) {
    return (
      <LandingView
        onEnterApp={() => setCurrentPage('dashboard')}
        onOpenRegisterSchool={() => {
          login('admin@roshdeandishe.test');
          setCurrentPage('schools_new');
        }}
      />
    );
  }

  // Standalone full-screen views (no standard navbar / sidebar)
  if (currentPage === 'landing') {
    return (
      <LandingView
        onEnterApp={() => navigate('dashboard')}
        onOpenRegisterSchool={() => navigate('schools_new')}
      />
    );
  }

  if (currentPage === 'public_entry') {
    return (
      <SchoolPublicView
        onBackToApp={() => navigate('dashboard')}
        onLoginClick={() => navigate('my_grades')}
      />
    );
  }

  if (currentPage === 'attendance_print') {
    return <AttendanceSheetPrintView onBack={() => navigate('attendance')} />;
  }

  if (currentPage === 'question_sheet_print') {
    return (
      <QuestionSheetPrintView
        sheetId={activeSheetId}
        onBack={() => navigate('question_box')}
      />
    );
  }

  if (currentPage === 'exam_take') {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <ExamTakeView
          examId={activeExamId}
          onFinish={() => navigate('exams')}
        />
      </div>
    );
  }

  // Render view router inside layout
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardView onNavigate={navigate} />;
      case 'schools_new':
        return (
          <SchoolNewView
            onSuccess={() => navigate('dashboard')}
            onCancel={() => navigate('dashboard')}
          />
        );
      case 'people':
        return <PeopleView />;
      case 'roles':
        return <RolesView />;
      case 'classes':
        return <ClassesView />;
      case 'students':
        return <StudentsView />;
      case 'grades':
        return <GradesView />;
      case 'attendance':
        return <AttendanceView onNavigate={navigate} />;
      case 'timetable':
        return <TimetableGridView />;
      case 'curriculum':
        return <CurriculumView />;
      case 'exams':
        return (
          <ExamsView
            onStartExam={id => {
              setActiveExamId(id);
              navigate('exam_take');
            }}
          />
        );
      case 'question_box':
        return (
          <QuestionBoxView
            onPrintSheet={id => {
              setActiveSheetId(id);
              navigate('question_sheet_print');
            }}
          />
        );
      case 'study_plans':
        return <StudyPlansView />;
      case 'finance':
        return <FinanceView />;
      case 'expenses':
        return <ExpensesView />;
      case 'my_grades':
        return <MyGradesView />;
      case 'my_exams':
        return (
          <MyExamsView
            onStartExam={id => {
              setActiveExamId(id);
              navigate('exam_take');
            }}
          />
        );
      case 'my_attendance':
        return <MyAttendanceView />;
      case 'my_study_plan':
        return <MyStudyPlanView />;
      case 'my_timetable':
        return <MyTimetableView />;
      case 'my_invoices':
        return <MyInvoicesView />;
      case 'settings':
        return <SettingsView />;
      case 'calendar':
        return <CalendarView />;
      case 'promotion':
        return <PromotionView />;
      default:
        return <DashboardView onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={navigate}
      />

      <div className="flex flex-1">
        <Sidebar
          currentPage={currentPage}
          onNavigate={navigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
