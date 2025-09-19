import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Edit2, Trash2, Plus } from 'lucide-react';
import FilterDropdown from '../shared/FilterDropdown';

interface OfferingListProps {
  onAdd: () => void;
  onEdit: (id: string) => void;
}

const OfferingList: React.FC<OfferingListProps> = ({ onAdd, onEdit }) => {
  const { state, dispatch } = useAppContext();
  const { courseOfferings, courseTypes, courses } = state;

  const handleDelete = (id: string, displayName: string) => {
    dispatch({
      type: 'SHOW_CONFIRM_DIALOG',
      payload: {
        title: 'Delete Course Offering',
        message: `Are you sure you want to delete "${displayName}"? This will also remove all related registrations.`,
        onConfirm: () => {
          dispatch({ type: 'DELETE_OFFERING', payload: id });
          dispatch({ 
            type: 'SHOW_TOAST', 
            payload: { message: 'Course offering deleted successfully', type: 'success' } 
          });
        }
      }
    });
  };

  const filteredOfferings = state.ui.selectedCourseTypeId
    ? courseOfferings.filter(offering => offering.courseTypeId === state.ui.selectedCourseTypeId)
    : courseOfferings;

  const courseTypeOptions = courseTypes.map(ct => ({
    value: ct.id,
    label: ct.name
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Course Offerings</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-48">
            <FilterDropdown
              label="Filter by Course Type"
              value={state.ui.selectedCourseTypeId || ''}
              options={courseTypeOptions}
              onChange={(value) => dispatch({ type: 'SET_SELECTED_COURSE_TYPE', payload: value || null })}
              placeholder="All Types"
            />
          </div>
          <button
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Offering
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {filteredOfferings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {state.ui.selectedCourseTypeId ? 'No offerings found for selected course type' : 'No course offerings found'}
            </p>
            {!state.ui.selectedCourseTypeId && (
              <button
                onClick={onAdd}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first offering
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredOfferings.map((offering) => {
              const courseType = courseTypes.find(ct => ct.id === offering.courseTypeId);
              const course = courses.find(c => c.id === offering.courseId);
              const registrationCount = state.registrations.filter(r => r.offeringId === offering.id && r.status === 'registered').length;

              return (
                <li key={offering.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {offering.displayName}
                      </h3>
                      <div className="mt-1 text-sm text-gray-500 space-y-1">
                        <p>Course Type: {courseType?.name || 'Unknown'}</p>
                        <p>Course: {course?.name || 'Unknown'}</p>
                        <p>Registrations: {registrationCount}</p>
                        {offering.capacity && <p>Capacity: {offering.capacity}</p>}
                        <p>Created: {new Date(offering.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(offering.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Edit offering"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(offering.id, offering.displayName)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete offering"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OfferingList;