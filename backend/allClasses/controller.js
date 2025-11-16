import { supabase } from "../supabase-client.js";
import { log } from "../logs/logger.js";

export async function getListOfClasses() {
  const {data, error} = await supabase
    .from("classes")
    .select("id, course_title, subject, catalog, section");
    if(error) console.log("supabase error", error)
  return {data, error}
}