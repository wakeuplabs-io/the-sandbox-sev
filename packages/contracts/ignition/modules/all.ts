import { buildModule } from "@nomicfoundation/ignition-core";
import ExecutionVerifierModule from "./ExecutionVerifier";

const AllModules = buildModule("AllModules", m => {
  // Deploy ExecutionVerifier
  const executionVerifier = m.useModule(ExecutionVerifierModule);

  return {
    executionVerifier,
  };
});

export default AllModules;
