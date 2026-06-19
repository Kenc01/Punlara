import { Router, type Request, type Response } from "express";
import { db } from "../lib/db";
import { journalEntriesTable, treesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function isAdmin(req: Request): boolean {
  if (!req.isAuthenticated()) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  return adminEmails.includes(req.user?.email ?? "");
}

// Public: list journal entries for a tree
router.get("/trees/:id/journal", async (req: Request, res: Response) => {
  const treeId = parseInt(req.params.id, 10);
  if (isNaN(treeId)) {
    res.status(400).json({ error: "Invalid tree ID" });
    return;
  }
  try {
    const [tree] = await db.select({ id: treesTable.id }).from(treesTable).where(eq(treesTable.id, treeId));
    if (!tree) {
      res.status(404).json({ error: "Tree not found" });
      return;
    }
    const entries = await db
      .select()
      .from(journalEntriesTable)
      .where(eq(journalEntriesTable.treeId, treeId))
      .orderBy(desc(journalEntriesTable.entryDate));
    res.json(entries);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
});

// Admin: list all trees (for admin panel sidebar)
router.get("/admin/trees", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  try {
    const trees = await db.select().from(treesTable).orderBy(treesTable.name);
    res.json(trees);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch trees" });
  }
});

// Admin: create a journal entry
router.post("/admin/journal", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const { treeId, title, body, photoUrl, entryDate } = req.body;
  if (!treeId || !title || !body || !entryDate) {
    res.status(400).json({ error: "treeId, title, body, and entryDate are required" });
    return;
  }
  try {
    const [entry] = await db
      .insert(journalEntriesTable)
      .values({ treeId, title, body, photoUrl: photoUrl || null, entryDate })
      .returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create journal entry" });
  }
});

// Admin: delete a journal entry
router.delete("/admin/journal/:id", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [deleted] = await db
      .delete(journalEntriesTable)
      .where(eq(journalEntriesTable.id, id))
      .returning({ id: journalEntriesTable.id });
    if (!deleted) { res.status(404).json({ error: "Entry not found" }); return; }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete journal entry" });
  }
});

export default router;
