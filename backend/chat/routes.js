import router from "express";   
import { log } from "../logs/logger.js";
import { getAllChatsForClass, createChatForClass } from "./controller.js";

export const chatRouter = router();

// chatRouter.use(authenticate);

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
  log("info", `Creating chat for class ${classId} with name ${name} and expiresAt ${expiresAt}`);
  const { data, error } = await createChatForClass(classId, name, expiresAt);
  if (error) {
    log("error", `Error creating chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json(data);
})