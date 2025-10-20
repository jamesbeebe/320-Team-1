// this contains all the user routes
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { getUserTable, postUserTable } from "./services.js";
const router = express.Router();
router.get("/api/users", async (req, res) => {
    try {
        const users = await getUserTable(res);
        res.json(users);
    } 
    catch (error) {
        console.error("Error fetching users:", error);
    }
});
router.post("/api/users", async (req, res) => {
    try {
        const user = req.body; // Access the user data sent in the request body
        console.log("Received user data:", user);
        const newUser = await postUserTable(res, user); // Save the user to the database
        res.json(newUser); // Respond with the newly created user
    } 
    catch (error) {
        console.error("Error creating user:", error);
    }
});
let app = express();
app.use(express.json());
app.use("/", router);
app.listen(process.env.app_port, () => {console.log(`Server running on port ${process.env.app_port}`);});