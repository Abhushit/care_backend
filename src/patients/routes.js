import { Router } from "express";
import authenticate from "../utils/authenticate.js";
import upload from "../utils/upload.js";
import controller from "./controller.js";

const router = Router();

router.get("/patients", authenticate, controller.getPatients);

router.post(
  "/patients", authenticate,
//   upload.array("image",5),
upload.fields([{
    name: 'image',
    maxCount: 5
}]),
  controller.addPatients
);

router.put("/patients/:id", authenticate, upload.fields([{ name: 'image', maxCount: 5 }]), controller.updatePatient);
router.delete("/patients/:id", authenticate, controller.deletePatient);

export default router;
