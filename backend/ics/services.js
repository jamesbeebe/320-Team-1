import fs from 'fs';
import path from 'path';
import { parseIcs, findMatchingClassIds } from "../ics_parser.js";

export async function processICSFile(fileBuffer) {
    // Save file temporarily since parseIcs expects a file path
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.ics`);
    fs.writeFileSync(tempFilePath, fileBuffer);
    
    try {
        // Parse the ICS file
        const parsedData = parseIcs(tempFilePath);
        const classIds = await findMatchingClassIds(tempFilePath);
        
        return { parsedData, classIds };
    } finally {
        // Clean up temp file
        fs.unlinkSync(tempFilePath);
    }
}