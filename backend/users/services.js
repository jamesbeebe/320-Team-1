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

// Get current user profile from Supabase Auth
export async function getCurrentUserProfile(accessToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error) {
        throw new Error(error.message);
    }
    return user;
}

// Update current user profile
export async function updateUserProfile(accessToken, updates) {
    // Update the user's metadata in Supabase Auth
    const { data, error } = await supabase.auth.updateUser({
        data: updates
    });
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data.user;
}

