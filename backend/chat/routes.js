import router from "express";
import { log } from "../logs/logger.js";
import {
  getAllChatsForClass,
  createChatForClass,
  updateChatForClass,
  getSpecificTypeForClass,
  joinChat,
  leaveChat,
  getAllUserChats,
} from "./controller.js";

export const chatRouter = router();

// chatRouter.use(authenticate);

chatRouter.get("/class/:classId/", async (req, res) => {
  const { classId } = req.params;
  const { userId } = req.query;
  log("info", `Getting all chats for class ${classId} and user ${userId}`);
  const { data, error } = await getAllChatsForClass(classId, userId);
  if (error) {
    log("error", `Error getting chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

chatRouter.get("/class/all/:userId", async (req, res) => {
  const { userId } = req.params;
  // log("info", `Getting all chats for user ${userId}`);
  const { data, error } = await getAllUserChats(userId);
  if (error) {
    log("error", `Error getting all chats for user: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

chatRouter.get("/class/:classId/:type", async (req, res) => {
  const { classId, type } = req.params;
  const { data, error } = await getSpecificTypeForClass(classId, type);
  if (error) {
    log("error", `Error getting specific chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

chatRouter.post("/class/:classId/", async (req, res) => {
  const { classId } = req.params;
  const { name, expiresAt, userId } = req.body;
  log(
    "info",
    `Creating chat for class ${classId} with name ${name} and expiresAt ${expiresAt} and userId ${userId}.`
  );
  const { data, error } = await createChatForClass(
    classId,
    name,
    expiresAt,
    userId
  );
  if (error) {
    log("error", `Error creating chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
});

chatRouter.put("/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { name, expiresAt } = req.body;
  log(
    "info",
    `Updating chat ${chatId} with name ${name} and expiresAt ${expiresAt}`
  );
  const { data, error } = await updateChatForClass(chatId, name, expiresAt);
  if (error) {
    log("error", `Error updating chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

chatRouter.post("/class/:classId/join", async (req, res) => {
  const { classId } = req.params;
  const { userId } = req.query;
  log("info", `Joining chat ${classId} for user ${userId}`);
  const { data, error } = await joinChat(classId, userId);
  if (error) {
    log("error", `Error joining chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

chatRouter.post("/class/:classId/leave", async (req, res) => {
  const { classId } = req.params;
  const { userId } = req.query;
  log("info", `Leaving chat ${classId} for user ${userId}`);
  const { data, error } = await leaveChat(classId, userId);
  if (error) {
    log("error", `Error leaving chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});
