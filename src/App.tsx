import React, { useState } from "react";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ToastMessage from "./components/shared/ToastMessage";
import ConfirmDialog from "./components/shared/ConfirmDialog";

// Course Types Components
import CourseTypeList from "./components/course-types/CourseTypeList";
import CourseTypeForm from "./components/course-types/CourseTypeForm";

// Courses Components
import CourseList from "./components/courses/CourseList";
import CourseForm from "./components/courses/CourseForm";

// Offerings Components
import OfferingList from "./components/offerings/OfferingList";
import OfferingForm from "./components/offerings/OfferingForm";

// Registrations Components
import RegistrationList from "./components/registrations/RegistrationList";
import RegistrationForm from "./components/registrations/RegistrationForm";

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  // Form states
  const [showCourseTypeForm, setShowCourseTypeForm] = useState(false);
  const [editingCourseTypeId, setEditingCourseTypeId] = useState<string | undefined>();

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | undefined>();

  const [showOfferingForm, setShowOfferingForm] = useState(false);
  const [editingOfferingId, setEditingOfferingId] = useState<string | undefined>();

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Handlers
  const handleAddCourseType = () => { setEditingCourseTypeId(undefined); setShowCourseTypeForm(true); };
  const handleEditCourseType = (id: string) => { setEditingCourseTypeId(id); setShowCourseTypeForm(true); };
  const handleCloseCourseTypeForm = () => { setShowCourseTypeForm(false); setEditingCourseTypeId(undefined); };

  const handleAddCourse = () => { setEditingCourseId(undefined); setShowCourseForm(true); };
  const handleEditCourse = (id: string) => { setEditingCourseId(id); setShowCourseForm(true); };
  const handleCloseCourseForm = () => { setShowCourseForm(false); setEditingCourseId(undefined); };

  const handleAddOffering = () => { setEditingOfferingId(undefined); setShowOfferingForm(true); };
  const handleEditOffering = (id: string) => { setEditingOfferingId(id); setShowOfferingForm(true); };
  const handleCloseOfferingForm = () => { setShowOfferingForm(false); setEditingOfferingId(undefined); };

  const handleRegisterStudent = () => { setShowRegistrationForm(true); };
  const handleCloseRegistrationForm = () => { setShowRegistrationForm(false); };

  // View switcher
  const renderCurrentView = () => {
    switch (state.ui.currentView) {
      case "course-types":
        return <CourseTypeList onAdd={handleAddCourseType} onEdit={handleEditCourseType} />;
      case "courses":
        return <CourseList onAdd={handleAddCourse} onEdit={handleEditCourse} />;
      case "offerings":
        return <OfferingList onAdd={handleAddOffering} onEdit={handleEditOffering} />;
      case "registrations":
        return <RegistrationList onRegister={handleRegisterStudent} />;
      default:
        return (
          <div className="text-center py-20 text-xl font-semibold text-gray-600">
            🚀 View not found
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-100">
      {/* Header */}
      <div className="shadow-xl backdrop-blur bg-white/80 sticky top-0 z-50 rounded-b-3xl">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 transform hover:scale-[1.01] transition-all duration-300 ease-in-out">
          {renderCurrentView()}
        </div>
      </main>

      {/* Footer */}
      <div className="mt-10 bg-white/80 backdrop-blur shadow-inner rounded-t-2xl">
        <Footer />
        <p className="text-center text-xs py-3 text-gray-500">
          © {new Date().getFullYear()} Created with ❤️ by{" "}
          <span className="font-bold text-indigo-600">Saurav Jha</span>
        </p>
      </div>

      {/* Forms */}
      {showCourseTypeForm && (
        <CourseTypeForm editingId={editingCourseTypeId} onClose={handleCloseCourseTypeForm} />
      )}
      {showCourseForm && <CourseForm editingId={editingCourseId} onClose={handleCloseCourseForm} />}
      {showOfferingForm && (
        <OfferingForm editingId={editingOfferingId} onClose={handleCloseOfferingForm} />
      )}
      {showRegistrationForm && <RegistrationForm onClose={handleCloseRegistrationForm} />}

      {/* Global Components */}
      <ToastMessage />
      <ConfirmDialog />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
