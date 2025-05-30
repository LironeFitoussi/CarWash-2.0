import { Router, RequestHandler } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} from '../controllers/transaction.controller';
import { jwtCheck, getUserProfile } from '../middleware/auth0Middleware';

const router = Router();

// GET /api/v1/transactions - Get all transactions with filtering
router.get('/', jwtCheck, getUserProfile, getTransactions as RequestHandler);

// GET /api/v1/transactions/stats - Get transaction statistics
router.get('/stats', jwtCheck, getUserProfile, getTransactionStats as RequestHandler);

// GET /api/v1/transactions/:id - Get single transaction
router.get('/:id', jwtCheck, getUserProfile, getTransactionById as RequestHandler);

// POST /api/v1/transactions - Create new transaction
router.post('/', jwtCheck, getUserProfile, createTransaction as RequestHandler);

// PUT /api/v1/transactions/:id - Update transaction
router.put('/:id', jwtCheck, getUserProfile, updateTransaction as RequestHandler);

// DELETE /api/v1/transactions/:id - Delete transaction
router.delete('/:id', jwtCheck, getUserProfile, deleteTransaction as RequestHandler);

export default router; 