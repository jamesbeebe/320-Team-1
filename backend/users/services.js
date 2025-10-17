// this contains all the logic that encapsulates user operations
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
console.log('Supabase URL:', process.env.supabase_url);
console.log('Supabase Key:', process.env.supabase_service_role_key ? 'Loaded ✅' : '❌ Missing key');

export async function getUserTable(res){
    const result = await supabase.from("user_table").select("*");
    console.log(result);
    if(result.error || !result.data){
        res.status(500).send("Error retrieving user data.");
    }
    else{
        let userData = result.data;
        return userData;
        // res.status(200).send("Successfully retrieved user data.");
    }
}
export async function postUserTable(res, user){
    const result = await supabase.from("user_table").insert(user).select();
    if(result.error || !result.data){
        res.status(500).send("Error posting user data.");
    }
    else{
        let postedData = result.data;
        return postedData;
        // res.status(200).send("Successfully posted user data.");
    }
}
