/**
 * @fileoverview Index route configuration for the API
 * Defines the root endpoint that provides basic API information.
 *
 * @module routes/index
 */

import { createRouter } from "../lib/create-app";

/**
 * Index route configuration and handler
 * @description Creates a GET endpoint at the root path that returns API information
 */
const router = createRouter();

router.get("/", (c) => {
  return c.json({
    message: "hono-api-template",
  });
});

/**
 * Health check endpoint
 * @description Returns API health status for monitoring and load balancer checks
 */
router.get("/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
