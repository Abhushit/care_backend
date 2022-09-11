import { Router } from 'express';
import authenticate from '../utils/authenticate.js';
import authorize from '../utils/authorize.js';
import controller from './controller.js';

const router = Router();

router.get("/users",authenticate, authorize, controller.getUsers);
router.post("/register", controller.addUsers);
router.post("/login", controller.login);



export default router;