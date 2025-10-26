import { supabase } from "../supabase-client.js";

export async function getAllChatsForClass(classId) {
  const { data, error } = await supabase
    .from("chats")
    .select(`
        id,
        name,
        expires_at
        `)
    .eq("class_id", classId)
    .lte("expires_at", new Date().toISOString());
  return { data, error };
}

export async function createChatForClass(classId, name, expiresAt) {
  const { data, error } = await supabase
    .from("chats")
    .insert({ name: name, class_id: classId, created_at: new Date().toISOString(), expires_at: expiresAt })
    .select()
    .single();
  return { data, error };
}

export async function updateChatForClass(chatId, name, expiresAt) {
  const { data, error } = await supabase
    .from("chats")
    .update({ name: name, expires_at: expiresAt })
    .eq("id", chatId)
    .select(`
        id,
        name,
        expires_at
        `)
    .single();
  return { data, error };
}