/// <reference path="./packages/api/.sst/platform/config.d.ts" />

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
    console.error("\n\n==============================================");
    console.error("⛔️ Configuration Error");
    console.error("==============================================");
    console.error("Missing required values in sst.config.ts:");
    errors.forEach((err) => console.error(`  • ${err}`));
    console.error("\n❌ Deployment blocked until these values are set");
    console.error("==============================================\n\n");
    throw new Error("Configuration validation failed");
  }
}

export default $config({
  app(input) {
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

    validateConfig();

    const allowedOrigins = [
      API_URL,
      UI_URL,
      ...($app.stage !== "production"
        ? [
            "http://localhost:3000", // for local development
            "http://localhost:9999", // for API dev server
          ]
        : []),
    ];

    // Assets bucket and cloudfront distribution
    const assetsBucket = new sst.aws.Bucket("assets", {
      access: "public",
      cors: {
        allowOrigins: allowedOrigins,
        allowMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        allowHeaders: ["*"],
      },
    });

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

    // API Function
    const api = new sst.aws.Function(`${$app.stage}-${PROJECT_NAME}-api`, {
      handler: "packages/api/src/index.handler",
     // url: true,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? '',
        NODE_ENV: $app.stage,
        CORS_ORIGINS: allowedOrigins.join(","),
        PRIVATE_KEY: process.env.PRIVATE_KEY ?? '',
        RPC_URL: process.env.RPC_URL ?? '',
        EXECUTION_VERIFIER_ADDRESS: process.env.EXECUTION_VERIFIER_ADDRESS ?? '',
      },
      permissions: [
        {
          actions: ["s3:PutObject", "s3:PutObjectAcl", "s3:GetObject", "s3:ListBucket"],
          resources: [$interpolate`${assetsBucket.arn}/*`],
        },
      ],
      copyFiles: [
        {
          from: "node_modules/.prisma/client/",
          to: ".prisma/client/",
        },
        {
          from: "node_modules/@prisma/client/",
          to: "@prisma/client/",
        },
        {
          from: "packages/api/src/generated/prisma/",
          to: "src/generated/prisma/",
        },
      ],
    });

    // API Gateway with custom domain
    const apiGateway = new sst.aws.ApiGatewayV2(`${$app.stage}-${PROJECT_NAME}-gateway`, {
      domain: API_DOMAIN_URL,
      cors: {
        allowOrigins: allowedOrigins,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders: ["*"],
        allowCredentials: true,
        maxAge: 86400,
      },
    });

    console.log("allowedOrigins", allowedOrigins);
    // Add routes to connect API Gateway to the function
    apiGateway.route("ANY /{proxy+}", api.arn);
    apiGateway.route("ANY /", api.arn);
    
    // Ensure OPTIONS requests are handled for CORS preflight
    apiGateway.route("OPTIONS /{proxy+}", api.arn);
    apiGateway.route("OPTIONS /", api.arn);

    // UI Static Site
     // --> UI deployment
     const domainRoot = UI_DOMAIN_URL.replace(/^https?:\/\/(www\.)?/, "");
     const domainAlias = UI_DOMAIN_URL.replace(/^https?:\/\//, "");

    const ui = new sst.aws.StaticSite(`${PROJECT_NAME}-ui`, {
      path: "packages/ui",
      domain: {
        name: domainRoot,
        aliases: domainAlias !== domainRoot ? [domainAlias] : [],
      },
      build: {
        command: "npm run build",
        output: "dist",
      },
      environment: {
        VITE_API_URL: API_URL,
        VITE_WEB3AUTH_CLIENT_ID: process.env.VITE_WEB3AUTH_CLIENT_ID ?? '',
        NODE_ENV: $app.stage === "production" ? "production" : $app.stage === "staging" ? "staging" : "development",
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
          {
            files: ["**/*.ttf", "**/*.woff", "**/*.woff2"],
            cacheControl: "max-age=31536000,public,immutable",
          },
        ],
      },
      indexPage: "index.html",
      errorPage: "index.html",
      // Configure SPA routing - redirect all routes to index.html
      redirects: [
        {
          from: "/*",
          to: "/index.html",
          status: "200",
        },
      ],
      edge: {
        viewerResponse: {
          injection: `
              event.response.headers["content-security-policy"] = {value: "default-src 'self' wss://*.crisp.chat wss://*.web3auth.io wss://*.tor.us https://*.web3auth.io https://*.tor.us https://*.crisp.chat https://*.sentry.io https://fonts.googleapis.com https://fonts.gstatic.com https://*.googletagmanager.com https://*.google-analytics.com https://accounts.google.com https://*.doubleclick.net https://hcaptcha.com https://*.hcaptcha.com; script-src 'self' 'unsafe-inline' https://cmp.osano.com https://www.googletagmanager.com https://browser.sentry-cdn.com https://js.sentry-cdn.com https://accounts.google.com https://*.doubleclick.net https://hcaptcha.com https://*.hcaptcha.com https://*.getmati.com blob:; style-src 'self' 'unsafe-inline' https://client.crisp.chat https://fonts.googleapis.com https://accounts.google.com https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' * data: https://*.web3auth.io https://*.tor.us https://*.crisp.chat; frame-src 'self' https://*.getmati.com https://*.web3auth.io https://*.hcaptcha.com; object-src 'none'; connect-src 'self' * https://hcaptcha.com https://*.hcaptcha.com;"};
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
      api: apiGateway.url,
      ui: ui.url,
      assets: ASSETS_URL,
      assetsBucket: assetsBucket.name,
    };
  },
});
