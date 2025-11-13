import { supabase } from "../supabase-client.js";
import { log } from "../logs/logger.js";

export async function getAllClasses(userId) {
  const { data, error } = await supabase
    .from("user_classes")
    .select(`...classes(id,course_title, subject, catalog, section)`)
    .eq("user_id", userId);
  return { data, error };
}

export async function dropClass(classId, userId) {
  const { data, error } = await supabase
    .from("user_classes")
    .eq("user_id", userId)
    .eq("class_id", classId)
    .delete();
  return { data, error };
}

export async function addClass(classId, userId) {
  const { data, error } = await supabase
    .from("user_classes")
    .insert({ user_id: userId, class_id: classId });
  return { data, error };
}
