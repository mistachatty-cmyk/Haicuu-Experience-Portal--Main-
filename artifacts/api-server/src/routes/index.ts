import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hostingInquiriesRouter from "./hosting-inquiries";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hostingInquiriesRouter);

export default router;
