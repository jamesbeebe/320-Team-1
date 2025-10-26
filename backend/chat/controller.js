import { supabase } from "../supabase-client.js";

export async function getAllChatsForClass(classId) {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("class_id", classId);
  return { data, error };
}

export async function createChatForClass(classId, name, expiresAt) {
  const { data, error } = await supabase
    .from("chats")
    .insert({ name: name, class_id: classId, created_at: new Date().toISOString(), expires_at: expiresAt })
    .select("*")
    .single();
  return { data, error };
}