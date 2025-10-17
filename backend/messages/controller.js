import { supabase } from "../supabase-client.js";

export async function getMessage(chatId, startDate, endDate) {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
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
