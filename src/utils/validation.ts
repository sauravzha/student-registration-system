export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateUnique = (value: string, existingValues: string[], excludeId?: string): boolean => {
  const normalizedValue = value.toLowerCase().trim();
  return !existingValues.some((existing, index) => 
    existing.toLowerCase().trim() === normalizedValue && 
    (!excludeId || index.toString() !== excludeId)
  );
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCourseType = (
  name: string, 
  existingNames: string[], 
  excludeId?: string
): ValidationResult => {
  const errors: string[] = [];

  if (!validateRequired(name)) {
    errors.push('Course type name is required');
  }

  if (!validateMaxLength(name, 100)) {
    errors.push('Course type name must be 100 characters or less');
  }

  if (!validateUnique(name, existingNames, excludeId)) {
    errors.push('Course type name must be unique');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCourse = (
  name: string, 
  existingNames: string[], 
  excludeId?: string
): ValidationResult => {
  const errors: string[] = [];

  if (!validateRequired(name)) {
    errors.push('Course name is required');
  }

  if (!validateMaxLength(name, 100)) {
    errors.push('Course name must be 100 characters or less');
  }

  if (!validateUnique(name, existingNames, excludeId)) {
    errors.push('Course name must be unique');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateStudent = (
  firstName: string,
  lastName?: string,
  email?: string,
  phone?: string
): ValidationResult => {
  const errors: string[] = [];

  if (!validateRequired(firstName)) {
    errors.push('First name is required');
  }

  if (email && email.trim() && !validateEmail(email)) {
    errors.push('Please enter a valid email address');
  }

  if (phone && phone.trim() && !validatePhone(phone)) {
    errors.push('Please enter a valid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};