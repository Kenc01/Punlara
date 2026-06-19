import { Router } from "express";
import { db } from "../lib/db";
import { farmersTable, treesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/farmers", async (_req, res) => {
  try {
    const farmers = await db
      .select()
      .from(farmersTable)
      .where(eq(farmersTable.status, "approved"));
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
});

router.get("/farmers/my-farm", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const [farmer] = await db
      .select()
      .from(farmersTable)
      .where(eq(farmersTable.userId, req.user.id));
    if (!farmer) {
      res.status(404).json({ error: "No farm registered" });
      return;
    }

    const trees = await db
      .select()
      .from(treesTable)
      .where(eq(treesTable.farmerId, farmer.id));

    res.json({ ...farmer, trees });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch farm" });
  }
});

router.get("/farmers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid farmer ID" });
      return;
    }
    const [farmer] = await db
      .select()
      .from(farmersTable)
      .where(and(eq(farmersTable.id, id), eq(farmersTable.status, "approved")));
    if (!farmer) {
      res.status(404).json({ error: "Farm not found" });
      return;
    }
    const trees = await db
      .select()
      .from(treesTable)
      .where(eq(treesTable.farmerId, id));
    res.json({ ...farmer, trees });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch farmer" });
  }
});

router.post("/farmers/register", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const existing = await db
      .select()
      .from(farmersTable)
      .where(eq(farmersTable.userId, req.user.id));
    if (existing.length > 0) {
      res.status(400).json({ error: "You already have a farm registered" });
      return;
    }

    const { farmName, farmerName, location, bio, phone, treeCount, imageUrl } = req.body;
    if (!farmName || !farmerName || !location || !phone) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const [farmer] = await db
      .insert(farmersTable)
      .values({
        userId: req.user.id,
        farmName,
        farmerName,
        location,
        bio: bio || null,
        phone,
        treeCount: treeCount ? parseInt(treeCount, 10) : 0,
        imageUrl: imageUrl || null,
        status: "pending",
      })
      .returning();

    res.status(201).json(farmer);
  } catch (err) {
    res.status(500).json({ error: "Failed to register farm" });
  }
});

router.put("/farmers/my-farm", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const [farmer] = await db
      .select()
      .from(farmersTable)
      .where(eq(farmersTable.userId, req.user.id));
    if (!farmer) {
      res.status(404).json({ error: "No farm found" });
      return;
    }
    const { farmName, farmerName, location, bio, phone, treeCount, imageUrl } = req.body;
    const [updated] = await db
      .update(farmersTable)
      .set({
        farmName: farmName || farmer.farmName,
        farmerName: farmerName || farmer.farmerName,
        location: location || farmer.location,
        bio: bio !== undefined ? bio : farmer.bio,
        phone: phone || farmer.phone,
        treeCount: treeCount !== undefined ? parseInt(treeCount, 10) : farmer.treeCount,
        imageUrl: imageUrl !== undefined ? imageUrl : farmer.imageUrl,
      })
      .where(eq(farmersTable.id, farmer.id))
      .returning();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update farm" });
  }
});

export default router;
