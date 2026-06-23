import { Router, type Request, type Response } from "express";
import {
  createSubscription,
  getDashboardData,
  getPredictionById,
  getSubscriptionById,
  updateSubscription,
} from "../data/subscriptions.js";
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from "../../shared/subscriptions.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.json(getDashboardData());
});

router.get("/:id", (req: Request, res: Response) => {
  const item = getSubscriptionById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Abonelik bulunamadı." });
    return;
  }

  res.json(item);
});

router.get("/:id/prediction", (req: Request, res: Response) => {
  const prediction = getPredictionById(req.params.id);

  if (!prediction) {
    res.status(404).json({ message: "Tahmin verisi bulunamadı." });
    return;
  }

  res.json(prediction);
});

router.post("/", (req: Request<unknown, unknown, CreateSubscriptionInput>, res: Response) => {
  const body = req.body;

  if (
    !body?.name ||
    !body?.category ||
    !body?.logoUrl ||
    !body?.currency ||
    !body?.billingCycle ||
    !body?.nextPaymentDate ||
    typeof body.currentAmount !== "number"
  ) {
    res.status(400).json({ message: "Gerekli alanlar eksik." });
    return;
  }

  const created = createSubscription(body);
  res.status(201).json(created);
});

router.patch("/:id", (req: Request<{ id: string }, unknown, UpdateSubscriptionInput>, res: Response) => {
  const updated = updateSubscription(req.params.id, req.body ?? {});

  if (!updated) {
    res.status(404).json({ message: "Abonelik bulunamadı." });
    return;
  }

  res.json(updated);
});

export default router;
