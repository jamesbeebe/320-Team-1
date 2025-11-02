import { supabase } from "../supabase-client.js";

export async function createUserChat(chatId, userId) {
  const { data, error } = await supabase
    .from("user_chats")
    .insert({ chat_id: chatId, userId: userId })
    .select()
    .single();
  return { data, error };
}

export async function deleteUserChat(chatId, userId) {
  const { data, error } = await supabase
    .from("user_chats")
    .delete()
    .eq("user_id", userId)
    .eq("chat_id", chatId)
    .select()
    .single();
  return { data, error };
}
