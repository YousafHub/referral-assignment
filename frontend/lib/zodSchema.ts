import { z } from 'zod';

// Password validation with strong requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter (a-z)')
  .regex(/[0-9]/, 'Password must contain at least 1 number (0-9)')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character (!@#$%^&* etc.)');

// Email validation
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Name validation
const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Base schema
export const zSchema = {
  // Register schema
  register: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    referralCode: z.string().optional(),
  }),

  // Login schema
  login: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  }),

  // Register with confirm password (for frontend)
  registerWithConfirm: z.object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    referralCode: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
};

export default zSchema;