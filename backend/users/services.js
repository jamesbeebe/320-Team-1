// this contains all the logic that encapsulates user operations
import dotenv from "dotenv";
import { supabase } from "../supabase-client.js";
dotenv.config();

export async function getUser() {
  const { data, error } = await supabase.from("users").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function getSpecificUser(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

export async function deleteUser(userId) {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId)
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

export async function getUsersWithClasses(classId, userId) {

  const { data: classUsers, error: classError } = await supabase
    .from("user_classes")
    .select("user_id")
    .eq("class_id", classId);

  if (classError) {
    throw new Error(`Error fetching class users: ${classError.message}`);
  }

  if (!classUsers || classUsers.length === 0) {
    return []; 
  }

  const userIds = classUsers.map((u) => u.user_id);

  const { data: users, error: userError } = await supabase
    .from("users")
    .select("*, user_classes(class_id)")
    .in("id", userIds)
    .not("id", "eq", userId);

  if (userError) {
    throw new Error(`Error fetching user details: ${userError.message}`);
  }

  return users;
}


export async function getUserWithClasses(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*, user_classes(*)")
    .eq("id", userId)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
