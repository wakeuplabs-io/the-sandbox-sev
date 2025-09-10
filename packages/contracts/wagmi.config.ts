import { Abi } from "viem";
import { defineConfig } from "@wagmi/cli";

import executionVerifier from "./artifacts/contracts/execution-verifier/contract.sol/ExecutionVerifier.json";

export default defineConfig({
  out: "./shared/abis/index.ts",
  contracts: [
    {
      name: "executionVerifier",
      abi: executionVerifier.abi as Abi,
    },
  ],
});
