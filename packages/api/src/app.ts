/**
 * @fileoverview Main configuration for the Hono API application
 * This file configures and exports the main Hono application instance,
 * including CORS middleware and routing.
 *
 * @module app
 */

import createApp from "./lib/create-app";
import env from "./env";
import { cors } from "hono/cors";
import users from "./domain/users/users.routes";
import tasks from "./domain/tasks/tasks.routes";

/**
 * Array of available API routes
 * Each route is a Hono instance with its own definitions
 * @type {Array<import('./lib/types').App>}
 */

/**
 * Registers all routes under the '/api' prefix
 * This ensures all endpoints are under the /api namespace
 */
const routes = createApp()
  .use(
    "/*",
    cors({
      origin: env.CORS_ORIGINS.split(",").map(origin => origin.trim()),
      credentials: true,
    })
  )
  .basePath("/api")
  .route("/users", users)
  .route("/tasks", tasks)


/**
 * Exported type that represents the API route structure
 * Useful for client-side typing
 */
export type AppType = typeof routes;

export default routes;
