import { z } from 'zod';

export const authLoginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const authRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Security Analyst', 'Developer']).default('Security Analyst'),
});

export const scanSchema = z.object({
  text: z.string().min(1, 'Input text cannot be empty').max(15000, 'Text exceeds maximum length of 15,000 characters'),
  redaction_mode: z.enum(['token', 'asterisk', 'hash']).optional().default('token'),
  detection_categories: z.array(z.string()).optional(),
});

export const threatScanSchema = z.object({
  text: z.string().min(1, 'Input prompt cannot be empty').max(15000, 'Prompt exceeds maximum length'),
  sensitivity: z.enum(['strict', 'standard', 'permissive']).optional().default('strict'),
  context: z.string().max(2000).optional(),
});

export const auditScanSchema = z.object({
  text: z.string().min(1, 'Model output cannot be empty').max(15000, 'Content exceeds maximum length'),
  prompt: z.string().max(2000).optional(),
});

export const roleUpdateSchema = z.object({
  role: z.enum(['Admin', 'Security Analyst', 'Developer']),
});
