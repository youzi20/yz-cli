import { useCallback } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";

import { useAuthFetcher } from "@/hooks/api/useFetcher";

interface WithdrawParams {
  assetId: string;
  amount: string;
}

interface WithdrawResponse {
  v: number;
  r: `0x${string}`;
  s: `0x${string}`;
  amount: number;
  nonce: number;
  deadline: number;
  token: string;
  recordId: number;
  walletAddress: `0x${string}`;
  claimContract: `0x${string}`;
}

const useWithdrawSignature = () => {
  const fetchWithdraw = useAuthFetcher<WithdrawResponse>();

  return useCallback(
    (params: WithdrawParams) => fetchWithdraw("/asset/withdraw", { method: "POST", rawJson: params }),
    [fetchWithdraw],
  );
};

const useClaim = (token: `0x${string}`, inputAmount: string) => {
  const publicClient = usePublicClient();
  const { writeContractAsync, ...other } = useWriteContract();

  const withdrawSignature = useWithdrawSignature();

  const claim = async () => {
    const signature = await withdrawSignature({ assetId: "1", amount: inputAmount });

    if (!signature) return;
    const { v, r, s, nonce, amount, deadline, recordId, walletAddress, claimContract } = signature;

    const hash = await writeContractAsync({
      address: claimContract,
      abi: [
        {
          type: "function",
          name: "claim",
          stateMutability: "nonpayable",
          inputs: [
            {
              components: [
                { internalType: "address", name: "erc20Token", type: "address" },
                { internalType: "address", name: "to", type: "address" },
                { internalType: "uint256", name: "amount", type: "uint256" },
                { internalType: "uint256", name: "nonce", type: "uint256" },
                { internalType: "uint256", name: "deadline", type: "uint256" },
                { internalType: "uint256", name: "recordId", type: "uint256" },
              ],
              internalType: "struct EVMAirdrop.ClaimParams",
              name: "params",
              type: "tuple",
            },
            {
              internalType: "uint8[]",
              name: "v",
              type: "uint8[]",
            },
            {
              internalType: "bytes32[]",
              name: "r",
              type: "bytes32[]",
            },
            {
              internalType: "bytes32[]",
              name: "s",
              type: "bytes32[]",
            },
          ],
          outputs: [],
        },
      ],
      functionName: "claim",
      args: [
        {
          erc20Token: token,
          to: walletAddress,
          amount: BigInt(amount),
          nonce: BigInt(nonce),
          deadline: BigInt(deadline),
          recordId: BigInt(recordId),
        },
        [v],
        [r],
        [s],
      ],
    });

    const response = await publicClient?.waitForTransactionReceipt({ hash });

    return response?.status === "success";
  };

  return { claim, ...other };
};

export const useWithdraw = (address: `0x${string}`, amount: string) => {
  const { address: accountAddress } = useAccount();
  const { claim } = useClaim(address, amount);

  return { accountAddress, balance: "1231", claim };
};

export default useWithdraw;
