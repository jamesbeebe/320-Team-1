import router from "express";
import { log } from "../logs/logger.js";
import {
  getListOfClasses,
  getAllClasses,
  dropClass,
  addClass,
  bulkEnrollClasses,
} from "./controller.js";
export const classesRouter = router();

classesRouter.get("/list-classes", async (req, res) => {
  const {data, error} = await getListOfClasses();
  if(error) {
    log("error", `Error getting list of all classes: ${error.message}`);
    return res.status(500).json({error: error.message})
  }
  return res.status(200).json(data);
});

classesRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  log("info", `Getting all classes for user ${userId}`);
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

classesRouter.post("/bulk-enroll", async (req, res) => {
  const { classIds, userId } = req.body;
  log("info", `Bulk enrolling classes for user ${JSON.stringify(userId)}: ${JSON.stringify(classIds)}`);
  if (!Array.isArray(classIds) || !userId) {
    log("error", "Invalid request body for bulk-enroll");
    return res
      .status(400)
      .json({ error: "classIds (array) and userId are required" });
  }
  const { data, error } = await bulkEnrollClasses(classIds, userId);
  if (error) {
    log("error", `Error bulk enrolling classes: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});
