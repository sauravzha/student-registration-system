import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { validateCourseType } from '../../utils/validation';
import { generateId } from '../../utils/storage';
import { X } from 'lucide-react';

interface CourseTypeFormProps {
  editingId?: string;
  onClose: () => void;
}

const CourseTypeForm: React.FC<CourseTypeFormProps> = ({ editingId, onClose }) => {
  const { state, dispatch } = useAppContext();
  const { courseTypes } = state;
  
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  
  const editingCourseType = editingId ? courseTypes.find(ct => ct.id === editingId) : null;
  
  useEffect(() => {
    if (editingCourseType) {
      setName(editingCourseType.name);
    }
  }, [editingCourseType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingNames = courseTypes
      .filter(ct => ct.id !== editingId)
      .map(ct => ct.name);
    
    const validation = validateCourseType(name, existingNames, editingId);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const now = new Date().toISOString();
    
    if (editingId && editingCourseType) {
      const updatedCourseType = {
        ...editingCourseType,
        name: name.trim(),
        updatedAt: now
      };
      dispatch({ type: 'UPDATE_COURSE_TYPE', payload: updatedCourseType });
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'Course type updated successfully', type: 'success' } 
      });
    } else {
      const newCourseType = {
        id: generateId(),
        name: name.trim(),
        createdAt: now,
        updatedAt: now
      };
      dispatch({ type: 'ADD_COURSE_TYPE', payload: newCourseType });
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'Course type created successfully', type: 'success' } 
      });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="w-full">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                {editingId ? 'Edit Course Type' : 'Add Course Type'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Course Type Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors([]);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g., Individual, Group, Special"
                    maxLength={100}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {name.length}/100 characters
                  </p>
                  {errors.length > 0 && (
                    <div className="mt-2">
                      {errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-600">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTypeForm;