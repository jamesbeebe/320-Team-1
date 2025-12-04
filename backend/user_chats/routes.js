import router from "express";   
import { log } from "../logs/logger.js";
import {createUserChat, deleteUserChat, getAllUserChatsForSpecificClass} from "./controller.js";

export const userChatsRouter = router();

// userChatsRouter.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: UserChats
 *     description: Manage user-chat relationships
 *
 * components:
 *   schemas:
 *     UserIdBody:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *       required: [userId]
 */

/**
 * @swagger
 * /userChats/{classId}:
 *   get:
 *     tags: [UserChats]
 *     summary: Get user chats for a specific class
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
 *         description: List of user chats
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userChatsRouter.get("/:classId", async (req, res) => {
  const {classId} = req.params;
  const {userId} = req.body;
  const {data, error} = await getAllUserChatsForSpecificClass(classId, userId);
  if (error) {
    log("error", `Error getting userChats for specific class: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
})

/**
 * @swagger
 * /userChats/{chatId}:
 *   post:
 *     tags: [UserChats]
 *     summary: Create a user-chat relation (join a chat)
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
 *             $ref: '#/components/schemas/UserIdBody'
 *     responses:
 *       200:
 *         description: Relation created
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /userChats/{chatId}:
 *   delete:
 *     tags: [UserChats]
 *     summary: Delete a user-chat relation (leave a chat)
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
 *             $ref: '#/components/schemas/UserIdBody'
 *     responses:
 *       200:
 *         description: Relation deleted
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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