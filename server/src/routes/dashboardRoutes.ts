import express from "express";

import prisma from "../utils/prisma";

import {
  protect,
  AuthRequest,
} from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);

router.get(
  "/stats",
  async (req: AuthRequest, res) => {
    try {
      const totalLeads =
        await prisma.lead.count({
          where: {
            userId: req.userId,
          },
        });

      const newLeads =
        await prisma.lead.count({
          where: {
            userId: req.userId,

            status: "new",
          },
        });

      const contactedLeads =
        await prisma.lead.count({
          where: {
            userId: req.userId,

            status: "contacted",
          },
        });

      const qualifiedLeads =
        await prisma.lead.count({
          where: {
            userId: req.userId,

            status: "qualified",
          },
        });

      const proposalLeads =
        await prisma.lead.count({
          where: {
            userId: req.userId,

            status: "proposal",
          },
        });

      const wonLeads =
        await prisma.lead.count({
          where: {
            userId: req.userId,

            status: "won",
          },
        });

      const lostLeads =
        await prisma.lead.count({
          where: {
            userId: req.userId,

            status: "lost",
          },
        });

      const activeLeads =
        await prisma.lead.count({
          where: {
            userId: req.userId,

            NOT: {
              status: {
                in: [
                  "won",
                  "lost",
                ],
              },
            },
          },
        });

      const recentLeads =
        await prisma.lead.findMany({
          where: {
            userId: req.userId,
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 5,
        });

        const recentTasks =
  await prisma.task.findMany({
    where: {
      lead: {
        userId: req.userId,
      },
    },

    include: {
      lead: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 5,
  });

        const overdueTasks =
  await prisma.task.count({
    where: {
      completed: false,

      dueDate: {
        lt: new Date(),
      },

      lead: {
        userId: req.userId,
      },
    },
  });

      res.json({
        totalLeads,

        activeLeads,

        newLeads,

        contactedLeads,

        qualifiedLeads,

        proposalLeads,

        wonLeads,

        lostLeads,

        recentLeads,

        recentTasks,

        overdueTasks,
      });
    } catch {
      res.status(500).json({
        message:
          "Failed to fetch dashboard stats",
      });
    }
  },
);

export default router;