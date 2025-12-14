// this contains all the user routes
import express from "express";
import { getUser, deleteUser, getSpecificUser, getUsersCompatibility} from "./services.js";
export const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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


/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /users/{userId}/compatibility/{classId}:
 *   get:
 *     tags: [Users]
 *     summary: Get compatibility data for a user and class
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compatibility data
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get("/:userId/compatibility/:classId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const classId = req.params.classId;
        const compatibilityData = await getUsersCompatibility(userId, classId);
        return res.status(200).json(compatibilityData);
    } catch (error) {
        console.error("Error fetching users compatibility:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 *       404:
 *         description: No user found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
        console.error("Error fetching user:", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
});
