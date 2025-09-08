import { useWeb3Auth } from "@/context/web3auth";
import { ETHERSCAN_BY_CHAIN_ID } from "../constants";
import { truncateHash } from "../lib/utils";

export const EtherScanLink = ({ txHash }: { txHash: string }) => {
  const { chain } = useWeb3Auth();
  const etherscanUrl = ETHERSCAN_BY_CHAIN_ID[chain.id];
  return (
    <a href={`${etherscanUrl}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" >
      <span className="underline tooltip tooltip-left" data-tip={"Unique ID of a blockchain transaction. Lets you track the actual execution on-chain."}>
        {truncateHash(txHash)}
      </span>
    </a>
  );
};
