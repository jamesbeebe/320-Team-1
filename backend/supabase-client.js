import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
// Load environment variables FIRST, before any other imports
dotenv.config();

// Validate environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL environment variable is not set");
}

if (!process.env.SUPABASE_API_KEY) {
  throw new Error("SUPABASE_ANON_KEY environment variable is not set");
}

// Create Supabase client singleton
// This module is evaluated once on first import and cached by Node.js
console.log("Initializing Supabase client...");

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);