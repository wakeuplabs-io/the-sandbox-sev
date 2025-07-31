import { buildModule } from "@nomicfoundation/ignition-core";

const ExecutionVerifierModule = () =>
  buildModule("ExecutionVerifier", m => {
    const executionVerifier = m.contract("ExecutionVerifier", []);

    return { executionVerifier };
  }) as any;

export default ExecutionVerifierModule;
