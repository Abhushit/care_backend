import { Router } from 'express';
import authenticate from '../utils/authenticate.js';
import upload from '../utils/upload.js';
import controller from './controller.js';

const router = Router();

router.get("/doctors", authenticate, controller.getDoctors);
router.get("/doctors/:id", authenticate, controller.getSingleDoctor);
router.delete("/doctors/:id",authenticate, controller.deleteDoctor);
router.post("/doctors",authenticate, upload.single("image"), controller.addDoctor);
router.put("/doctors/:id",authenticate, upload.single("image"), controller.updateDoctor);


export default router;