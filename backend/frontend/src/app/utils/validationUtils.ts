// Validation utilities for donation and form handling

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string | undefined): boolean => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,}$/;
  return phoneRegex.test(phone.replace(/[- ]/g, ''));
};

export const validateAmount = (amount: string | number): boolean => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount > 0;
};

export const validateDonationForm = (formData: {
  amount: string;
  firstName: string;
  lastName: string;
  email: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!formData.firstName?.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!formData.lastName?.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!formData.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(formData.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!formData.amount) {
    errors.push({ field: 'amount', message: 'Donation amount is required' });
  } else if (!validateAmount(formData.amount)) {
    errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateProjectForm = (formData: {
  title: string;
  description: string;
  category: string;
  budget_goal: string;
  target_date: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!formData.title?.trim()) {
    errors.push({ field: 'title', message: 'Project title is required' });
  }

  if (!formData.description?.trim()) {
    errors.push({ field: 'description', message: 'Project description is required' });
  }

  if (!formData.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  if (!formData.budget_goal) {
    errors.push({ field: 'budget_goal', message: 'Budget goal is required' });
  } else if (!validateAmount(formData.budget_goal)) {
    errors.push({ field: 'budget_goal', message: 'Budget must be greater than 0' });
  }

  if (!formData.target_date) {
    errors.push({ field: 'target_date', message: 'Target date is required' });
  } else {
    const selectedDate = new Date(formData.target_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      errors.push({ field: 'target_date', message: 'Target date must be in the future' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateEventForm = (formData: {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  event_type: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!formData.title?.trim()) {
    errors.push({ field: 'title', message: 'Event title is required' });
  }

  if (!formData.description?.trim()) {
    errors.push({ field: 'description', message: 'Event description is required' });
  }

  if (!formData.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  if (!formData.date) {
    errors.push({ field: 'date', message: 'Event date is required' });
  }

  if (!formData.time?.trim()) {
    errors.push({ field: 'time', message: 'Event time is required' });
  }

  if (!formData.location?.trim()) {
    errors.push({ field: 'location', message: 'Event location is required' });
  }

  if (!formData.event_type) {
    errors.push({ field: 'event_type', message: 'Event type is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Error handling utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const handleApiError = (error: unknown): string => {
  if (error instanceof Response) {
    switch (error.status) {
      case 400:
        return 'Invalid input. Please check your information.';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This item already exists or there is a conflict.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Error: ${error.statusText || 'Unknown error'}`;
    }
  }
  return getErrorMessage(error);
};

// Formatting utilities
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₱${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const calculateProgress = (raised: number, goal: number): number => {
  if (goal === 0) return 0;
  return Math.min(100, (raised / goal) * 100);
};
