import { parseIcs, findMatchingClassIds } from "../ics_parser.js";
import { log } from "../logs/logger.js";

export async function processICSFile(fileBuffer) {
  const bufferSize = fileBuffer?.length ?? 0;
  log("info", `processICSFile: starting with buffer size=${bufferSize} bytes`);
  const icsContent = fileBuffer.toString("utf8");
  const hasCalendarHeader = icsContent.includes("BEGIN:VCALENDAR");
  log("info", `processICSFile: contains BEGIN:VCALENDAR=${hasCalendarHeader}`);

  try {
    // Parse the ICS content directly from memory
    const parsedData = parseIcs(icsContent);

    const { data: classRows, error } = await findMatchingClassIds(icsContent);
    if (error) {
      log("error", `processICSFile: Supabase query error: ${error.message}`);
      throw error;
    }
    const classIds = (classRows ?? [])
      .map((row) => (row && typeof row === "object" ? row.id : row))
      .filter((v) => Number.isInteger(Number(v)))
      .map((v) => Number(v));
    log(
      "info",
      `processICSFile: Supabase returned ${classIds?.length ?? 0} class ids`
    );
    return { parsedData, classIds };
  } catch (err) {
    const errMsg =
      err && err.stack
        ? err.stack
        : err && err.message
        ? err.message
        : String(err);
    log("error", `processICSFile: error=${errMsg}`);
    throw err;
  }
}
