import ical from "node-ical";
import { supabase } from "./supabase-client.js";
import { log } from "./logs/logger.js";
export function parseIcs(icsContent) {
  const data = ical.sync.parseICS(icsContent);
  let classArray = [];
  let subjectArray = [];
  let catalogArray = [];
  let sectionArray = [];

  // Extract class information from events
  for (const [key, event] of Object.entries(data)) {
    if (event.type === "VEVENT") {
      // Extract the class part from summary (e.g., "COMPSCI 383-01")
      const match = event.summary.match(/^([A-Z]+)\s+(\d+)-(\d+)/);
      if (match) {
        const [fullMatch, subject, catalog, section, course_title] = match;
        if (!classArray.includes(fullMatch)) {
          classArray.push(fullMatch.trim());
          subjectArray.push(subject.trim()); // e.g., "COMPSCI"
          catalogArray.push(catalog.trim()); // e.g., "383"
          sectionArray.push(section.trim()); // e.g., "01"
        }
      }
    }
  }

  return {
    classArray, // Full strings like "COMPSCI 383-01"
    subjectArray, // Just "COMPSCI"
    catalogArray, // Just "383"
    sectionArray, // Just "01"
  };
}

export async function findMatchingClassIds(icsContent) {
  let { classArray, subjectArray, catalogArray, sectionArray } =
    parseIcs(icsContent);
  // Ensure all values are trimmed before building filters
  classArray = classArray.map((s) => s?.toString().trim());
  subjectArray = subjectArray.map((s) => s?.toString().trim());
  catalogArray = catalogArray.map((s) => s?.toString().trim());
  sectionArray = sectionArray.map((s) => s?.toString().trim());
  log(
    "info",
    `findMatchingClassIds: subjects=${subjectArray.length}, classes=${classArray.length}`
  );

  // Build OR of AND groups: or=and(subject.eq.X,catalog.eq.Y,section.eq.Z),and(...)
  const filters = subjectArray
    .map((subject, i) => {
      const catalog = catalogArray[i];
      const section = sectionArray[i];
      return `and(subject.eq.${subject},catalog.eq.${catalog},section.eq.${section})`;
    })
    .join(",");
  log("info", `findMatchingClassIds: filters="${filters}"`);

  const { data, error } = await supabase
    .from("classes")
    .select("id")
    .or(filters);

  if (error) {
    log("error", `findMatchingClassIds: supabase error=${error.message}`);
  } else {
    log(
      "info",
      `findMatchingClassIds: supabase returned ${data?.length ?? 0} rows`
    );
  }
  return { data, error };
}
