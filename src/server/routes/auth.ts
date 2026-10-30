import { Router, Response } from 'express';
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserRole,
} from '../db.ts';
import {
  generateToken,
  hashPassword,
  comparePassword,
  requireAuth,
  AuthenticatedRequest,
} from '../auth.ts';
import {
  authLoginSchema,
  authRegisterSchema,
  roleUpdateSchema,
} from '../validation.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res: Response) => {
  try {
    const parseResult = authRegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { name, email, password, role } = parseResult.data;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        error: 'An account with this email address already exists.',
      });
    }

    const password_hash = await hashPassword(password);
    const user = await createUser({
      name,
      email,
      password_hash,
      role: role as any,
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err: any) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal registration error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response) => {
  try {
    const parseResult = authLoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parseResult.data;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials. User not found with provided email.',
      });
    }

    const validPassword = await comparePassword(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({
        error: 'Invalid credentials. Password does not match.',
      });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err: any) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal login error' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err: any) {
    console.error('[Auth Me Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal auth error' });
  }
});

// POST /api/auth/role - Switch role for testing RBAC
router.post('/role', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = roleUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const updated = await updateUserRole(req.user!.userId, parseResult.data.role);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newToken = generateToken(updated);

    return res.json({
      message: `Role switched to ${updated.role}`,
      token: newToken,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        created_at: updated.created_at,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update role' });
  }
});

// GET /api/auth/demo-accounts - For easy 1-click test login in demo mode
router.get('/demo-accounts', (_req, res: Response) => {
  res.json({
    accounts: [
      {
        email: 'admin@trustguard.ai',
        role: 'Admin',
        name: 'Sarah Connor (CISO)',
        description: 'Full audit visibility, log management & policy settings',
      },
      {
        email: 'analyst@trustguard.ai',
        role: 'Security Analyst',
        name: 'Alex Rivera (SecOps)',
        description: 'PII scanner, threat analytics, incident triage',
      },
      {
        email: 'dev@trustguard.ai',
        role: 'Developer',
        name: 'Jordan Lee (AI Engineer)',
        description: 'Prompt sandbox, firewall testing, model safety audit',
      },
    ],
  });
});

export default router;
