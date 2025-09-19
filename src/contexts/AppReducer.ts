import { AppState, AppAction } from '../utils/types';
import { saveToStorage } from '../utils/storage';

export const appReducer = (state: AppState, action: AppAction): AppState => {
  let newState: AppState;

  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentView: action.payload
        }
      };

    case 'SET_SELECTED_COURSE_TYPE':
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedCourseTypeId: action.payload
        }
      };

    case 'SET_SELECTED_OFFERING':
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedOfferingId: action.payload
        }
      };

    case 'SHOW_TOAST':
      return {
        ...state,
        ui: {
          ...state.ui,
          toast: action.payload
        }
      };

    case 'HIDE_TOAST':
      return {
        ...state,
        ui: {
          ...state.ui,
          toast: null
        }
      };

    case 'SHOW_CONFIRM_DIALOG':
      return {
        ...state,
        ui: {
          ...state.ui,
          confirmDialog: {
            isOpen: true,
            title: action.payload.title,
            message: action.payload.message,
            onConfirm: action.payload.onConfirm
          }
        }
      };

    case 'HIDE_CONFIRM_DIALOG':
      return {
        ...state,
        ui: {
          ...state.ui,
          confirmDialog: {
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null
          }
        }
      };

    case 'ADD_COURSE_TYPE':
      newState = {
        ...state,
        courseTypes: [...state.courseTypes, action.payload]
      };
      break;

    case 'UPDATE_COURSE_TYPE':
      newState = {
        ...state,
        courseTypes: state.courseTypes.map(ct => 
          ct.id === action.payload.id ? action.payload : ct
        ),
        courseOfferings: state.courseOfferings.map(offering => 
          offering.courseTypeId === action.payload.id
            ? {
                ...offering,
                displayName: `${action.payload.name} - ${state.courses.find(c => c.id === offering.courseId)?.name || ''}`
              }
            : offering
        )
      };
      break;

    case 'DELETE_COURSE_TYPE':
      newState = {
        ...state,
        courseTypes: state.courseTypes.filter(ct => ct.id !== action.payload),
        courseOfferings: state.courseOfferings.filter(co => co.courseTypeId !== action.payload),
        registrations: state.registrations.filter(r => 
          !state.courseOfferings.some(co => co.id === r.offeringId && co.courseTypeId === action.payload)
        )
      };
      break;

    case 'ADD_COURSE':
      newState = {
        ...state,
        courses: [...state.courses, action.payload]
      };
      break;

    case 'UPDATE_COURSE':
      newState = {
        ...state,
        courses: state.courses.map(c => 
          c.id === action.payload.id ? action.payload : c
        ),
        courseOfferings: state.courseOfferings.map(offering => 
          offering.courseId === action.payload.id
            ? {
                ...offering,
                displayName: `${state.courseTypes.find(ct => ct.id === offering.courseTypeId)?.name || ''} - ${action.payload.name}`
              }
            : offering
        )
      };
      break;

    case 'DELETE_COURSE':
      newState = {
        ...state,
        courses: state.courses.filter(c => c.id !== action.payload),
        courseOfferings: state.courseOfferings.filter(co => co.courseId !== action.payload),
        registrations: state.registrations.filter(r => 
          !state.courseOfferings.some(co => co.id === r.offeringId && co.courseId === action.payload)
        )
      };
      break;

    case 'ADD_OFFERING':
      newState = {
        ...state,
        courseOfferings: [...state.courseOfferings, action.payload]
      };
      break;

    case 'UPDATE_OFFERING':
      newState = {
        ...state,
        courseOfferings: state.courseOfferings.map(co => 
          co.id === action.payload.id ? action.payload : co
        )
      };
      break;

    case 'DELETE_OFFERING':
      newState = {
        ...state,
        courseOfferings: state.courseOfferings.filter(co => co.id !== action.payload),
        registrations: state.registrations.filter(r => r.offeringId !== action.payload)
      };
      break;

    case 'ADD_STUDENT':
      newState = {
        ...state,
        students: [...state.students, action.payload]
      };
      break;

    case 'UPDATE_STUDENT':
      newState = {
        ...state,
        students: state.students.map(s => 
          s.id === action.payload.id ? action.payload : s
        )
      };
      break;

    case 'DELETE_STUDENT':
      newState = {
        ...state,
        students: state.students.filter(s => s.id !== action.payload),
        registrations: state.registrations.filter(r => r.studentId !== action.payload)
      };
      break;

    case 'ADD_REGISTRATION':
      newState = {
        ...state,
        registrations: [...state.registrations, action.payload]
      };
      break;

    case 'UPDATE_REGISTRATION':
      newState = {
        ...state,
        registrations: state.registrations.map(r => 
          r.id === action.payload.id ? action.payload : r
        )
      };
      break;

    case 'DELETE_REGISTRATION':
      newState = {
        ...state,
        registrations: state.registrations.filter(r => r.id !== action.payload)
      };
      break;

    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }

  // Save to localStorage for persistent data actions
  if (action.type.includes('ADD_') || action.type.includes('UPDATE_') || action.type.includes('DELETE_') || action.type === 'LOAD_DATA') {
    const { ui, ...dataToSave } = newState;
    saveToStorage(dataToSave);
  }

  return newState;
};