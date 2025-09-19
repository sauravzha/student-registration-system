export interface CourseType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseOffering {
  id: string;
  courseId: string;
  courseTypeId: string;
  displayName: string;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  studentId: string;
  offeringId: string;
  registeredAt: string;
  status: 'registered' | 'cancelled';
}

export interface AppState {
  courseTypes: CourseType[];
  courses: Course[];
  courseOfferings: CourseOffering[];
  students: Student[];
  registrations: Registration[];
  ui: {
    selectedCourseTypeId: string | null;
    selectedOfferingId: string | null;
    currentView: 'course-types' | 'courses' | 'offerings' | 'registrations';
    toast: {
      message: string;
      type: 'success' | 'error' | 'info';
    } | null;
    confirmDialog: {
      isOpen: boolean;
      title: string;
      message: string;
      onConfirm: (() => void) | null;
    };
  };
}

export type AppAction = 
  | { type: 'SET_VIEW'; payload: AppState['ui']['currentView'] }
  | { type: 'SET_SELECTED_COURSE_TYPE'; payload: string | null }
  | { type: 'SET_SELECTED_OFFERING'; payload: string | null }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SHOW_CONFIRM_DIALOG'; payload: { title: string; message: string; onConfirm: () => void } }
  | { type: 'HIDE_CONFIRM_DIALOG' }
  | { type: 'ADD_COURSE_TYPE'; payload: CourseType }
  | { type: 'UPDATE_COURSE_TYPE'; payload: CourseType }
  | { type: 'DELETE_COURSE_TYPE'; payload: string }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }
  | { type: 'ADD_OFFERING'; payload: CourseOffering }
  | { type: 'UPDATE_OFFERING'; payload: CourseOffering }
  | { type: 'DELETE_OFFERING'; payload: string }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'ADD_REGISTRATION'; payload: Registration }
  | { type: 'UPDATE_REGISTRATION'; payload: Registration }
  | { type: 'DELETE_REGISTRATION'; payload: string }
  | { type: 'LOAD_DATA'; payload: Omit<AppState, 'ui'> };