import router from "express";
import { log } from "../logs/logger.js";
import { getAllClasses, dropClass, addClass } from "./controller.js";
export const classesRouter = router();

classesRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await getAllClasses(userId);
  if (error) {
    log("error", `Error getting all classes: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

classesRouter.post("/drop/:classId", async (req, res) => {
  const { classId } = req.params;
  const { userId } = req.body;
  const { data, error } = await dropClass(classId, userId);
  if (error) {
    log("error", `Error dropping class: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

classesRouter.post("/add/:classId", async (req, res) => {
  const { classId } = req.params;
  const { userId } = req.body;
  const { data, error } = await addClass(classId, userId);
  if (error) {
    log("error", `Error adding class: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});