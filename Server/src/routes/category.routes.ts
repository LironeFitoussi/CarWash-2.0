import { Router, RequestHandler } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} from '../controllers/category.controller';
import { jwtCheck, getUserProfile } from '../middleware/auth0Middleware';

const router = Router();

// GET /api/v1/categories - Get all categories with filtering
router.get('/', jwtCheck, getUserProfile, getCategories as RequestHandler);

// GET /api/v1/categories/stats - Get category statistics
router.get('/stats', jwtCheck, getUserProfile, getCategoryStats as RequestHandler);

// GET /api/v1/categories/:id - Get single category
router.get('/:id', jwtCheck, getUserProfile, getCategoryById as RequestHandler);

// POST /api/v1/categories - Create new category
router.post('/', jwtCheck, getUserProfile, createCategory as RequestHandler);

// PUT /api/v1/categories/:id - Update category
router.put('/:id', jwtCheck, getUserProfile, updateCategory as RequestHandler);

// DELETE /api/v1/categories/:id - Delete category
router.delete('/:id', jwtCheck, getUserProfile, deleteCategory as RequestHandler);

export default router; 