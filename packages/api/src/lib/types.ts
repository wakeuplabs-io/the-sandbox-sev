/* eslint-disable @typescript-eslint/ban-types */
import type { Hono, Handler } from "hono";
import type { PinoLogger } from "hono-pino";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
  };
}

export type App = Hono<AppBindings>;

export type AppHandler = Handler<AppBindings>;
