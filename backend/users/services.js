// this contains all the logic that encapsulates user operations
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
export async function getUserTable(){
    const result = await supabase.from("user_table").select("*");
    if(result.error || !result.data){
        throw new Error("Error getting user data.");
    }
    else{
        userData = result.data;
        return userData;
    }
}
export async function postUserTable(user){
    const result = await supabase.from("user_table").insert(user).select();
    if(result.error || !result.data){
        throw new Error("Error posting user data.");
    }
    else{
        postedData = result.data;
        return postedData[0];
    }
}
