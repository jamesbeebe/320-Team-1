import express from "express";
import multer from "multer";
import { processICSFile } from "./services.js";
import { log } from "../logs/logger.js";
export const icsRouter = express.Router();

// Configure multer to store file in memory as buffer
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   - name: ICS
 *     description: Upload and process ICS calendar files
 *
 * components:
 *   schemas:
 *     ICSUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         parsedData:
 *           type: object
 *           description: Parsed ICS data
 *         classIds:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /upload/ics:
 *   post:
 *     tags: [ICS]
 *     summary: Upload ICS file
 *     description: Accepts a single ICS file under the "file" field and returns parsed data.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Parsed ICS content and matched class IDs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ICSUploadResponse'
 *       400:
 *         description: No or empty file uploaded
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
icsRouter.post("/ics", upload.single("file"), async (req, res) => {
  try {
    log("info", "Received ICS upload request");
    if (!req.file) {
      log("error", "No file uploaded in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    log(
      "info",
      `Uploaded file details: name=${req.file.originalname}, mimetype=${req.file.mimetype}, size=${req.file.size} bytes`
    );

    // req.file.buffer contains the file data
    if (!req.file.buffer || req.file.size === 0) {
      log("error", "Uploaded file buffer is empty");
      return res.status(400).json({ error: "Empty file uploaded" });
    }

    const { parsedData, classIds } = await processICSFile(req.file.buffer);
    log("info", "ICS file processed successfully");
    log(
      "info",
      `Parsed classes: count=${
        parsedData?.classArray?.length ?? 0
      }, matched classIds: count=${classIds?.length ?? 0}`
    );
    return res.status(200).json({
      success: true,
      parsedData,
      classIds,
    });
  } catch (error) {
    const errMsg =
      error && error.stack
        ? error.stack
        : error && error.message
        ? error.message
        : String(error);
    log("error", `Error parsing ICS file: ${errMsg}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
