/// <reference path="./.sst/platform/config.d.ts" />

// Project configuration constants
const PROJECT_NAME: string = "sev"; // Must be set by developer, must only contain alphanumeric characters and hyphens
const CUSTOMER: string = "sandbox"; // Must be set by developer, must only contain alphanumeric characters and hyphens

// Validation function for project configuration
function validateConfig() {
  const errors: string[] = [];

  if (!PROJECT_NAME || PROJECT_NAME.trim() === "") {
    errors.push("PROJECT_NAME must be set (e.g., 'testing-monorepo-1')");
  }

  if (!CUSTOMER || CUSTOMER.trim() === "") {
    errors.push("CUSTOMER must be set (e.g., 'testing')");
  }


  if (errors.length > 0) {
    // Print error directly to console
    console.error("\n\n==============================================");
    console.error("⛔️ Configuration Error");
    console.error("==============================================");
    console.error("Missing required values in sst.config.ts:");
    errors.forEach((err) => console.error(`  • ${err}`));
    console.error("\n❌ Deployment blocked until these values are set");
    console.error("==============================================\n\n");

    // Also throw error for SST to catch
    throw new Error("Configuration validation failed");
  }
}

export default $config({
  app(input) {
    // Validate configuration before proceeding
    validateConfig();

    return {
      name: PROJECT_NAME,
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          defaultTags: {
            tags: { customer: CUSTOMER, stage: input.stage },
          },
        },
      },
    };
  },
  async run() {

    const stageSuffix =
    $app.stage === "production" ? "" : $app.stage === "staging" ? "-staging" : "-dev";
    const UI_DOMAIN_URL = `${PROJECT_NAME}${stageSuffix}.wakeuplabs.link`;
    const UI_URL = `https://${UI_DOMAIN_URL}`;
    // Validate configuration again in case run() is called directly
    validateConfig();

    // -> UI
    // Simplified domain configuration to avoid CNAME conflicts
    const domainName = UI_DOMAIN_URL;

    const ui = new sst.aws.StaticSite(`${PROJECT_NAME}-ui`, {
      path: "",
      domain: {
        name: domainName,
      },
      build: {
        command: "npm run build",
        output: "dist",
      },
      environment: {
        VITE_API_URL: "",
      },
      assets: {
        textEncoding: 'utf-8',
        fileOptions: [
          {
            files: ['**/*.css', '**/*.js'],
            cacheControl: 'max-age=31536000,public,immutable',
          },
          {
            files: '**/*.html',
            cacheControl: 'max-age=0,no-cache,no-store,must-revalidate',
          },
          {
            files: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
            cacheControl: 'max-age=31536000,public,immutable',
          },
        ],
      },
      indexPage: "index.html",
      errorPage: "index.html",
      edge: {
        viewerResponse: {
          injection: `
              event.response.headers["content-security-policy"] = {value: "default-src 'self' wss://*.crisp.chat wss://*.web3auth.io wss://*.tor.us https://*.web3auth.io https://*.tor.us https://*.crisp.chat https://*.sentry.io https://fonts.googleapis.com https://fonts.gstatic.com https://*.googletagmanager.com https://*.google-analytics.com https://accounts.google.com https://*.doubleclick.net https://hcaptcha.com https://*.hcaptcha.com; script-src 'self' 'unsafe-inline' https://cmp.osano.com https://www.googletagmanager.com https://browser.sentry-cdn.com https://js.sentry-cdn.com https://accounts.google.com https://*.doubleclick.net https://hcaptcha.com https://*.hcaptcha.com https://*.getmati.com blob:; style-src 'self' 'unsafe-inline' https://client.crisp.chat https://fonts.googleapis.com https://accounts.google.com https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' * data: https://*.web3auth.io https://*.tor.us https://*.crisp.chat; frame-src 'self' https://*.getmati.com https://*.web3auth.io; object-src 'none'; connect-src 'self' * https://hcaptcha.com https://*.hcaptcha.com;"};
              event.response.headers["referrer-policy"] = {value: "no-referrer"};
              event.response.headers["access-control-allow-origin"] = {value: "*"};
              event.response.headers["access-control-allow-methods"] = {value: "GET, HEAD, OPTIONS"};
              event.response.headers["access-control-allow-headers"] = {value: "*"};
              event.response.headers["access-control-expose-headers"] = {value: "ETag"};
            `,
        },
      },
    });

    return {
      ui: ui.url,
    };
  },
});
