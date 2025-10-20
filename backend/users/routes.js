// this contains all the user routes
import express from "express";
import { getUser, deleteUser, getSpecificUser} from "./services.js";
export const userRouter = express.Router();
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

