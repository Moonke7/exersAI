import { Request, Response, NextFunction } from "express";
import { supabase } from "../db/supabase.js";

/**
 * Middleware to verify authentication via Supabase JWT
 * Adds the authenticated user to req.user
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No authorization token provided",
      });
    }

    // Extract token
    const token = authHeader.replace("Bearer ", "");

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name,
    };

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token provided
 * But still validates token if one is present
 */
export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    // If no auth header, continue without user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    // If token is invalid, continue without user but log the error
    if (error || !user) {
      console.warn("Invalid token provided:", error);
      return next();
    }

    // Add user to request if valid
    req.user = {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name,
    };

    next();
  } catch (error) {
    console.error("Error in optional auth middleware:", error);
    // Continue without user on error
    next();
  }
};
