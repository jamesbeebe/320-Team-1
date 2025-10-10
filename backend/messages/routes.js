import router from "express";
import { getMessage } from "./controller.js";

export const messageRouter = router();


messageRouter.get("/:chatId?startDate&endDate", async (req,res) => {
    const { chatId, startDate, endDate } = req.params;
    const {data, error} = await getMessage(chatId, startDate, endDate);
    if (error) {
        return res.status(500).json({error: error.message});
    }
    return res.status(200).json(data);
})

