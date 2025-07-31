/**
 * @fileoverview Example route handler implementation
 * Contains the business logic for the example endpoint.
 *
 * @module routes/example/handler
 */

import { AppHandler } from "../../lib/types";

/**
 * Example endpoint handler
 * @type {AppHandler}
 * @description Handles GET requests to the /example endpoint
 *
 * @param {import('hono').Context} c - The Hono context object
 * @returns {Promise<Response>} JSON response with example message
 */
export const exampleHandler: AppHandler = async (c) => {
  return c.json({
    message: "Api Hono Example route",
  });
};
