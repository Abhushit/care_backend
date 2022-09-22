import { Router } from "express";
import authenticate from "../utils/authenticate.js";
import controller from "./controller.js";

const router = Router();

router.get("/tests", authenticate, controller.getTests);
router.get("/tests/:id", authenticate, controller.getSingleTest);

router.post("/test", authenticate, controller.addTest);
router.put("/test/:id", authenticate, controller.updateTest);
router.delete("/test/:id", authenticate, controller.deleteTest);

export default router;
