import router from "express";
import { getChat } from "./controller.js";
import { log } from "../logs/logger.js";
import authenticate from "../utils/auth.js";

export const chatRouter = router();

chatRouter.use(authenticate);

chatRouter.get("/class/:classId/", async (req, res) => {
  const { classId } = req.params;
  const { data, error } = await getAllChatsForClass(classId);
  if (error) {
    log("error", `Error getting chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

chatRouter.post("/class/:classId/", async (req, res) => {
  const { classId } = req.params;
  const { name , expiresAt} = req.body;
  const { data, error } = await createChatForClass(classId, name, expiresAt);
  if (error) {
    log("error", `Error creating chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});