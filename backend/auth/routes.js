import router from "express";
import { log } from "../logs/logger.js";
import { supabase } from "../supabase-client.js";
import authenticate from "../utils/auth.js";

export const authRouter = router();

// Cookie options for httpOnly refresh token
const getRefreshCookieOptions = () => ({
  httpOnly: true, // Prevents JavaScript access
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  sameSite: "strict",
});

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

authRouter.get("/refresh", async (req, res) => {
  const { refresh_token } = req.cookies;
  log("info", `refreshing tokens for ${refresh_token}`);
  if (!refresh_token) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    // Use refresh token to get new session
    const { data, error } = await supabase.auth.refreshSession(refresh_token);

    if (error || !data.session) {
      log("error", `error refreshing token: ${error?.message}`);
      res.clearCookie("refresh_token");
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    log("info", `refreshed tokens successfully`);

    // Store NEW refresh token in httpOnly cookie (token rotation)
    res.cookie(
      "refresh_token",
      data.session.refresh_token,
      getRefreshCookieOptions()
    );

    // Send NEW access token in JSON
    return res.status(200).json({
      accessToken: data.session.access_token,
      user: data.user,
    });
  } catch (error) {
    log("error", `Unexpected error: ${error.message}`);
    return res.status(500).json({ error: "Failed to refresh token" });
  }
});
