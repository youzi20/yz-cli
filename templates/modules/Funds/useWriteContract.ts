import { usePublicClient, useWriteContract as useWagmiWriteContract } from "wagmi";

import type { Abi } from "viem";
import type { Config } from "wagmi";
import type { WriteContractVariables } from "wagmi/query";

const useWriteContract = (
  parameters: WriteContractVariables<Abi, string, readonly unknown[], Config, Config["chains"][number]["id"]>,
) => {
  const publicClient = usePublicClient();
  const { writeContractAsync, ...other } = useWagmiWriteContract();

  const trigger = async () => {
    const hash = await writeContractAsync(parameters);

    const response = await publicClient?.waitForTransactionReceipt({ hash });

    return response?.status === "success";
  };

  return { trigger, ...other };
};

export default useWriteContract;
