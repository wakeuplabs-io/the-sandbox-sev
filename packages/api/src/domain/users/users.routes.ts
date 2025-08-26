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

const users = new Hono()
  .use("/*", authMiddleware)
  .get("/", getUsersController)
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
