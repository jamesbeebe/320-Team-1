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

/**
 * @swagger
 * tags:
 *   - name: Classes
 *     description: Manage user classes
 *
 * components:
 *   schemas:
 *     UserIdBody:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *       required: [userId]
 *     BulkEnrollRequest:
 *       type: object
 *       properties:
 *         classIds:
 *           type: array
 *           items:
 *             type: string
 *         userId:
 *           type: string
 *       required: [classIds, userId]
 */

/**
 * @swagger
 * /classes/list-classes:
 *   get:
 *     tags: [Classes]
 *     summary: Get list of all classes
 *     responses:
 *       200:
 *         description: List of classes
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
classesRouter.get("/list-classes", async (req, res) => {
  const {data, error} = await getListOfClasses();
  if(error) {
    log("error", `Error getting list of all classes: ${error.message}`);
    return res.status(500).json({error: error.message})
  }
  return res.status(200).json(data);
});

/**
 * @swagger
 * /classes/{userId}:
 *   get:
 *     tags: [Classes]
 *     summary: Get all classes for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of classes
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /classes/drop/{classId}:
 *   post:
 *     tags: [Classes]
 *     summary: Drop a class for a user
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserIdBody'
 *     responses:
 *       200:
 *         description: Drop result
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /classes/add/{classId}:
 *   post:
 *     tags: [Classes]
 *     summary: Add a class for a user
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserIdBody'
 *     responses:
 *       200:
 *         description: Add result
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /classes/bulk-enroll:
 *   post:
 *     tags: [Classes]
 *     summary: Bulk enroll classes for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkEnrollRequest'
 *     responses:
 *       200:
 *         description: Enroll result
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
