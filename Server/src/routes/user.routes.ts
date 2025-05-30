import { Router, RequestHandler } from 'express';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getUserRegex
} from '../controllers/user.controller';
import { jwtCheck, getUserProfile } from '../middleware/auth0Middleware';

const router = Router();

// Get all users (admin only - protected)
router.get('/', jwtCheck, getUserProfile, getAllUsers);

// Get user by email (public for user creation/sync)
router.get('/email/:email', getUserByEmail as RequestHandler);

// Create new user (public for user creation/sync)
router.post('/', createUser as RequestHandler);

// Get user by ID (protected)
router.get('/:id', jwtCheck, getUserProfile, getUserById as RequestHandler);

// Update user (protected)
router.put('/:id', jwtCheck, getUserProfile, updateUser as RequestHandler);

// Delete user (protected)
router.delete('/:id', jwtCheck, getUserProfile, deleteUser as RequestHandler);

// Get user by regex (protected)
router.get('/regex/:regex', jwtCheck, getUserProfile, getUserRegex as RequestHandler);

export default router;
