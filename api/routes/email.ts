import { Router, type Request, type Response } from "express";
import { connectEmailAccount } from "../data/subscriptions.js";
import type { EmailConnectInput } from "../../shared/subscriptions.js";

const router = Router();

router.post("/connect", (req: Request<unknown, unknown, EmailConnectInput>, res: Response) => {
  const body = req.body;

  if (!body?.provider || !body?.email) {
    res.status(400).json({ message: "Mail saglayicisi ve e-posta adresi gerekli." });
    return;
  }

  res.json(connectEmailAccount(body));
});

export default router;
