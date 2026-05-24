import { Router, Request, Response } from "express";
import { TYPE_CHART } from "../models/TypeChart";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({
    typeChart: TYPE_CHART,
    types: Object.keys(TYPE_CHART).sort(),
  });
});

export default router;
