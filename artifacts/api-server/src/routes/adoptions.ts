import { Router } from "express";
import { db } from "../lib/db";
import { adoptionsTable, treesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// List adoptions for current user
router.get("/adoptions", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const adoptions = await db
      .select()
      .from(adoptionsTable)
      .where(eq(adoptionsTable.userId, req.user.id));
    res.json(adoptions);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch adoptions" });
  }
});

// Create adoption
router.post("/adoptions", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { treeId, stewardName, email, phone, treeName, dedicationMessage, isGift, recipientName, recipientEmail } = req.body;
    if (!treeId || !stewardName || !email || !phone || !treeName) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Check tree is still available
    const [tree] = await db.select().from(treesTable).where(eq(treesTable.id, treeId));
    if (!tree) {
      res.status(404).json({ error: "Tree not found" });
      return;
    }
    if (tree.status === "adopted") {
      res.status(400).json({ error: "Tree is already adopted" });
      return;
    }

    const [adoption] = await db
      .insert(adoptionsTable)
      .values({
        userId: req.user.id,
        treeId,
        treeName,
        stewardName,
        email,
        phone,
        dedicationMessage: dedicationMessage || null,
        status: "pending_payment",
        isGift: isGift || false,
        recipientName: recipientName || null,
        recipientEmail: recipientEmail || null,
      })
      .returning();

    res.status(201).json(adoption);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create adoption" });
  }
});

// Get single adoption
router.get("/adoptions/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const id = parseInt(req.params.id, 10);
    const [adoption] = await db
      .select()
      .from(adoptionsTable)
      .where(eq(adoptionsTable.id, id));

    if (!adoption || adoption.userId !== req.user.id) {
      res.status(404).json({ error: "Adoption not found" });
      return;
    }

    // Fetch associated tree
    const [tree] = await db.select().from(treesTable).where(eq(treesTable.id, adoption.treeId));
    res.json({ ...adoption, tree: tree || null });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch adoption" });
  }
});

// Create PayMongo checkout session
router.post("/payments/checkout", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { adoptionId } = req.body;
    if (!adoptionId) {
      res.status(400).json({ error: "adoptionId required" });
      return;
    }

    const [adoption] = await db
      .select()
      .from(adoptionsTable)
      .where(eq(adoptionsTable.id, adoptionId));

    if (!adoption || adoption.userId !== req.user.id) {
      res.status(404).json({ error: "Adoption not found" });
      return;
    }

    const [tree] = await db.select().from(treesTable).where(eq(treesTable.id, adoption.treeId));
    if (!tree) {
      res.status(404).json({ error: "Tree not found" });
      return;
    }

    const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
    if (!PAYMONGO_SECRET) {
      // No PayMongo key — return a demo/placeholder checkout URL for testing
      const placeholderUrl = `https://checkout.paymongo.com/demo?ref=PNL-${adoption.id}`;
      await db
        .update(adoptionsTable)
        .set({ checkoutUrl: placeholderUrl, paymentId: `demo_${adoption.id}` })
        .where(eq(adoptionsTable.id, adoption.id));
      res.json({ checkoutUrl: placeholderUrl, referenceNumber: `PNL-${adoption.id.toString().padStart(6, "0")}` });
      return;
    }

    // Create PayMongo checkout session
    const amountInCentavos = tree.pricePerYear * 100;
    const body = {
      data: {
        attributes: {
          billing: { name: adoption.stewardName, email: adoption.email, phone: adoption.phone },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          line_items: [
            {
              currency: "PHP",
              amount: amountInCentavos,
              description: `Punlara Tree Adoption — ${tree.name} (${tree.treeCode}) for one year`,
              name: `${adoption.treeName} — ${tree.name}`,
              quantity: 1,
            },
          ],
          payment_method_types: ["gcash", "card", "paymaya"],
          success_url: `${process.env.APP_URL || "https://" + process.env.REPLIT_DOMAINS?.split(",")[0]}/adopt?success=1&adoption=${adoption.id}`,
          cancel_url: `${process.env.APP_URL || "https://" + process.env.REPLIT_DOMAINS?.split(",")[0]}/adopt?cancelled=1`,
          description: `Adopt ${tree.name} on Punlara — Tree ${tree.treeCode}`,
          reference_number: `PNL-${adoption.id.toString().padStart(6, "0")}`,
        },
      },
    };

    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(PAYMONGO_SECRET + ":").toString("base64")}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errData = await response.json();
      req.log.error({ paymongo: errData }, "PayMongo error");
      res.status(500).json({ error: "Payment provider error" });
      return;
    }

    const data = (await response.json()) as { data: { id: string; attributes: { checkout_url: string; reference_number: string } } };
    const checkoutUrl = data.data.attributes.checkout_url;
    const referenceNumber = data.data.attributes.reference_number;

    await db
      .update(adoptionsTable)
      .set({ checkoutUrl, paymentId: data.data.id })
      .where(eq(adoptionsTable.id, adoption.id));

    res.json({ checkoutUrl, referenceNumber });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// PayMongo webhook
router.post("/payments/webhook", async (req, res) => {
  try {
    const event = req.body;
    if (event?.data?.attributes?.type === "checkout_session.payment.paid") {
      const session = event.data.attributes.data;
      const paymentId = session?.id;
      if (paymentId) {
        const [adoption] = await db
          .select()
          .from(adoptionsTable)
          .where(eq(adoptionsTable.paymentId, paymentId));
        if (adoption) {
          await db
            .update(adoptionsTable)
            .set({ status: "active" })
            .where(eq(adoptionsTable.id, adoption.id));
          // Mark tree as adopted
          await db
            .update(treesTable)
            .set({ status: "adopted" })
            .where(eq(treesTable.id, adoption.treeId));
        }
      }
    }
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Webhook error" });
  }
});

export default router;
