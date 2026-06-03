import express from "express";

import prisma from "../utils/prisma";

import {
  protect,
  AuthRequest,
} from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);

router.get(
  "/lead/:leadId",
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const { leadId } =
        req.params;

      const tasks =
        await prisma.task.findMany({
          where: {
            leadId,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(tasks);
    } catch {
      res.status(500).json({
        message:
          "Failed to fetch tasks",
      });
    }
  },
);

router.post(
  "/",
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const {
        title,
        dueDate,
        leadId,
      } = req.body;

      if (!title.trim()) {
        return res
          .status(400)
          .json({
            message:
              "Task title is required",
          });
      }

      const task =
        await prisma.task.create({
          data: {
            title,

            dueDate: dueDate
              ? new Date(
                  dueDate,
                )
              : null,

            leadId,
          },
        });

      res.status(201).json(task);
    } catch {
      res.status(500).json({
        message:
          "Failed to create task",
      });
    }
  },
);

router.put(
  "/:id",
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const { id } =
        req.params;

      const {
        completed,
      } = req.body;

      const updatedTask =
        await prisma.task.update({
          where: {
            id,
          },

          data: {
            completed,
          },
        });

      res.json(updatedTask);
    } catch {
      res.status(500).json({
        message:
          "Failed to update task",
      });
    }
  },
);

router.delete(
  "/:id",
  async (
    req: AuthRequest,
    res,
  ) => {
    try {
      const { id } =
        req.params;

      await prisma.task.delete({
        where: {
          id,
        },
      });

      res.json({
        message:
          "Task deleted successfully",
      });
    } catch {
      res.status(500).json({
        message:
          "Failed to delete task",
      });
    }
  },
);

export default router;