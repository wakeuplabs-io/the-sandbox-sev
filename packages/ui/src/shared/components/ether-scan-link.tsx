import { useWeb3Auth } from "@/context/web3auth";
import { ETHERSCAN_BY_CHAIN_ID } from "../constants";
import { truncateHash } from "../lib/utils";

export const EtherScanLink = ({ txHash }: { txHash: string }) => {
  const { chain } = useWeb3Auth();
  const etherscanUrl = ETHERSCAN_BY_CHAIN_ID[chain.id];
  return (
    <a href={`${etherscanUrl}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" >
      <span className="tooltip underline tooltip-info" data-tip={txHash}>
        {truncateHash(txHash)}
      </span>
    </a>
  );
};
