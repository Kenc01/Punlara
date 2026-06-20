import { Router, type Request, type Response } from "express";
import { db } from "../lib/db";
import { adoptionsTable, treesTable, farmersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function isAdmin(req: Request): boolean {
  if (!req.isAuthenticated()) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",").map((e) => e.trim()).filter(Boolean);
  return adminEmails.includes(req.user?.email ?? "");
}

router.get("/admin/adoptions", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const adoptions = await db.select().from(adoptionsTable).orderBy(desc(adoptionsTable.createdAt));
    const withTrees = await Promise.all(
      adoptions.map(async (a) => {
        const [tree] = await db.select().from(treesTable).where(eq(treesTable.id, a.treeId));
        return { ...a, tree: tree || null };
      })
    );
    res.json(withTrees);
  } catch { res.status(500).json({ error: "Failed to fetch adoptions" }); }
});

router.patch("/admin/adoptions/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!status) { res.status(400).json({ error: "status required" }); return; }
  try {
    const [updated] = await db.update(adoptionsTable).set({ status }).where(eq(adoptionsTable.id, id)).returning();
    res.json(updated);
  } catch { res.status(500).json({ error: "Failed to update adoption" }); }
});

router.patch("/admin/trees/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!status) { res.status(400).json({ error: "status required" }); return; }
  try {
    const [updated] = await db.update(treesTable).set({ status }).where(eq(treesTable.id, id)).returning();
    res.json(updated);
  } catch { res.status(500).json({ error: "Failed to update tree" }); }
});

router.get("/admin/farmers", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const farmers = await db.select().from(farmersTable).orderBy(desc(farmersTable.createdAt));
    res.json(farmers);
  } catch { res.status(500).json({ error: "Failed to fetch farmers" }); }
});

router.patch("/admin/farmers/:id", async (req: Request, res: Response) => {
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const id = parseInt(req.params.id, 10);
  const { status, lat, lng } = req.body;
  const updates: Record<string, unknown> = {};
  if (status !== undefined) updates.status = status;
  if (lat !== undefined) updates.lat = lat;
  if (lng !== undefined) updates.lng = lng;
  if (Object.keys(updates).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
  try {
    const [updated] = await db.update(farmersTable).set(updates).where(eq(farmersTable.id, id)).returning();
    res.json(updated);
  } catch { res.status(500).json({ error: "Failed to update farmer" }); }
});

export default router;
