import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registerRouter from "./register";
import { contentRouter } from "./content";
import { adminRouter } from "./admin";
import { coursesRouter } from "./courses";
import { contactRouter } from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(registerRouter);
router.use(contentRouter);
router.use(adminRouter);
router.use(coursesRouter);
router.use(contactRouter);

export default router;
