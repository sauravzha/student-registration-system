import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { UserX, Plus, Filter } from 'lucide-react';
import FilterDropdown from '../shared/FilterDropdown';

interface RegistrationListProps {
  onRegister: () => void;
}

const RegistrationList: React.FC<RegistrationListProps> = ({ onRegister }) => {
  const { state, dispatch } = useAppContext();
  const { registrations, students, courseOfferings, courseTypes, courses } = state;

  const handleCancelRegistration = (registrationId: string, studentName: string, offeringName: string) => {
    dispatch({
      type: 'SHOW_CONFIRM_DIALOG',
      payload: {
        title: 'Cancel Registration',
        message: `Are you sure you want to cancel ${studentName}'s registration for "${offeringName}"?`,
        onConfirm: () => {
          const registration = registrations.find(r => r.id === registrationId);
          if (registration) {
            dispatch({ 
              type: 'UPDATE_REGISTRATION', 
              payload: { ...registration, status: 'cancelled' } 
            });
            dispatch({ 
              type: 'SHOW_TOAST', 
              payload: { message: 'Registration cancelled successfully', type: 'success' } 
            });
          }
        }
      }
    });
  };

  // Filter registrations by selected offering
  const filteredRegistrations = state.ui.selectedOfferingId
    ? registrations.filter(r => r.offeringId === state.ui.selectedOfferingId)
    : registrations;

  // Group registrations by offering
  const registrationsByOffering = filteredRegistrations.reduce((acc, registration) => {
    const offering = courseOfferings.find(co => co.id === registration.offeringId);
    if (offering) {
      if (!acc[offering.id]) {
        acc[offering.id] = {
          offering,
          registrations: []
        };
      }
      acc[offering.id].registrations.push(registration);
    }
    return acc;
  }, {} as Record<string, { offering: any; registrations: typeof registrations }>);

  const offeringOptions = courseOfferings.map(offering => ({
    value: offering.id,
    label: offering.displayName
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Student Registrations</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-64">
            <FilterDropdown
              label="Filter by Offering"
              value={state.ui.selectedOfferingId || ''}
              options={offeringOptions}
              onChange={(value) => dispatch({ type: 'SET_SELECTED_OFFERING', payload: value || null })}
              placeholder="All Offerings"
            />
          </div>
          <button
            onClick={onRegister}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Register Student
          </button>
        </div>
      </div>

      {Object.keys(registrationsByOffering).length === 0 ? (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {state.ui.selectedOfferingId ? 'No registrations found for selected offering' : 'No student registrations found'}
            </p>
            <button
              onClick={onRegister}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Register your first student
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.values(registrationsByOffering).map(({ offering, registrations: offeringRegistrations }) => (
            <div key={offering.id} className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-medium text-gray-900">{offering.displayName}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="mr-4">
                    Registered: {offeringRegistrations.filter(r => r.status === 'registered').length}
                  </span>
                  <span className="mr-4">
                    Cancelled: {offeringRegistrations.filter(r => r.status === 'cancelled').length}
                  </span>
                  {offering.capacity && (
                    <span>
                      Capacity: {offering.capacity}
                    </span>
                  )}
                </div>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {offeringRegistrations
                  .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
                  .map((registration) => {
                    const student = students.find(s => s.id === registration.studentId);
                    if (!student) return null;

                    return (
                      <li key={registration.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">
                              {student.firstName} {student.lastName || ''}
                            </h4>
                            <div className="text-sm text-gray-500 space-y-1">
                              {student.email && <p>Email: {student.email}</p>}
                              {student.phone && <p>Phone: {student.phone}</p>}
                              <p>Registered: {new Date(registration.registeredAt).toLocaleDateString()}</p>
                              <p>
                                Status: 
                                <span className={`ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  registration.status === 'registered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {registration.status}
                                </span>
                              </p>
                            </div>
                          </div>
                          {registration.status === 'registered' && (
                            <button
                              onClick={() => handleCancelRegistration(
                                registration.id,
                                `${student.firstName} ${student.lastName || ''}`,
                                offering.displayName
                              )}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                              title="Cancel registration"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistrationList;