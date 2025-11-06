import router from "express";
import { log } from "../logs/logger.js";
import {
  getAllChatsForClass,
  createChatForClass,
  updateChatForClass,
  getSpecificTypeForClass,
} from "./controller.js";

export const chatRouter = router();

// chatRouter.use(authenticate);

chatRouter.get("/class/:classId/", async (req, res) => {
  const { classId } = req.params;
  const { userId } = req.query;
  log("info", `Getting all chats for class ${classId} and user ${userId}`);
  const { response, error } = await getAllChatsForClass(classId, userId);
  log(
    "info",
    `Response: ${JSON.stringify(response)}, Error: ${JSON.stringify(error)}`
  );
  if (error) {
    log("error", `Error getting chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(response);
});

chatRouter.get("/class/:classId/:type", async (req, res) => {
  const {classId, type} = req.params;
  const {data, error} = await getSpecificTypeForClass(classId, type);
  if(error){
    log("error", `Error getting specific chat: ${error.message}`);
    return res.status(500).json({error: error.message});
  }
  return res.status(200).json(data);
})

chatRouter.post("/class/:classId/", async (req, res) => {
  const { classId } = req.params;
  const { name , expiresAt, userId} = req.body;
  log("info", `Creating chat for class ${classId} with name ${name} and expiresAt ${expiresAt} and userId ${userId}.`);
  const { data, error } = await createChatForClass(classId, name, expiresAt, userId);
  if (error) {
    log("error", `Error creating chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
})

chatRouter.put("/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { name, expiresAt } = req.body;
  log("info", `Updating chat ${chatId} with name ${name} and expiresAt ${expiresAt}`);
  const { data, error } = await updateChatForClass(chatId, name, expiresAt);
  if (error) {
    log("error", `Error updating chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
})