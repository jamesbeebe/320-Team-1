import { supabase } from "../supabase-client.js";
import { log } from "../logs/logger.js";

export async function getAllUserChats(userId) {
  const { data, error } = await supabase.rpc("get_all_chats_for_user", {
    _user_id: userId,
  });
  return { data, error };
}

export async function getAllChatsForClass(classId, userId) {
  const { data, error } = await supabase.rpc("get_all_chats_for_class", {
    classid: classId,
    date: new Date().toISOString(),
    userid: userId,
  });

  return {data, error };
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
    chat_name: name,
    class_id: classId,
    expires_at: expiresAt,
  });
  return { data, error };
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

export async function joinChat(chatId, userId) {
  const { data: existingRows, error: existingError } = await supabase
    .from("user_chats")
    .select("chat_id")
    .eq("user_id", userId)
    .eq("chat_id", chatId)
    .limit(1);

  if (existingError) {
    return { data: null, error: existingError };
  }

  if (existingRows && existingRows.length > 0) {
    return { data: existingRows[0], error: null };
  }

  const { data, error } = await supabase
    .from("user_chats")
    .insert({ user_id: userId, chat_id: chatId })
    .select()
    .single();
  return { data, error };
}

export async function leaveChat(chatId, userId) {
  const { data: existingRows, error: existingError } = await supabase
    .from("user_chats")
    .select("chat_id")
    .eq("user_id", userId)
    .eq("chat_id", chatId)
    .limit(1);

  if (existingError) {
    return { data: null, error: existingError };
  }

  if (!existingRows || existingRows.length === 0) {
    return {
      data: null,
      error: { message: "User is not enrolled in this chat." },
    };
  }

  const existingId = existingRows[0].id;

  const { data, error } = await supabase
    .from("user_chats")
    .delete()
    .eq("chat_id", chatId)
    .select()
    .single();
  return { data, error };
}
