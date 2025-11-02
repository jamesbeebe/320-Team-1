import router from "express";   
import { log } from "../logs/logger.js";
import {createUserChat, deleteUserChat} from "./controller.js";

export const userChatsRouter = router();

// userChatsRouter.use(authenticate);

userChatsRouter.post("/:chatId", async (req, res) => {
  const {chatId} = req.params;
  const {userId} = req.body;
  const { data, error } = await createUserChat(chatId, userId);
  if (error) {
    log("error", `Error creating userChat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

userChatsRouter.delete("/:chatId", async (req, res) => {
  const {chatId} = req.params;
  const {userId} = req.body;
  const { data, error } = await deleteUserChat(chatId, userId);
  if (error) {
    log("error", `Error deleting userChat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});