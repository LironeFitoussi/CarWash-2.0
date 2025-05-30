import { Router, RequestHandler } from 'express';
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountSummary,
  recalculateBalance
} from '../controllers/account.controller';
import { jwtCheck, getUserProfile } from '../middleware/auth0Middleware';

const router = Router();

// GET /api/v1/accounts - Get all accounts
router.get('/', jwtCheck, getUserProfile, getAccounts as RequestHandler);

// GET /api/v1/accounts/summary - Get account summary
router.get('/summary', jwtCheck, getUserProfile, getAccountSummary as RequestHandler);

// GET /api/v1/accounts/:id - Get single account
router.get('/:id', jwtCheck, getUserProfile, getAccountById as RequestHandler);

// POST /api/v1/accounts - Create new account
router.post('/', jwtCheck, getUserProfile, createAccount as RequestHandler);

// PUT /api/v1/accounts/:id - Update account
router.put('/:id', jwtCheck, getUserProfile, updateAccount as RequestHandler);

// DELETE /api/v1/accounts/:id - Delete account
router.delete('/:id', jwtCheck, getUserProfile, deleteAccount as RequestHandler);

// POST /api/v1/accounts/:id/recalculate - Recalculate account balance
router.post('/:id/recalculate', jwtCheck, getUserProfile, recalculateBalance as RequestHandler);

export default router; 