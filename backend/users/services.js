// this contains all the logic that encapsulates user operations
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
export async function getUserTable(){
    const {data, error} = await supabase.from("users").select("*");
    if(error){
        throw new Error(error.message);
    }
    return data;
}
export async function postUserTable(user){
    const {data, error} = await supabase.from("users").insert(user).select();
    if(error){
        throw new Error(error.message);
    }
    return data[0];
}

export async function deleteUserTable(userId){
    const {data, error} = await supabase.from('users').delete().eq('id', userId).select();
    if(error){
        throw new Error(error.message);
    }
    return data[0];
}

