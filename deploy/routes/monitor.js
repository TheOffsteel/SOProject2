import { Router } from "express";
import { getMonitor } from "../controllers/monitorController.js";

const router = Router();
router.get("/", getMonitor);
export default router;
