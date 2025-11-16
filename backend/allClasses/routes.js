import router from "express";
import { log } from "../logs/logger.js";
import {
  getListOfClasses,
} from "./controller.js";
export const allClassesRouter = router();

allClassesRouter.get("/list-classes", async (req, res) => {
  const {data, error} = await getListOfClasses();
  if(error) {
    log("error", `Error getting list of all classes: ${error.message}`);
    return res.status(500).json({error: error.message})
  }
  return res.status(200).json(data);
});