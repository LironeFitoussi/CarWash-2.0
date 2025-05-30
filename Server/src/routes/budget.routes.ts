import { Router, RequestHandler } from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
  updateBudgetSpent
} from '../controllers/budget.controller';
import { jwtCheck, getUserProfile } from '../middleware/auth0Middleware';

const router = Router();

// GET /api/v1/budgets - Get all budgets
router.get('/', jwtCheck, getUserProfile, getBudgets as RequestHandler);

// GET /api/v1/budgets/summary - Get budget summary
router.get('/summary', jwtCheck, getUserProfile, getBudgetSummary as RequestHandler);

// GET /api/v1/budgets/:id - Get single budget
router.get('/:id', jwtCheck, getUserProfile, getBudgetById as RequestHandler);

// POST /api/v1/budgets - Create new budget
router.post('/', jwtCheck, getUserProfile, createBudget as RequestHandler);

// PUT /api/v1/budgets/:id - Update budget
router.put('/:id', jwtCheck, getUserProfile, updateBudget as RequestHandler);

// DELETE /api/v1/budgets/:id - Delete budget
router.delete('/:id', jwtCheck, getUserProfile, deleteBudget as RequestHandler);

// PUT /api/v1/budgets/:id/update-spent - Update budget spent amount
router.put('/:id/update-spent', jwtCheck, getUserProfile, updateBudgetSpent as RequestHandler);

export default router; 