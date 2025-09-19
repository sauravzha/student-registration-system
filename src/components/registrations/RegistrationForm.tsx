import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { validateStudent } from '../../utils/validation';
import { generateId } from '../../utils/storage';
import { X } from 'lucide-react';

interface RegistrationFormProps {
  onClose: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose }) => {
  const { state, dispatch } = useAppContext();
  const { courseOfferings, courseTypes, courses, students, registrations } = state;
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [offeringId, setOfferingId] = useState('');
  const [existingStudentId, setExistingStudentId] = useState('');
  const [useExistingStudent, setUseExistingStudent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: string[] = [];
    
    if (!offeringId) {
      validationErrors.push('Please select a course offering');
    }
    
    let studentId = '';
    
    if (useExistingStudent) {
      if (!existingStudentId) {
        validationErrors.push('Please select a student');
      } else {
        studentId = existingStudentId;
        
        // Check for duplicate registration
        const existingRegistration = registrations.find(r => 
          r.studentId === studentId && 
          r.offeringId === offeringId && 
          r.status === 'registered'
        );
        
        if (existingRegistration) {
          validationErrors.push('This student is already registered for this offering');
        }
      }
    } else {
      const studentValidation = validateStudent(firstName, lastName, email, phone);
      if (!studentValidation.isValid) {
        validationErrors.push(...studentValidation.errors);
      }
    }
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const now = new Date().toISOString();
    
    // Create student if not using existing
    if (!useExistingStudent) {
      const newStudent = {
        id: generateId(),
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        createdAt: now,
        updatedAt: now
      };
      
      dispatch({ type: 'ADD_STUDENT', payload: newStudent });
      studentId = newStudent.id;
    }
    
    // Create registration
    const newRegistration = {
      id: generateId(),
      studentId,
      offeringId,
      registeredAt: now,
      status: 'registered' as const
    };
    
    dispatch({ type: 'ADD_REGISTRATION', payload: newRegistration });
    
    const offering = courseOfferings.find(co => co.id === offeringId);
    dispatch({ 
      type: 'SHOW_TOAST', 
      payload: { 
        message: `Student registered successfully for ${offering?.displayName || 'course'}`, 
        type: 'success' 
      } 
    });
    
    onClose();
  };

  // Get available offerings (not at capacity)
  const availableOfferings = courseOfferings.filter(offering => {
    if (!offering.capacity) return true;
    const currentRegistrations = registrations.filter(r => 
      r.offeringId === offering.id && r.status === 'registered'
    ).length;
    return currentRegistrations < offering.capacity;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                Register Student
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="offeringId" className="block text-sm font-medium text-gray-700">
                    Course Offering
                  </label>
                  <select
                    id="offeringId"
                    value={offeringId}
                    onChange={(e) => {
                      setOfferingId(e.target.value);
                      setErrors([]);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Select course offering</option>
                    {availableOfferings.map((offering) => {
                      const currentRegistrations = registrations.filter(r => 
                        r.offeringId === offering.id && r.status === 'registered'
                      ).length;
                      const capacityText = offering.capacity 
                        ? ` (${currentRegistrations}/${offering.capacity})`
                        : ` (${currentRegistrations} registered)`;
                      
                      return (
                        <option key={offering.id} value={offering.id}>
                          {offering.displayName}{capacityText}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="newStudent"
                      name="studentType"
                      checked={!useExistingStudent}
                      onChange={() => setUseExistingStudent(false)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="newStudent" className="text-sm font-medium text-gray-700">
                      New Student
                    </label>
                    
                    <input
                      type="radio"
                      id="existingStudent"
                      name="studentType"
                      checked={useExistingStudent}
                      onChange={() => setUseExistingStudent(true)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="existingStudent" className="text-sm font-medium text-gray-700">
                      Existing Student
                    </label>
                  </div>
                </div>

                {useExistingStudent ? (
                  <div>
                    <label htmlFor="existingStudentId" className="block text-sm font-medium text-gray-700">
                      Select Student
                    </label>
                    <select
                      id="existingStudentId"
                      value={existingStudentId}
                      onChange={(e) => {
                        setExistingStudentId(e.target.value);
                        setErrors([]);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.firstName} {student.lastName || ''} 
                          {student.email && ` (${student.email})`}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                            setErrors([]);
                          }}
                          className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors([]);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setErrors([]);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </>
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
                    Register
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

export default RegistrationForm;