import express from "express";

import prisma from "../utils/prisma";

import { protect, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const search =
      req.query.search?.toString() || "";

    const leads = await prisma.lead.findMany({
      where: {
        userId: req.userId,

        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            company: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(leads);
  } catch {
    res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { name, company, email, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        company,
        email,
        phone,

        userId: req.userId!,
      },
    });

    res.status(201).json(lead);
  } catch {
    res.status(500).json({
      message: "Failed to create lead",
    });
  }
});

router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { name, company, email, phone, status } = req.body;

    const existingLead = await prisma.lead.findFirst({
      where: {
        id,

        userId: req.userId,
      },
    });

    if (!existingLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    const updatedLead = await prisma.lead.update({
      where: {
        id,
      },

      data: {
        name,
        company,
        email,
        phone,
        status,
      },
    });

    res.json(updatedLead);
  } catch {
    res.status(500).json({
      message: "Failed to update lead",
    });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const existingLead = await prisma.lead.findFirst({
      where: {
        id,

        userId: req.userId,
      },
    });

    if (!existingLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await prisma.lead.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Lead deleted successfully",
    });
  } catch {
    res.status(500).json({
      message: "Failed to delete lead",
    });
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findFirst({
      where: {
        id,

        userId: req.userId,
      },

      include: {
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      
        tasks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json(lead);
  } catch {
    res.status(500).json({
      message: "Failed to fetch lead",
    });
  }
});

export default router;
