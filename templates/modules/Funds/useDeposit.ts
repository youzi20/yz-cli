import { useMemo } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";

import { useErc20Decimals, useErc20Balance, useErc20Allowance, useErc20Approve } from "./useErc20";

const DEPOSIT_CONTRACT_ADDRESS = "0x5a86795b8f90c62284a5A6262aB8B104427F7156";

const useReceiveTokenPayment = (token: `0x${string}`, amount: bigint) => {
  const { writeContractAsync, ...other } = useWriteContract();

  const receiveTokenPayment = () =>
    writeContractAsync({
      address: DEPOSIT_CONTRACT_ADDRESS,
      abi: [
        {
          type: "function",
          name: "receiveTokenPayment",
          stateMutability: "nonpayable",
          inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          outputs: [],
        },
      ],
      functionName: "receiveTokenPayment",
      args: [token, amount],
    });

  return { receiveTokenPayment, ...other };
};

export const useDeposit = (address: `0x${string}`, inputAmount: string) => {
  const { address: accountAddress } = useAccount();

  const { data: decimals } = useErc20Decimals(address);
  const { data: balance } = useErc20Balance(address, accountAddress);
  const { data: allowance } = useErc20Allowance(address, DEPOSIT_CONTRACT_ADDRESS, accountAddress);

  const { amount, ...formatted } = useMemo(() => {
    const amount = parseUnits(inputAmount, decimals ?? 0);

    if (decimals === undefined || balance === undefined || allowance === undefined) return { amount };

    return {
      amount,
      balance: formatUnits(balance, decimals),
      allowance: formatUnits(allowance, decimals),
    };
  }, [decimals, balance, allowance, inputAmount]);

  const { approve } = useErc20Approve(address, DEPOSIT_CONTRACT_ADDRESS, amount);
  const { receiveTokenPayment } = useReceiveTokenPayment(address, amount);

  return { ...formatted, approve, receiveTokenPayment };
};

export default useDeposit;
