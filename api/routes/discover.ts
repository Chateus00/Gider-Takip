import { Router, type Request, type Response } from "express";
import { getDiscoverItems } from "../data/subscriptions.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const query =
    typeof req.query.q === "string"
      ? req.query.q
      : "";

  res.json(getDiscoverItems(query));
});

export default router;
