/**
 * @fileoverview Factory functions for creating Hono application instances
 * This file provides utilities for creating and configuring Hono applications
 * with middleware and error handling.
 *
 * @module lib/create-app
 */

import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { pinoLogger } from "../middlewares/pino-logger";

import type { AppBindings, App } from "./types";

/**
 * Creates a new Hono router instance with default configurations
 * @returns {App} A configured Hono router instance
 * @description
 * Creates a new router with:
 * - Custom AppBindings for type safety
 * - Strict mode disabled
 */
export function createRouter() {
  return new Hono<AppBindings>({
    strict: false,
  });
}

/**
 * Creates and configures the main application instance with all necessary middleware
 * @returns {App} A fully configured Hono application instance
 * @description
 * Sets up an application with:
 * - Request ID tracking
 * - Pino logging middleware
 * - Custom 404 handler
 * - Global error handler
 */
export default function createApp() {
  const app = createRouter();
  app.use(requestId()).use(pinoLogger());

  app.notFound((c) => {
    return c.json({ error: "Not Found" }, 404);
  });
  
  app.onError((err, c) => {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  });
  
  return app;
}

/**
 * Creates a test application instance with a specific router
 * @param {App} router - The router to attach to the test application
 * @returns {App} A configured test application instance
 * @description
 * Useful for testing routes in isolation. Creates a minimal application
 * with the provided router mounted at the root path.
 */
export function createTestApp(router: App) {
  return createApp().route("/", router);
}
