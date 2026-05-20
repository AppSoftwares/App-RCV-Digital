export const sanitizeInput = (input: unknown): string => {
  if (typeof input !== 'string') return "";
  return input.replace(/\$/g, "").replace(/[<>'";\\]/g, "").trim();
};

export const normalizeEmail = (email: unknown): string => {
  if (typeof email !== 'string') return "";
  return email.toLowerCase().trim();
};

export const validateAuthInput = (input: unknown): { isValid: boolean; value: string } => {
  if (typeof input !== 'string') return { isValid: false, value: "" };
  const value = input.trim();
  if (value.length < 3 || value.length > 100) return { isValid: false, value: "" };
  const safeCharset = /^[a-zA-Z0-9@\._-]+$/;
  if (!safeCharset.test(value)) return { isValid: false, value: "" };
  return { isValid: true, value };
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateRIF = (rif: string): boolean => {
  return /^[JGVEn0-9-]+$/i.test(rif);
};
