import { Router, Request, Response } from "express";
import { supabase } from "../../db/supabase.js";

const router = Router();

/**
 * POST /api/auth/register
 * Creates a new user account
 * Body: { email: string, password: string, name?: string }
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null,
        },
      },
    });

    if (error) {
      console.error("Error registering user:", error);
      return res.status(400).json({
        error: error.message,
      });
    }

    if (!data.user) {
      return res.status(400).json({
        error: "Failed to create user",
      });
    }

    // insert user in usuarios table
    const { data: user, error: userError } = await supabase
      .from("usuarios")
      .insert({
        id: data.user.id,
        correo: data.user.email,
        username: name,
        meta: "hipertrofia", // por mientras hardcodeado
      });

    if (userError) {
      console.error("Error inserting user:", userError);
      return res.status(400).json({
        error: userError.message,
      });
    }

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
      session: data.session,
    });
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticates a user
 * Body: { email: string, password: string }
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error);
      return res.status(401).json({
        error: error.message,
      });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/auth/logout
 * Signs out the current user
 * Headers: Authorization: Bearer <access_token>
 */
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No authorization token provided",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error);
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error in logout route:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/auth/me
 * Gets the current user's profile
 * Headers: Authorization: Bearer <access_token>
 */
router.get("/me", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No authorization token provided",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Error getting user:", error);
      return res.status(401).json({
        error: error.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error in me route:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refreshes the access token using a refresh token
 * Body: { refresh_token: string }
 */
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        error: "Refresh token is required",
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      console.error("Error refreshing session:", error);
      return res.status(401).json({
        error: error.message,
      });
    }

    if (!data.session) {
      return res.status(401).json({
        error: "Failed to refresh session",
      });
    }

    res.status(200).json({
      message: "Session refreshed successfully",
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Error in refresh route:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
