import jwt from "jsonwebtoken";
import { log } from "../logs/logger.js";

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

function authenticate(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    log("info", `No authorization header found ${authHeader}`);
    return res.redirect(302, "/login");
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, SUPABASE_JWT_SECRET);
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      log("info", `JWT expired`);
      return res.redirect(302, "/login");
    }
    log("info", `JWT verification failed: ${err.message}`);
    return res.redirect(302, "/login");
  }
}

export default authenticate;
