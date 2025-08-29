import { authMiddleware } from "@/middlewares/auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { isAddress } from "viem";
import { z } from "zod";
import {
  createUserController,
  getUserController,
  getUsersController,
} from "./users.controller";
import { CreateUserSchema } from "./users.schema";
import {
  assignRolesController,
} from "./roles.controller";
import { requireRole } from "../../middlewares/require-role";
import { Role } from "@/generated/prisma";

const { ADMIN, CONSULTANT } = Role

const GetUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

const users = new Hono()
  .use("/*", authMiddleware)
  .get("/", zValidator("query", GetUsersQuerySchema), getUsersController)
  .post("/roles/assign", requireRole([ADMIN]), assignRolesController)  
  .get(
    "/:address",
    zValidator(
      "param",
      z.object({
        address: z.string().refine(isAddress, { message: "Invalid address" }),
      })
    ),
    getUserController
  )
  .post("/", zValidator("json", CreateUserSchema), createUserController)

export default users;
