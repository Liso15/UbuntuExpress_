import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

// Store failed login attempts
const failedAttempts = new Map<string, { count: number; timestamp: number }>();

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  try {
    passwordSchema.parse(password);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => err.message),
      };
    }
    return { isValid: false, errors: ['Invalid password format'] };
  }
};

export const checkRateLimit = (email: string): { isBlocked: boolean; remainingTime?: number } => {
  const attempt = failedAttempts.get(email);
  const now = Date.now();

  if (!attempt) {
    return { isBlocked: false };
  }

  // Reset if window has passed
  if (now - attempt.timestamp > RATE_LIMIT_WINDOW) {
    failedAttempts.delete(email);
    return { isBlocked: false };
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - attempt.timestamp)) / 1000 / 60);
    return { isBlocked: true, remainingTime };
  }

  return { isBlocked: false };
};

export const recordFailedAttempt = (email: string): void => {
  const attempt = failedAttempts.get(email);
  const now = Date.now();

  if (!attempt) {
    failedAttempts.set(email, { count: 1, timestamp: now });
    return;
  }

  // Reset if window has passed
  if (now - attempt.timestamp > RATE_LIMIT_WINDOW) {
    failedAttempts.set(email, { count: 1, timestamp: now });
    return;
  }

  attempt.count += 1;
  failedAttempts.set(email, attempt);
};

export const resetFailedAttempts = (email: string): void => {
  failedAttempts.delete(email);
};

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Session timeout configuration (30 minutes)
export const SESSION_TIMEOUT = 30 * 60 * 1000;

// Function to check if session is expired
export const isSessionExpired = (lastActivity: number): boolean => {
  return Date.now() - lastActivity > SESSION_TIMEOUT;
}; 