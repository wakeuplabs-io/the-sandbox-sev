/**
 * @fileoverview Example route module entry point
 * Combines the route configuration and handler into a single router.
 *
 * @module routes/example
 */

import { createRouter } from "../../lib/create-app";
import * as handler from "./example.handler";
import * as routes from "./example.routes";

/**
 * Configured example router
 * @description Creates the example route with its handler
 * @type {import('../../lib/types').App}
 */
const router = createRouter();

router.get(routes.EXAMPLE_PATHS.EXAMPLE, handler.exampleHandler);

export default router;
