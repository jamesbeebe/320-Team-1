import { supabase } from "../supabase-client.js";

export async function createUserChat(chatId, userId) {
  const { data, error } = await supabase
    .from("user_chats")
    .insert({ chat_id: chatId, user_id: userId })
    .select()
    .single();
  return { data, error };
}

export async function getAllUserChatsForSpecificClass(classId, userId){
  const {data, error} = await supabase
    .from("user_chats")
    .select(`
      chats(id,
      name,
      type
      )
      `)
    .eq("user_id", userId)
    .eq("chats.class_id", classId);
  return {data, error};
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
