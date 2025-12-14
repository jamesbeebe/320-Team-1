import router from "express";
import { log } from "../logs/logger.js";
import { supabase } from "../supabase-client.js";

export const authRouter = router();

// Cookie options for httpOnly refresh token
const getRefreshCookieOptions = () => ({
  httpOnly: true, // Prevents JavaScript access
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  sameSite: "strict",
});

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: refresh_token
 *   schemas:
 *     SignUpRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         name:
 *           type: string
 *         major:
 *           type: string
 *         gradYear:
 *           type: integer
 *           example: 2026
 *       required:
 *         - email
 *         - password
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     AuthSuccess:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User created successfully
 *         accessToken:
 *           type: string
 *           description: Short-lived JWT access token
 *         user:
 *           type: object
 *           description: Supabase user object
 *     MeResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           description: Supabase user object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Sign up a new user
 *     description: Creates a new user account. Sets a httpOnly refresh token cookie and returns an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       200:
 *         description: User created successfully
 *         headers:
 *           Set-Cookie:
 *             description: httpOnly refresh_token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccess'
 *       500:
 *         description: Failed to sign up
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/signup", async (req, res) => {
  log("info", `signing up: ${req.body}`);
  const { email, password, name, major, gradYear } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name,
        major: major,
        gradYear: gradYear,
      },
    },
  });
  if (error) {
    log("error", `error signing up: ${error.message}`);
    return res.status(500).json({ error: "Failed to sign up" });
  }

  // Store refresh token in httpOnly cookie
  res.cookie(
    "refresh_token",
    data.session.refresh_token,
    getRefreshCookieOptions()
  );

  // Send access token in JSON response (frontend stores in memory)
  return res.status(200).json({
    message: "User created successfully",
    accessToken: data.session.access_token,
    user: data.user,
  });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user
 *     description: Authenticates a user. Sets a httpOnly refresh token cookie and returns an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: httpOnly refresh_token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccess'
 *       500:
 *         description: Failed to sign in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    log("error", `error signing in: ${error.message}`);
    return res.status(500).json({ error: "Failed to sign in" });
  }

  // Store refresh token in httpOnly cookie
  res.cookie(
    "refresh_token",
    data.session.refresh_token,
    getRefreshCookieOptions()
  );

  // Send access token in JSON (frontend stores in memory)
  return res.status(200).json({
    accessToken: data.session.access_token,
    user: data.user,
  });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out the current user
 *     description: Invalidates the Supabase session (if any) and clears the httpOnly refresh token cookie.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
authRouter.post("/logout", async (req, res) => {
  const { refresh_token } = req.cookies;

  // Invalidate session with Supabase
  if (refresh_token) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      log("error", `error signing out: ${error.message}`);
    }
  }

  // Clear the refresh token cookie
  res.clearCookie("refresh_token", {
    ...getRefreshCookieOptions(),
    maxAge: 0,
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the current authenticated user
 *     description: Uses the httpOnly refresh token cookie to refresh the session and return the current user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *         headers:
 *           Set-Cookie:
 *             description: May set a rotated httpOnly refresh_token cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Not authenticated or invalid/expired session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRouter.get("/me", async (req, res) => {
  const { refresh_token } = req.cookies;
  log("info", `refresh token: ${refresh_token}`);
  if (!refresh_token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Use refresh token to obtain a valid session (and access token)
  const { data, error } = await supabase.auth.refreshSession({ refresh_token });
  if (error) {
    log("error", `error refreshing session: ${error.message}`);
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  if (data.error) {
    log("error", `error refreshing session: ${data.error}`);
    return res.status(401).json({ error: data.error });
  }

  const { session } = data || {};
  if (!session || !session.user) {
    return res.status(401).json({ error: "Invalid session" });
  }

  // If Supabase rotated the refresh token, update the cookie
  log("info", `session.refresh_token: ${JSON.stringify(session)}`);
  if (session.refresh_token && session.refresh_token !== refresh_token) {
    res.cookie(
      "refresh_token",
      session.refresh_token,
      getRefreshCookieOptions()
    );
  }

  return res.status(200).json({ user: session.user });
});
