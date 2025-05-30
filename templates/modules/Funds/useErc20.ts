import { useReadContract } from "wagmi";

import useWriteContract from "./useWriteContract";

export const useErc20Decimals = (address: `0x${string}`) => {
  return useReadContract({
    address,
    abi: [
      {
        type: "function",
        name: "decimals",
        stateMutability: "view",
        inputs: [],
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      },
    ],
    functionName: "decimals",
  });
};

export const useErc20Balance = (address: `0x${string}`, account?: `0x${string}`) => {
  return useReadContract({
    address,
    abi: [
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
    ],
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  });
};

export const useErc20Allowance = (address: `0x${string}`, spender: `0x${string}`, account?: `0x${string}`) => {
  return useReadContract({
    address,
    abi: [
      {
        type: "function",
        name: "allowance",
        stateMutability: "view",
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      },
    ],
    functionName: "allowance",
    args: account ? [account, spender] : undefined,
    query: { enabled: !!account },
  });
};

export const useErc20Approve = (address: `0x${string}`, spender: `0x${string}`, amount: bigint) => {
  return useWriteContract({
    address,
    abi: [
      {
        type: "function",
        name: "approve",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
      },
    ],
    functionName: "approve",
    args: [spender, amount],
  });
};
