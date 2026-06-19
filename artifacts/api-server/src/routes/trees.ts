import { Router } from "express";
import { db } from "../lib/db";
import { treesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/trees", async (req, res) => {
  try {
    const { type, tier, location } = req.query;
    const conditions = [];
    if (tier && typeof tier === "string") conditions.push(eq(treesTable.tier, tier));
    if (location && typeof location === "string") conditions.push(eq(treesTable.location, location));

    const trees = await db
      .select()
      .from(treesTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json(trees);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch trees" });
  }
});

router.get("/trees/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid tree ID" });
      return;
    }
    const [tree] = await db.select().from(treesTable).where(eq(treesTable.id, id));
    if (!tree) {
      res.status(404).json({ error: "Tree not found" });
      return;
    }
    res.json(tree);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch tree" });
  }
});

export default router;
