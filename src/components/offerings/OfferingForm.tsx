import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { generateId } from '../../utils/storage';
import { X } from 'lucide-react';

interface OfferingFormProps {
  editingId?: string;
  onClose: () => void;
}

const OfferingForm: React.FC<OfferingFormProps> = ({ editingId, onClose }) => {
  const { state, dispatch } = useAppContext();
  const { courseOfferings, courseTypes, courses } = state;
  
  const [courseTypeId, setCourseTypeId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  
  const editingOffering = editingId ? courseOfferings.find(co => co.id === editingId) : null;
  
  useEffect(() => {
    if (editingOffering) {
      setCourseTypeId(editingOffering.courseTypeId);
      setCourseId(editingOffering.courseId);
      setCapacity(editingOffering.capacity?.toString() || '');
    }
  }, [editingOffering]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: string[] = [];
    
    if (!courseTypeId) validationErrors.push('Course type is required');
    if (!courseId) validationErrors.push('Course is required');
    
    // Check for duplicate combination (excluding current if editing)
    const isDuplicate = courseOfferings.some(co => 
      co.id !== editingId && 
      co.courseTypeId === courseTypeId && 
      co.courseId === courseId
    );
    
    if (isDuplicate) {
      validationErrors.push('This course type and course combination already exists');
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const courseType = courseTypes.find(ct => ct.id === courseTypeId);
    const course = courses.find(c => c.id === courseId);
    const displayName = `${courseType?.name || ''} - ${course?.name || ''}`;
    
    const now = new Date().toISOString();
    
    if (editingId && editingOffering) {
      const updatedOffering = {
        ...editingOffering,
        courseTypeId,
        courseId,
        displayName,
        capacity: capacity ? parseInt(capacity) : undefined,
        updatedAt: now
      };
      dispatch({ type: 'UPDATE_OFFERING', payload: updatedOffering });
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'Course offering updated successfully', type: 'success' } 
      });
    } else {
      const newOffering = {
        id: generateId(),
        courseTypeId,
        courseId,
        displayName,
        capacity: capacity ? parseInt(capacity) : undefined,
        createdAt: now,
        updatedAt: now
      };
      dispatch({ type: 'ADD_OFFERING', payload: newOffering });
      dispatch({ 
        type: 'SHOW_TOAST', 
        payload: { message: 'Course offering created successfully', type: 'success' } 
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
                {editingId ? 'Edit Course Offering' : 'Add Course Offering'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="courseTypeId" className="block text-sm font-medium text-gray-700">
                    Course Type
                  </label>
                  <select
                    id="courseTypeId"
                    value={courseTypeId}
                    onChange={(e) => {
                      setCourseTypeId(e.target.value);
                      setErrors([]);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select course type</option>
                    {courseTypes.map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        {ct.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
                    Course
                  </label>
                  <select
                    id="courseId"
                    value={courseId}
                    onChange={(e) => {
                      setCourseId(e.target.value);
                      setErrors([]);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Capacity (Optional)
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="Maximum number of students"
                    min="1"
                  />
                </div>

                {courseTypeId && courseId && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Display Name:</strong> {courseTypes.find(ct => ct.id === courseTypeId)?.name} - {courses.find(c => c.id === courseId)?.name}
                    </p>
                  </div>
                )}

                {errors.length > 0 && (
                  <div className="mt-2">
                    {errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600">
                        {error}
                      </p>
                    ))}
                  </div>
                )}
                
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

export default OfferingForm;