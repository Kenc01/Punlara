import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import treesRouter from "./trees";
import adoptionsRouter from "./adoptions";
import journalRouter from "./journal";
import weatherRouter from "./weather";
import farmersRouter from "./farmers";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(treesRouter);
router.use(adoptionsRouter);
router.use(journalRouter);
router.use(weatherRouter);
router.use(farmersRouter);
router.use(adminRouter);

export default router;
