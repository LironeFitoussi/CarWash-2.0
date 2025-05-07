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

const router = Router();

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById as RequestHandler);

// Get user by email
router.get('/email/:email', getUserByEmail as RequestHandler);

// Create new user
router.post('/', createUser as RequestHandler);

// Update user
router.put('/:id', updateUser as RequestHandler);

// Delete user
router.delete('/:id', deleteUser as RequestHandler);

// Get user by regex
router.get('/regex/:regex', getUserRegex as RequestHandler);

export default router;
