import express from "express";

import prisma from "../utils/prisma";

import { protect, AuthRequest } from "../middleware/authMiddleware";

import {
  generateLeadSummary,
  generateFollowUpSuggestion,
  generateAssistantResponse,
} from "../services/aiService";

const router = express.Router();

router.use(protect);

router.post("/summary/:leadId", async (req: AuthRequest, res) => {
  try {
    const leadId = req.params.leadId as string;

    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },

      include: {
        notes: true,
      },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const notesText = lead.notes.map((note) => note.content).join("\n");

    const summary = await generateLeadSummary(notesText);

    res.json({
      summary,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to generate summary",
    });
  }
});

router.post("/followup/:leadId", async (req: AuthRequest, res) => {
  try {
    const leadId = req.params.leadId as string;

    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },

      include: {
        notes: true,
      },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const notesText = lead.notes.map((note) => note.content).join("\n");

    const suggestion = await generateFollowUpSuggestion(notesText);

    res.json({
      suggestion,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to generate follow-up suggestion",
    });
  }
});

router.post("/assistant", async (req: AuthRequest, res) => {
  try {
    const { prompt } = req.body;

    const leads = await prisma.lead.findMany({
      where: {
        userId: req.userId,
      },

      include: {
        notes: true,
        tasks: true,
      },
    });

    const crmContext = JSON.stringify(leads);

    const response = await generateAssistantResponse(prompt, crmContext);

    res.json({
      response,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to query assistant",
    });
  }
});

export default router;
