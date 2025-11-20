// this contains all the user routes
import express from "express";
import { getUser, deleteUser, getSpecificUser, getCurrentUserProfile, updateUserProfile } from "./services.js";
import { log } from "../logs/logger.js";
export const userRouter = express.Router();

// GET /api/users - Get all users
userRouter.get("/", async (req, res) => {
    try {
        const users = await getUser();

        if(users.length === 0){
            return res.status(404).json({error: "No users found"});
        }

        return res.status(200).json(users);
    } 
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

// GET /api/users/me - Get current user profile (MUST come before /:userId)
userRouter.get("/me", async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No authorization token provided" });
        }

        const accessToken = authHeader.split(" ")[1];
        const user = await getCurrentUserProfile(accessToken);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return user data in the format frontend expects
        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || '',
                major: user.user_metadata?.major || '',
                gradYear: user.user_metadata?.gradYear || ''
            }
        });
    } catch (error) {
        log("error", `Error fetching current user: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /api/users/me - Update current user profile (MUST come before /:userId)
userRouter.put("/me", async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "No authorization token provided" });
        }

        const accessToken = authHeader.split(" ")[1];
        const { name, major, gradYear } = req.body;

        // Validate input
        if (!name || !major || !gradYear) {
            return res.status(400).json({ error: "Name, major, and graduation year are required" });
        }

        // Update user profile
        const updates = {
            name,
            major,
            gradYear: parseInt(gradYear)
        };

        const updatedUser = await updateUserProfile(accessToken, updates);

        log("info", `User profile updated: ${updatedUser.id}`);

        // Return updated user data
        return res.status(200).json({
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.user_metadata?.name || '',
                major: updatedUser.user_metadata?.major || '',
                gradYear: updatedUser.user_metadata?.gradYear || ''
            }
        });
    } catch (error) {
        log("error", `Error updating user profile: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET /api/users/:userId - Get specific user by ID
userRouter.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await getSpecificUser(userId);

        if(!user){
            return res.status(404).json({error: "No user found"});
        }

        return res.status(200).json(user);
    } 
    catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

// DELETE /api/users/:userId - Delete user by ID
userRouter.delete("/:userId", async (req, res) => {
    try{
        const userId = req.params['userId'];
        const deletedUser = await deleteUser(userId);

        if(!deletedUser){
            return res.status(404).json({error: "User not found"});
        }

        return res.status(200).json(deletedUser);
    }
    catch(error){
        console.error("Error deleting user:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});
