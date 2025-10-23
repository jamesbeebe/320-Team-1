// this contains all the logic that encapsulates user operations
import dotenv from "dotenv";
import { supabase } from "../supabase-client.js";
dotenv.config();

export async function getUser(){
    const {data, error} = await supabase.from("users").select("*");
    if(error){
        throw new Error(error.message);
    }
    return data;
}
export async function getSpecificUser(userId){
    const {data, error} = await supabase.from("users").select("*").eq("id", userId).single();
    if(error){
        throw new Error(error.message);
    }
    return data;
}

export async function deleteUser(userId){
    const {data, error} = await supabase.from('users').delete().eq('id', userId).select();
    if(error){
        throw new Error(error.message);
    }
    return data[0];
}

