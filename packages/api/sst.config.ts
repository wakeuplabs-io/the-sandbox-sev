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
    const API_DOMAIN_URL = `api.${PROJECT_NAME}${stageSuffix}.wakeuplabs.link`;
    const API_URL = `https://${API_DOMAIN_URL}`;

    const UI_DOMAIN_URL = `${PROJECT_NAME}${stageSuffix}.wakeuplabs.link`;
    const UI_URL = `https://${UI_DOMAIN_URL}`;
    
    const ASSETS_DOMAIN_URL = `assets.${UI_DOMAIN_URL}`;
    const ASSETS_URL = `https://${ASSETS_DOMAIN_URL}`;

    // Validate configuration again in case run() is called directly
    validateConfig();

    const allowedOrigins = [
      API_URL,
      ...($app.stage !== "production"
        ? [
            "http://localhost:3000", // for local development
            "http://localhost:9999", // for API dev server
          ]
        : []),
    ];


    // --> Assets bucket and cloudfront distribution

    const assetsBucket = new sst.aws.Bucket("assets", {
      access: "public",
      cors: {
        allowOrigins: allowedOrigins,
        allowMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        allowHeaders: ["*"],
      },
    });

    //SST Router wouldn't create cloudfront, so using this instead
    new sst.aws.Cdn("assets-cdn", {
      domain: ASSETS_DOMAIN_URL,
      origins: [
        {
          domainName: $interpolate`${assetsBucket.domain}`,
          originId: "assetsBucket",
        },
      ],
      defaultCacheBehavior: {
        targetOriginId: "assetsBucket",
        viewerProtocolPolicy: "redirect-to-https",
        compress: true,
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD"],
        maxTtl: 2592000,
        forwardedValues: {
          queryString: false,
          cookies: { forward: "none" },
        },
      },
    });

    // -> API Function
    const api = new sst.aws.Function(`${$app.stage}-${PROJECT_NAME}-api`, {
      handler: "src/index.handler",
      url: true,
      environment: {
        DB_URL: process.env.DB_URL ?? '',
      },
    });

    // deploy API Gateway with custom domain
    const apiGateway = new sst.aws.ApiGatewayV2(`${$app.stage}-${PROJECT_NAME}-gateway`, {
      domain: API_DOMAIN_URL,
      cors: {
        allowOrigins: allowedOrigins,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders: ["*"],
      },
    });


    apiGateway.route('$default', api.arn);

    return {
      api: apiGateway.url,
    };
  },
});
