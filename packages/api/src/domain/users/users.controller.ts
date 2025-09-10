import { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createUser, getOrCreateUser, getUserByNickname, getUsers, updateUser } from "./users.service";
import { User } from "@/generated/prisma";

export const getUsersController = async (c: Context) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;
  
  const response = await getUsers(page, limit);
  
  return c.json(response, HttpStatusCodes.OK);
};

export const getUserController = async (c: Context) => {
  const { address } = c.req.param();
  const email = c.req.query("email");
  const user = await getOrCreateUser(address, email);
  if (!user) {
    return c.json({ message: "Not found" }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(user, HttpStatusCodes.OK);
};

export const createUserController = async (c: Context) => {
  const { address, email } = await c.req.json();
  try {
    const user = await createUser({ address, email });
    return c.json(user, HttpStatusCodes.CREATED);
  } catch (e) {
    // 422 Unprocessable Entity, matching OpenAPI contract
    return c.json(
      {
        error: {
          issues: [
            {
              code: "invalid_input",
              path: ["address"],
              message: "Invalid address",
            },
          ],
          name: "ValidationError",
        },
        success: false,
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
};

export const updateUserController = async (c: Context) => {
  const user = c.get("user") as User;
  const { nickname } = await c.req.json();
  const updatedUser = await updateUser(Number(user.id), { nickname });
  return c.json(updatedUser, HttpStatusCodes.OK);
};

export const getUserByNicknameController = async (c: Context) => {
  const { nickname } = c.req.param();
  const user = await getUserByNickname(nickname);
  if (!user) {
    return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
  }
  return c.json(user, HttpStatusCodes.OK);
};