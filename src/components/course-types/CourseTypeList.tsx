import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface CourseTypeListProps {
  onAdd: () => void;
  onEdit: (id: string) => void;
}

const CourseTypeList: React.FC<CourseTypeListProps> = ({ onAdd, onEdit }) => {
  const { state, dispatch } = useAppContext();
  const { courseTypes } = state;

  const handleDelete = (id: string, name: string) => {
    dispatch({
      type: 'SHOW_CONFIRM_DIALOG',
      payload: {
        title: 'Delete Course Type',
        message: `Are you sure you want to delete "${name}"? This will also remove all related course offerings and registrations.`,
        onConfirm: () => {
          dispatch({ type: 'DELETE_COURSE_TYPE', payload: id });
          dispatch({ 
            type: 'SHOW_TOAST', 
            payload: { message: 'Course type deleted successfully', type: 'success' } 
          });
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Types</h2>
        <button
          onClick={onAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course Type
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {courseTypes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No course types found</p>
            <button
              onClick={onAdd}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first course type
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {courseTypes.map((courseType) => (
              <li key={courseType.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {courseType.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(courseType.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(courseType.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      title="Edit course type"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(courseType.id, courseType.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete course type"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseTypeList;