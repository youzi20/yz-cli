import { twMerge } from "tailwind-merge";

import { Loading, ArrowIcon, DoneIcon } from "@/components/Icon";

import Button, { ButtonType } from "@/components/Button";

import { TokenWrapper, TreasureIcon } from "@/sections/dapp/Token";

import { formatDelimiter } from "@/utils/formatNumber";

import { TaskInfo } from "./store";
import { useIsLoading, useProgress } from "./hooks";

export type TaskItemInfo = Omit<TaskInfo, "type" | "image"> & {
  image?: React.ReactNode;
  onClick?: () => void;
};

export function TaskReward(props: { reward?: string; value: string }) {
  const { reward, value } = props;

  return (
    <TokenWrapper
      icon={
        reward ? (
          <img className="w-[1.375rem]" src={reward} />
        ) : (
          <TreasureIcon className="w-[1.375rem]" />
        )
      }
    >
      <span className="font-DinPro font-bold">+{formatDelimiter(value, { isPad: false })}</span>
    </TokenWrapper>
  );
}

export function TaskButton(props: ButtonType) {
  return <Button size="small" colors="secondary" loadingClass="w-4" {...props} />;
}

export default function TaskBase(props: TaskItemInfo) {
  const { id, prevTaskId, image, content, rewardIcon, rewardAmount, isChild, onClick } = props;

  const [progress, prevProgress] = useProgress([id, prevTaskId]);
  const isLoading = useIsLoading(id);

  return (
    <div
      className={twMerge(
        "flex items-center justify-between gap-2 rounded-lg bg-black/20 p-3",
        isChild && "border-none py-1 pl-14",
        progress === 1 && "pointer-events-none",
        (isLoading || prevProgress !== 1) && "pointer-events-none opacity-50",
      )}
      onClick={onClick}
    >
      <div className={twMerge("h-10 w-10", isChild && "h-6 w-6")}>{image}</div>

      <div className="flex-1">
        <p className="mb-1 text-xs font-bold leading-none">{content}</p>
        <TaskReward reward={rewardIcon} value={rewardAmount} />
      </div>

      {isLoading ? (
        <Loading className="inline w-5" />
      ) : progress === 1 ? (
        <DoneIcon className="text-xl" />
      ) : (
        <ArrowIcon className="text-xs" />
      )}
    </div>
  );
}
