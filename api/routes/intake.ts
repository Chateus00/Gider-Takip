import { Router, type Request, type Response } from "express";
import { getIntakeMethods, simulateIntake } from "../data/subscriptions.js";
import type { IntakeSimulationInput } from "../../shared/subscriptions.js";

const router = Router();

router.get("/methods", (_req: Request, res: Response) => {
  res.json(getIntakeMethods());
});

router.post("/simulate", (req: Request<unknown, unknown, IntakeSimulationInput>, res: Response) => {
  const body = req.body;

  if (!body?.method) {
    res.status(400).json({ message: "Takip yontemi gerekli." });
    return;
  }

  res.json(simulateIntake(body));
});

export default router;
