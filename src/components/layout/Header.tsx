import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { BookOpen, Users, Calendar, UserCheck, GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const navigationItems = [
    { id: 'course-types', label: 'Course Types', icon: BookOpen },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'offerings', label: 'Offerings', icon: Calendar },
    { id: 'registrations', label: 'Registrations', icon: UserCheck }
  ] as const;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">
              Student Registration System
            </h1>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: id })}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  state.ui.currentView === id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>

          <select
            className="md:hidden px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={state.ui.currentView}
            onChange={(e) => dispatch({ type: 'SET_VIEW', payload: e.target.value as any })}
          >
            {navigationItems.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;