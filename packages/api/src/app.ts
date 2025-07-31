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
import index from "./domain/index.route";
import example from "./domain/example/example.index";

/**
 * Main Hono application instance
 * Created using the createApp factory function that configures Hono with custom bindings
 * @type {import('./lib/types').App}
 */
const app = createApp();

/**
 * CORS middleware configuration
 * Allows requests from origins specified in the CORS_ORIGINS environment variable
 * Origins are specified as a comma-separated list
 * @example
 * // Example of CORS_ORIGINS in .env
 * CORS_ORIGINS=http://localhost:3000,https://example.com
 */
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGINS.split(",").map((origin) => origin.trim()),
    credentials: true,
  }),
);

/**
 * Array of available API routes
 * Each route is a Hono instance with its own definitions
 * @type {Array<import('./lib/types').App>}
 */
const routes = [index, example];

/**
 * Registers all routes under the '/api' prefix
 * This ensures all endpoints are under the /api namespace
 */
routes.forEach((route) => {
  app.route("/api", route);
});

/**
 * Defines the API base routes with their respective endpoints
 * - / : Index route that returns basic API information
 * - /example : Example route that demonstrates basic endpoint structure
 * @type {import('./lib/types').App}
 */
const apiRoutes = app.basePath("/api").route("/", index).route("/example", example);

/**
 * Exported type that represents the API route structure
 * Useful for client-side typing
 */
export type AppType = typeof apiRoutes;

export default app;
