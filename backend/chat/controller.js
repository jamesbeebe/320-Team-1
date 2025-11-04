import { supabase } from "../supabase-client.js";

export async function getAllChatsForClass(classId) {
  const { data, error } = await supabase
    .from("chats")
    .select(
      `
        id,
        name,
        expires_at
        `
    )
    .eq("class_id", classId)
    .gte("expires_at", new Date().toISOString());
  return { data, error };
}

export async function getSpecificTypeForClass(classId, type) {
  const { data, error } = await supabase
    .from("chats")
    .select(
      `
      id,
      name,
      expires_at
    `
    )
    .eq("class_id", classId)
    .eq("type", type)
    .gte("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: true });
  return { data, error };
}

export async function createChatForClass(classId, name, expiresAt, userId) {
  const { data, error } = await supabase.rpc("create_chat_and_enroll_user", {
    user_id: userId,
    name: name,
    class_id: classId,
    expires_at: expiresAt
  });
  return {data, error};
}

export async function updateChatForClass(chatId, name, expiresAt) {
  const { data, error } = await supabase
    .from("chats")
    .update({ name: name, expires_at: expiresAt })
    .eq("id", chatId)
    .select(
      `
        id,
        name,
        expires_at,
        type
        `
    )
    .single();
  return { data, error };
}
