import { supabase } from "../supabase-client.js";
import { log } from "../logs/logger.js";

export async function getListOfClasses() {
  const {data, error} = await supabase
    .from("classes")
    .select("id, course_title, subject, catalog, section");
    if(error) console.log("supabase error", error)
  return {data, error}
}

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
    .delete()
    .eq("user_id", userId)
    .eq("class_id", classId);
  return { data, error };
}

export async function addClass(classId, userId) {
  const { data, error } = await supabase
    .from("user_classes")
    .insert({ user_id: userId, class_id: classId })
    .select();
  return { data, error };
}

export async function bulkEnrollClasses(classIds, userId) {
  const { data, error } = await supabase.from("user_classes").insert(
    classIds.map((classId) => ({
      user_id: userId,
      class_id: parseInt(classId, 10),
    }))
  );
  return { data, error };
}
