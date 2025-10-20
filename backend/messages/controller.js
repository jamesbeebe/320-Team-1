import { supabase } from "../supabase-client.js";

export async function getMessage(chatId, startDate, endDate) {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
        id,
        chat_id,
        user_id,
        timestamp,
        content,
        ...users(name)
        `
    )
    .eq("chat_id", chatId)
    .gte("timestamp", startDate)
    .lte("timestamp", endDate)
    .order("timestamp", { ascending: true });
  return { data, error };
}

export async function postMessageAndReturn(chatId, userId, content, timestamp) {
  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        chat_id: chatId,
        user_id: userId,
        content,
        timestamp,
      },
    ])
    .select(
      `
      id,
      chat_id,
      user_id,
      timestamp,
      content,
      ...users(name)
    `
    )
    .single();

  return { d: data, error };
}
