import { AppState } from './types';

const STORAGE_KEY = 'student-registration-data';

export const loadFromStorage = (): Partial<Omit<AppState, 'ui'>> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return {};
  }
};

export const saveToStorage = (state: Omit<AppState, 'ui'>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};