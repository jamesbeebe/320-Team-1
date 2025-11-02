import { supabase } from "../supabase-client.js";

export async function getAllChatsForClass(classId) {
  const { data, error } = await supabase
    .from("chats")
    .select(`
        id,
        name,
        expires_at,
        type
        `)
    .eq("class_id", classId)
    .lte("expires_at", new Date().toISOString());
  return { data, error };
}

export async function getSpecificTypeForClass(classId, type){
  const {data, error} = await supabase
    .from("chats")
    .select(`
      id,
      name,
      expires_at,
      type  
    `)
    .eq("class_id", classId)
    .eq("type", type)
    .lte("expires_at", new Date().toISOString());
  return {data, error};
}

export async function createChatForClass(classId, name, expiresAt, type) {
  const { data, error } = await supabase
    .from("chats")
    .insert({ name: name, class_id: classId, created_at: new Date().toISOString(), expires_at: expiresAt, type: type})
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
        expires_at,
        type
        `)
    .single();
  return { data, error };
}