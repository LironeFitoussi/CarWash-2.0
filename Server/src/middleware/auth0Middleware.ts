import { auth } from 'express-oauth2-jwt-bearer';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Simple in-memory cache for Auth0 user data (valid for 5 minutes)
const userCache = new Map<string, { user: any; expiresAt: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// JWT validation middleware
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  tokenSigningAlg: 'RS256',
});

// Helper function to sleep for retry logic
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced middleware to get full user profile from Auth0
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    // Check cache first
    const cached = userCache.get(token);
    let auth0User;

    if (cached && cached.expiresAt > Date.now()) {
      auth0User = cached.user;
      console.log('🚀 Using cached Auth0 user data');
    } else {
      // Get user profile from Auth0 with retry logic
      let retries = 3;
      let delay = 1000; // Start with 1 second

      while (retries > 0) {
        try {
          const userInfoResponse = await axios.get(`${process.env.AUTH0_DOMAIN}/userinfo`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          auth0User = userInfoResponse.data;
          
          // Cache the result
          userCache.set(token, {
            user: auth0User,
            expiresAt: Date.now() + CACHE_DURATION
          });
          
          break; // Success, exit retry loop
        } catch (error: any) {
          if (error.response?.status === 429 && retries > 1) {
            console.log(`⚠️ Rate limited by Auth0, retrying in ${delay}ms... (${retries - 1} retries left)`);
            await sleep(delay);
            delay *= 2; // Exponential backoff
            retries--;
          } else {
            throw error; // Re-throw if not rate limit or no more retries
          }
        }
      }

      if (!auth0User) {
        throw new Error('Failed to get user profile after retries');
      }
    }

    const auth0Id = auth0User.sub;

    // Find user by auth0Id first, then by email for existing users
    let mongoUser = await User.findOne({ auth0Id });
    
    if (!mongoUser) {
      // Try to find by email (for existing users)
      mongoUser = await User.findOne({ email: auth0User.email });
      
      if (mongoUser && !mongoUser.auth0Id) {
        // Update existing user with auth0Id
        mongoUser.auth0Id = auth0Id;
        await mongoUser.save();
        console.log(`✅ Updated existing user with Auth0 ID: ${auth0User.email}`);
      }
    }
    
    if (!mongoUser) {
      // Create new user if they don't exist
      mongoUser = new User({
        auth0Id,
        email: auth0User.email,
        firstName: auth0User.given_name || '',
        lastName: auth0User.family_name || '',
        // Other fields will use default values
      });
      await mongoUser.save();
      console.log(`✅ Created new user for Auth0 ID: ${auth0Id}`);
    }

    // Add user info to request object with MongoDB ObjectId
    req.user = {
      id: mongoUser.id, // Use Mongoose document id property (string)
      auth0Id,
      email: auth0User.email,
      name: auth0User.name,
      firstName: auth0User.given_name || '',
      lastName: auth0User.family_name || '',
      picture: auth0User.picture,
      ...auth0User
    };

    next();
  } catch (error: any) {
    console.error('❌ Failed to fetch user profile from Auth0:', error.message);
    
    // Clear cache entry if it exists
    if (token) {
      userCache.delete(token);
    }
    
    res.status(401).json({ error: 'Invalid token or failed to fetch user profile' });
    return;
  }
};

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, cached] of userCache.entries()) {
    if (cached.expiresAt <= now) {
      userCache.delete(token);
    }
  }
}, 60000); // Clean up every minute

// Combined middleware for protected routes
export const requireAuth = [jwtCheck, getUserProfile]; 