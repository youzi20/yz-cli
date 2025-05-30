import { useMemo } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatEther, formatUnits, parseUnits } from "viem";

import useWriteContract from "./useWriteContract";

const STAKE_CONTRACT_ADDRESS = "0x2AaDbfd9d71758fb7E804EDC41fb46E551B3AFD0";

export const STAKE_OPTIONS = [
  { label: "Flexible", value: { index: 0, apr: 0.01, days: 2, pointRate: 0.01 } },
  { label: "14 Days", value: { index: 1, apr: 0.0182, days: 14, pointRate: 0.08 } },
  { label: "30 Days", value: { index: 2, apr: 0.0261, days: 30, pointRate: 0.18 } },
  { label: "90 Days", value: { index: 3, apr: 0.0617, days: 90, pointRate: 0.5 } },
  { label: "180 Days", value: { index: 4, apr: 0.1092, days: 180, pointRate: 1 } },
  { label: "180 Days", value: { index: 5, apr: 0.1092, days: 180, pointRate: 1 } },
];

const useStake = (stakeType: bigint, amount: bigint) => {
  return useWriteContract({
    address: STAKE_CONTRACT_ADDRESS,
    abi: [
      {
        type: "function",
        name: "stake",
        stateMutability: "payable",
        inputs: [{ internalType: "uint256", name: "stakeType", type: "uint256" }],
        outputs: [],
      },
    ],
    functionName: "stake",
    args: [stakeType],
    value: amount,
  });
};

export const useClaimProfit = (ith: number) => {
  return useWriteContract({
    address: STAKE_CONTRACT_ADDRESS,
    abi: [
      {
        type: "function",
        name: "claimProfit",
        stateMutability: "nonpayable",
        inputs: [{ internalType: "uint256", name: "ith", type: "uint256" }],
        outputs: [],
      },
    ],
    functionName: "claimProfit",
    args: [ith],
  });
};

export const useExit = (ith: number) => {
  return useWriteContract({
    address: STAKE_CONTRACT_ADDRESS,
    abi: [
      {
        type: "function",
        name: "exit",
        stateMutability: "nonpayable",
        inputs: [{ internalType: "uint256", name: "ith", type: "uint256" }],
        outputs: [],
      },
    ],
    functionName: "exit",
    args: [ith],
  });
};

const useNativeStakeData = (account?: `0x${string}`) => {
  return useReadContract({
    address: STAKE_CONTRACT_ADDRESS,
    abi: [
      {
        type: "function",
        name: "getStakeData",
        stateMutability: "view",
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      },
    ],
    functionName: "getStakeData",
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  });
};

export interface StakeInfo {
  apr: number;
  endTime: number;
  ith: number;
  reward: number;
  stakeAmount: number;
  stakeType: string;
  startTime: number;
  isExit: boolean;
  isEnd: boolean;
}

export const useNativeStakeList = () => {
  const { address } = useAccount();
  const { data: rawData } = useNativeStakeData(address);

  const stakeList = useMemo(() => {
    let result: StakeInfo[] = [];

    if (!rawData) return result;

    let total = 0;
    for (let i = 0; i < rawData.length; ) {
      const startTime = Number(rawData[i++]) * 1000;
      const stakeAmount = Number(formatEther(rawData[i++]));
      const stakeType = rawData[i++].toString();
      const isExit = Number(rawData[i++]) === 1;
      const endTime = Number(rawData[i++]) * 1000;
      const apr = Number(rawData[i++]) / 100;
      const reward = Number(formatEther(rawData[i++]));
      const isEnd = Date.now() - endTime >= 0;

      result.push({ ith: result.length, startTime, stakeAmount, stakeType, endTime, apr, reward, isExit, isEnd });

      if (!isExit) total = total + stakeAmount;
    }

    // result.filter((item) => !item.isExit)

    return result;
  }, [rawData]);

  return { stakeList, isEmpty: stakeList.length === 0 };
};

export const useNativeStake = (stakeType: number, inputAmount: string) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  const { amount, ...formatted } = useMemo(() => {
    if (!balance) return { amount: BigInt(0) };

    return { amount: parseUnits(inputAmount, balance.decimals), balance: formatUnits(balance.value, balance.decimals) };
  }, [balance, inputAmount]);

  const { trigger: stake } = useStake(BigInt(stakeType), amount);

  return { stake, ...formatted };
};

export default useNativeStake;
