import { authMiddleware } from "@/middlewares/auth";
import { requireRole } from "@/middlewares/require-role";
import { Hono } from "hono";
import { getWalletBalanceController } from "./wallet.controller";
import { Role } from "@/generated/prisma";

const wallet = new Hono().get(
  "/balance",
  authMiddleware,
  requireRole([Role.ADMIN, Role.CONSULTANT]),
  getWalletBalanceController
);

export default wallet;
