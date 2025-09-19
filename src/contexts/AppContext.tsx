import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppAction } from '../utils/types';
import { appReducer } from './AppReducer';
import { loadFromStorage, generateId } from '../utils/storage';

const initialState: AppState = {
  courseTypes: [],
  courses: [],
  courseOfferings: [],
  students: [],
  registrations: [],
  ui: {
    selectedCourseTypeId: null,
    selectedOfferingId: null,
    currentView: 'course-types',
    toast: null,
    confirmDialog: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    }
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedData = loadFromStorage();
    if (Object.keys(savedData).length > 0) {
      dispatch({ type: 'LOAD_DATA', payload: savedData as any });
    } else {
      // Initialize with sample data
      const now = new Date().toISOString();
      
      const sampleCourseType = {
        id: generateId(),
        name: 'Individual',
        createdAt: now,
        updatedAt: now
      };
      
      const sampleCourse = {
        id: generateId(),
        name: 'English',
        createdAt: now,
        updatedAt: now
      };

      dispatch({ type: 'ADD_COURSE_TYPE', payload: sampleCourseType });
      dispatch({ type: 'ADD_COURSE', payload: sampleCourse });
    }
  }, []);

  useEffect(() => {
    if (state.ui.toast) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.ui.toast]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};