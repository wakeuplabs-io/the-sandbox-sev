import { Context } from "hono";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { BulkRoleAssignmentSchema, RoleStatusQuerySchema } from "./roles.schema";
import {
  assignRoles,
} from "./roles.service";

export const assignRolesController = async (c: Context) => {
  try {
    const body = await c.req.json();
    const validatedData = BulkRoleAssignmentSchema.parse(body);
    
    const result = await assignRoles(validatedData);
    
    return c.json({
      success: true,
      data: result
    }, HttpStatusCodes.OK);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({
        success: false,
        error: error.message
      }, HttpStatusCodes.BAD_REQUEST);
    }
    return c.json({
      success: false,
      error: "Internal server error"
    }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};