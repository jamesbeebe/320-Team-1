// this contains all the logic that encapsulates user operations
import dotenv from "dotenv";
import { supabase } from "../supabase-client.js";
dotenv.config();

export async function getUserTable(){
    const {data, error} = await supabase.from("users").select("*");
    if(error){
        throw new Error(error.message);
    }
    return data;
}
export async function getSpecificUserTable(userId){
    const {data, error} = await supabase.from("users").select("*").eq("id", userId).single();
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

