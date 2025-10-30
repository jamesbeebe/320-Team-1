import ical from 'node-ical';
import { supabase } from './supabase-client.js';
function parseIcs(filePath = 'test.ics') {
    const data = ical.sync.parseFile(filePath);
    let classArray = [];
    let subjectArray = [];
    let catalogArray = [];
    let sectionArray = [];

    // Extract class information from events
    for (const [key, event] of Object.entries(data)) {
        if (event.type === 'VEVENT') {
            // Extract the class part from summary (e.g., "COMPSCI 383-01")
            const match = event.summary.match(/^([A-Z]+)\s+(\d+)-(\d+)/);
            if (match) {
                const [fullMatch, subject, catalog, section] = match;
                if (!classArray.includes(fullMatch)) {
                    classArray.push(fullMatch);
                    subjectArray.push(subject.trim());    // e.g., "COMPSCI"
                    // Add a space before the catalog number to match database format
                    catalogArray.push(' ' + catalog.trim());    // e.g., " 383"
                    sectionArray.push(section.trim());    // e.g., "01"
                }
            }
        }
    }

    return {
        classArray,      // Full strings like "COMPSCI 383-01"
        subjectArray,    // Just "COMPSCI"
        catalogArray,    // Just "383"
        sectionArray     // Just "01"
    };
}

async function findMatchingClassIds(filePath) {
  const { classArray, subjectArray, catalogArray, sectionArray } = parseIcs(filePath);

  let classIds = [];

  // Loop over each class and query Supabase
  for (let i = 0; i < classArray.length; i++) {
    const subject = subjectArray[i];
    const catalog = catalogArray[i];
    const section = sectionArray[i];

    console.log(`Searching for: subject='${subject}', catalog='${catalog}', section='${section}'`);
    
    // First, let's see what's in the database
    const { data: allData } = await supabase
      .from('classes')
      .select('*');
    console.log('All classes in DB:', allData);

    const { data, error } = await supabase
      .from('classes')
      .select('*')  // Select all fields to see what we get
      .eq('subject', subject)
      .eq('catalog', catalog)
      .eq('section', section)
      .maybeSingle(); // returns null if no match

    if (error) {
      console.error(`Error checking ${classArray[i]}:`, error);
    } else if (data) {
      classIds.push(data.id);
      console.log(`Matched ${classArray[i]} → Full record:`, data);
    } else {
      console.log(`No match for ${classArray[i]} - checking types:`);
      // Let's check the data types of what we're searching
      console.log('Types of search values:', {
        subject: typeof subject,
        catalog: typeof catalog,
        section: typeof section
      });
    }
  }

  return classIds;
}

(async () => {
  const ids = await findMatchingClassIds('test.ics');
  console.log('Matched class IDs:', ids);
})();