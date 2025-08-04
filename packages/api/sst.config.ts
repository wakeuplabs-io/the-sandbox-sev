/// <reference path="./.sst/platform/config.d.ts" />

// Project configuration constants
const PROJECT_NAME: string = "sev"; // Must be set by developer, must only contain alphanumeric characters and hyphens
const CUSTOMER: string = "sandbox"; // Must be set by developer, must only contain alphanumeric characters and hyphens

// We can alternate between regions to create the VPC in a different region, take in mind that we can only use one region per VPC
// in case we want to use N.virginia we can use the secret SST_AWS_REGION_ALT
const AWS_REGION = `${process.env.SST_AWS_REGION}`;
const AVAILABILITY_ZONES = [`${AWS_REGION}a`, `${AWS_REGION}b`];

const GOOGLE_CLIENT_ID = `${process.env.GOOGLE_CLIENT_ID}`
const GOOGLE_CLIENT_SECRET = `${process.env.GOOGLE_CLIENT_SECRET}`

// Validation function for project configuration
function validateConfig() {
  const errors: string[] = [];

  if (!PROJECT_NAME || PROJECT_NAME.trim() === "") {
    errors.push("PROJECT_NAME must be set (e.g., 'testing-monorepo-1')");
  }

  if (!CUSTOMER || CUSTOMER.trim() === "") {
    errors.push("CUSTOMER must be set (e.g., 'testing')");
  }

  if (!GOOGLE_CLIENT_ID || CUSTOMER.trim() === "")
    errors.push("GOOGLE_CLIENT_ID must be set (e.g., '123456789012-1a23b56c7defghi89012jklmnopqrs3t.apps.googleusercontent.com'");
  if (!GOOGLE_CLIENT_SECRET || CUSTOMER.trim() === "")
    errors.push("GOOGLE_CLIENT_SECRET must be set (e.g., 'ABCDEF-GHIJ1kHIjklMnopqrstuvwx2YzAB'");

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
    // Validate configuration again in case run() is called directly
    validateConfig();
    const IS_PRODUCTION = $app.stage === 'production'

    const allowedOrigins = [
      API_URL,
      ...($app.stage !== "production"
        ? [
            "http://localhost:3000", // for local development
            "http://localhost:9999", // for API dev server
          ]
        : []),
    ];

    // -> API Function
    const api = new sst.aws.Function(`${$app.stage}-${PROJECT_NAME}-api`, {
      handler: "src/index.handler",
      url: true,
      environment: {
        DB_URL: process.env.DB_URL ?? '',
      },
    });
    // API Function <-

   

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
    // Lambda API <-

    /**
     * Example: Setting up Custom Domains with SST
     *
     * Below is an example of how to configure custom domains for different AWS services:
     *
     * 1. ECS Service with API Gateway:
     * - Creates an ECS service with service discovery
     * - Exposes it through API Gateway with a custom domain
     * - Useful for containerized applications that need a custom domain
     *
     * You can use this as a reference and modify/remove as needed.
     * @see https://sst.dev/docs/component/aws/service
     */
    // const service = new sst.aws.Service("MyService", {
    //   cluster,
    // Configure service discovery for ECS
    //   serviceRegistry: {
    //     port: 80
    //   }
    // });

    // Set up API Gateway with custom domain
    // const apiGateway = new sst.aws.ApiGatewayV2("MyApi", {
    //   domain: {
    //     // Example: Using stage in domain name for different environments
    //     name: `${$app.stage}-${PROJECT_NAME}-api.wakeuplabs.link`,
    //     // Optional: You can also specify hostedZone if domain is in Route53
    //     // hostedZone: "your-domain.com"
    //   },
    // });
    // Route all traffic to the ECS service
    // apiGateway.routePrivate("$default", service.nodes.cloudmapService.arn);

    // If we have production, it's URL usually is https://my-app.xyz/
    // Staging's URL usually is https://my-app.wakeuplabs.link/
    // production uses root domain and staging a subdomain
    // this is considered in the StaticSite domain parameter 
    // EC2 API <-


    return {
      api: apiGateway.url,
    };
  },
});
