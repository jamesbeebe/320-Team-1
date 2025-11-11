import express from "express";
import multer from "multer";
import { processICSFile } from "./services.js";

export const icsRouter = express.Router();
// Configure multer to store file in memory as buffer
const upload = multer({ storage: multer.memoryStorage() });

icsRouter.post("/ics", upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // req.file.buffer contains the file data
        const { parsedData, classIds } = await processICSFile(req.file.buffer);
        
        return res.status(200).json({ 
            success: true, 
            parsedData,
            classIds
        });
    } catch (error) {
        console.error("Error parsing ICS file:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});