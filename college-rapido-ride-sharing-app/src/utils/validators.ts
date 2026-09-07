// Simple, dependency-free validators used by the sign up / login forms.

export const isValidEmail = (value: string) => {
  if (!value) return false;
  // must contain "@" and a "." after it, basic college-email friendly check
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(value);
};

export const isValidPhone = (value: string) => {
  return /^[6-9]\d{9}$/.test(value.trim());
};

export const isValidPassword = (value: string) => value.length >= 6;

export const isValidVehicleNumber = (value: string) => value.trim().length >= 4;
