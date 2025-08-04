/**
 * @fileoverview Index route configuration for the API
 * Defines the root endpoint that provides basic API information.
 *
 * @module routes/index
 */

import { createRouter } from "../lib/create-app";
import prisma from "../lib/prisma";

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
 * Includes database connectivity verification
 */
router.get("/health", async (c) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;
    
    return c.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: "connected",
        latency: `${dbLatency}ms`,
      },
    });
  } catch (error) {
    const dbLatency = Date.now() - startTime;
    
    return c.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: "disconnected",
        latency: `${dbLatency}ms`,
        error: error instanceof Error ? error.message : "Unknown database error",
      },
    }, 503);
  }
});

export default router;
