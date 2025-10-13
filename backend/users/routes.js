// this contains all the user routes
import express from "express";
import { getUserTable, postUserTable, deleteUserTable} from "./services.js";
const router = express.Router();
router.get("/api/users", async (req, res) => {
    try {
        const users = await getUserTable();

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

router.post("/api/users", async (req, res) => {
    try {
        const user = req.body; // Access the user data sent in the request body
        const newUser = await postUserTable(user); // Save the user to the database

        if(!newUser){
            return res.status(400).json({error: "Failed to create user"});
        }

        return res.status(201).json(newUser); // Respond with the newly created user
    } 
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

router.delete("/api/users/:userId", async (req, res) => {
    try{
        const userId = req.params['userId'];
        const deletedUser = await deleteUserTable(userId);

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

