import Image from "next/image";
import { twMerge } from "tailwind-merge";

import { AssetsWrapper } from "@/components/Assets";

import { formatDelimiter } from "@/utils/formatNumber";

import { TaskSubgroupInfo, TaskInfo, useIsLoading, useProgress } from "./store";
import { useHandleTask } from "./hooks";

import ImgX from "./images/socialX.svg";
import ImgTelegram from "./images/socialTelegram.svg";

const renderSocialX = (image?: string | null) =>
  image ? <img src={image} /> : <Image src={ImgX} alt="x" />;

const renderSocialTelegram = (image?: string | null) =>
  image ? <img src={image} /> : <Image src={ImgTelegram} alt="telegram" />;

export interface TaskItemInfo extends Omit<TaskInfo, "type" | "image"> {
  image?: React.ReactNode;
  onClick?: () => void;
}

export function TaskBase(props: TaskItemInfo) {
  const { id, prevTaskId, image, content, rewardIcon, rewardAmount, onClick } = props;

  const isLoading = useIsLoading(id);
  const [progress, prevProgress] = useProgress([id, prevTaskId]);

  return (
    <div
      className={twMerge("flex items-center justify-between gap-2 rounded-lg bg-black/20 p-3")}
      onClick={onClick}
    >
      <div className="h-10 w-10 rounded-xl bg-gradient-to-b from-black to-[#0240B1]">{image}</div>

      <div className="flex-1">
        <p className="mb-1 text-xs font-bold leading-none">{content}</p>
      </div>

      <AssetsWrapper icon={<div className="rounded-full bg-black" />}>
        <span className="font-DinPro font-bold">+{formatDelimiter(rewardAmount)}</span>
      </AssetsWrapper>
    </div>
  );
}

export function CheckWallet(props: TaskItemInfo) {
  return <TaskBase {...props} />;
}

export function ConnectTwitter(props: TaskItemInfo) {
  return <TaskBase {...props} />;
}

export function FollowTwitter(props: TaskItemInfo) {
  const handle = useHandleTask("/task/follow_twitter", props.id, props.action);

  return <TaskBase {...props} onClick={handle} />;
}

export function ShareTwitter(props: TaskItemInfo) {
  const handle = useHandleTask("/task/share_twitter", props.id, props.action);

  return <TaskBase {...props} onClick={handle} />;
}

export function LikeCommentTweet(props: TaskItemInfo) {
  const handle = useHandleTask("/task/like_comment_twitter", props.id, props.action);

  return <TaskBase {...props} onClick={handle} />;
}

export function JoinTelegram(props: TaskItemInfo) {
  const handle = useHandleTask("/task/join_tg_group", props.id, props.action);

  return <TaskBase {...props} onClick={handle} />;
}

export function JoinDiscord(props: TaskItemInfo) {
  return <TaskBase {...props} />;
}

function TaskItem(props: TaskInfo) {
  const { type, image, ...other } = props;

  if (type === "check") {
    return <CheckWallet {...other} />;
  }

  if (type === "connect_twitter") {
    return <ConnectTwitter image={renderSocialX(image)} {...other} />;
  }

  if (type === "follow_twitter") {
    return <FollowTwitter image={renderSocialX(image)} {...other} />;
  }

  if (type === "share_twitter") {
    return <ShareTwitter image={renderSocialX(image)} {...other} />;
  }

  if (type === "share_youtube") {
    return <ShareTwitter image={renderSocialX(image)} {...other} />;
  }

  if (type === "like_comment_twitter") {
    return <LikeCommentTweet image={renderSocialTelegram(image)} {...other} />;
  }

  if (type === "join_tg_group") {
    return <JoinTelegram image={renderSocialTelegram(image)} {...other} />;
  }

  if (type === "join_dc_group") {
    return <JoinDiscord {...other} />;
  }

  return <></>;
}

export default function TaskList(props: TaskSubgroupInfo) {
  const { image, name, taskList } = props;

  return (
    <div className="space-y-3 overflow-hidden">
      {taskList.map(item => (
        <TaskItem {...item} isChild key={item.id} />
      ))}
    </div>
  );
}
