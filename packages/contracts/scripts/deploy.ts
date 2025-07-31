// scripts/deploy.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require("child_process");

// Obtener los parámetros desde la línea de comandos
const modulePath = process.env.MODULE_PATH || "./ignition/modules/deploy/executionVerifier.ts";
const network = process.env.NETWORK || "testnet";

// Ejecutar el comando de hardhat usando execSync
const command = `npx hardhat ignition deploy ${modulePath} --network ${network} --verify`;
console.log(`Running: ${command}`);

try {
  execSync(command, { stdio: "inherit" });
} catch (error) {
  console.error("Error deploying contracts:", error);
  process.exit(1);
}
