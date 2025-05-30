import { Router, Request, Response } from 'express';
import { jwtCheck, getUserProfile } from '../middleware/auth0Middleware';

const router = Router();

// Test endpoint to verify Auth0 integration
router.get('/me', jwtCheck, getUserProfile, (req: Request, res: Response) => {
  res.json({
    message: '✅ Auth0 integration working!',
    user: req.user,
    auth: req.auth
  });
});

// Public test endpoint
router.get('/public', (req: Request, res: Response) => {
  res.json({
    message: '✅ Public endpoint working!',
    timestamp: new Date().toISOString()
  });
});

export default router; 