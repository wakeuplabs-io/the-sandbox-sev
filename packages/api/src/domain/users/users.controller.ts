import { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createUser, getOrCreateUser, getUsers } from "./users.service";

export const getUsersController = async (c: Context) => {
  const users = await getUsers();
  return c.json(users, HttpStatusCodes.OK);
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