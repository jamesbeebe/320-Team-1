import router from "express";
import { log } from "../logs/logger.js";
import { supabase } from "../supabase-client.js";
import authenticate from "../utils/auth.js";

export const authRouter = router();

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

  res.cookie("auth_token", data.session.access_token, {
    httpOnly: false,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "strict",
    value: data.session.access_token,
  });

  return res.status(200).json({
    message: "User created successfully",
    accessToken: data.session.access_token,
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

  res.cookie("auth_token", data.session.access_token, {
    httpOnly: false,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "strict",
    value: data.session.access_token,
  });

  return res
    .status(200)
    .json({ accessToken: data.session.access_token, user: data.user });
});

authRouter.post("/logout", async (req, res) => {
  const { data, error } = await supabase.auth.signOut();

  if (error) {
    log("error", `error signing out: ${error.message}`);
    return res.status(500).json({ error: "Failed to sign out" });
  }

  // Clear the auth cookie
  res.clearCookie("auth_token", {
    httpOnly: false,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({ data: data });
});

authRouter.post("/refresh-auth-token", async (req, res) => {
  // this endpoint maintains the rolling window of seven days for the auth token enabling refreshes
  log("info", `refreshing auth token: ${JSON.stringify(req.cookies)}`);
  const { auth_token } = req.cookies;
  const { data, error } = await supabase.auth.refreshSession({
    access_token: auth_token,
  });

  if (error) {
    log("error", `error refreshing auth token: ${error.message}`);
    return res.status(500).json({ error: "Failed to refresh auth token" });
  }

  log("info", `refreshed auth token: ${data.session.access_token}`);

  res.cookie("auth_token", data.session.access_token, {
    httpOnly: false,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "strict",
    value: data.session.access_token,
  });
  return res.status(200).json({ data: data });
});
