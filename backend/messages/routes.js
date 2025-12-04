import router from "express";
import { getMessage } from "./controller.js";
import { log } from "../logs/logger.js";
import authenticate from "../utils/auth.js";

export const messageRouter = router();

//messageRouter.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Retrieve chat messages
 */

/**
 * @swagger
 * /messages/{chatId}:
 *   get:
 *     tags: [Messages]
 *     summary: Get messages for a chat within a date range
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         required: false
 *         description: ISO date string. Defaults to start of yesterday.
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         required: false
 *         description: ISO date string. Defaults to end of today.
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of messages
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
messageRouter.get("/:chatId", async (req, res) => {
  const { chatId } = req.params;
  let { startDate, endDate } = req.query;

  // Set default startDate to start of yesterday (00:00:00.000)
  if (!startDate) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 1);
    startDate = d.toISOString();
  }

  // Set default endDate to end of today (23:59:59.999)
  if (!endDate) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    endDate = today.toISOString();
  }

  const { data, error } = await getMessage(chatId, startDate, endDate);
  if (error) {
    log("error", `Error getting messages: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});
