import express from "express";

import prisma from "../utils/prisma";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();
router.use(protect);

router.post("/", async (req, res) => {
  try {
    const { content, leadId } = req.body;

    const note = await prisma.note.create({
      data: {
        content,
        leadId,
      },
    });

    res.json(note);
  } catch {
    res.status(500).json({
      message: "Failed to create note",
    });
  }
});

export default router;
