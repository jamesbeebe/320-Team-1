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

/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: Endpoints for managing chats
 *
 * components:
 *   schemas:
 *     ChatCreateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: string
 *       required: [name, userId]
 *     ChatUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /chats/class/{classId}:
 *   get:
 *     tags: [Chat]
 *     summary: Get all chats for a class (optionally scoped to a user)
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of chats
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /chats/class/all/{userId}:
 *   get:
 *     tags: [Chat]
 *     summary: Get all chats for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of chats
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /chats/class/{classId}/{type}:
 *   get:
 *     tags: [Chat]
 *     summary: Get chats for a class by type
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of chats of specified type
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
chatRouter.get("/class/:classId/:type", async (req, res) => {
  const { classId, type } = req.params;
  const { data, error } = await getSpecificTypeForClass(classId, type);
  if (error) {
    log("error", `Error getting specific chat: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

/**
 * @swagger
 * /chats/class/{classId}:
 *   post:
 *     tags: [Chat]
 *     summary: Create a chat for a class
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
 *             $ref: '#/components/schemas/ChatCreateRequest'
 *     responses:
 *       201:
 *         description: Chat created
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /chats/{chatId}:
 *   put:
 *     tags: [Chat]
 *     summary: Update a chat
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatUpdateRequest'
 *     responses:
 *       200:
 *         description: Chat updated
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /chats/class/{classId}/join:
 *   post:
 *     tags: [Chat]
 *     summary: Join a chat for a class
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Joined
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /chats/class/{classId}/leave:
 *   post:
 *     tags: [Chat]
 *     summary: Leave a chat for a class
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Left
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
