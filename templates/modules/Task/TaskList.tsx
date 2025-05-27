import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

import { twMerge } from "tailwind-merge";

import { ArrowIcon } from "@/components/Icon";

import { Background } from "@/sections/dapp/Backdrop";

import useWrappedClick from "@/hooks/useWrappedClick";

import TaskBase, { TaskItemInfo } from "./TaskBase";
import { TaskInfo, SubgroupTaskInfo, useTaskStore } from "./store";
import { useHandleTask } from "./hooks";
import { useAuthStore } from "@/hooks/api/useRequest";

import ImgX from "./images/socialX.svg";
import ImgTelegram from "./images/socialTelegram.svg";

const renderSocialX = (image?: string | null) =>
  image ? <img src={image} /> : <Image src={ImgX} alt="x" />;

const renderSocialTelegram = (image?: string | null) =>
  image ? <img src={image} /> : <Image src={ImgTelegram} alt="telegram" />;

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

export function BindPhone(props: TaskItemInfo) {
  const addTaskIdListener = useTaskStore(state => state.addTaskIdListener);
  const useInfo = useAuthStore(state => state.userInfo);

  const router = useRouter();
  const handle = async () => {
    if (useInfo?.source !== "email" || useInfo?.phone) {
      addTaskIdListener(3, false);
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          addTaskIdListener(3, true);
          resolve();
          return;
        }, 3000);
      });
    } else {
      router.push("/bind?isTask=1&editType=phone");
    }
  };

  return <TaskBase {...props} onClick={handle} />;
}

export function JoinTelegram(props: TaskItemInfo) {
  const handle = useHandleTask("/task/join_tg_group", props.id, props.action);

  return <TaskBase {...props} onClick={handle} />;
}

export function JoinDiscord(props: TaskItemInfo) {
  return <TaskBase {...props} />;
}

function GroupItem(props: SubgroupTaskInfo) {
  const { image, name, taskList } = props;
  const [visible, setVisible] = useState<boolean>(false);

  const handleChangeVisible = useWrappedClick(() => {
    setVisible(!visible);
  }, [visible]);

  return (
    <div className="bg-[#171618]">
      <div className="flex items-center p-3" onClick={handleChangeVisible}>
        <div className="mr-3 h-8 w-8">
          <img src={image} alt="" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-none">{name}</p>
        </div>

        <ArrowIcon className={twMerge("mx-2 rotate-90 text-2xs", visible && "-rotate-90")} />
      </div>

      <div className={twMerge("space-y-3 overflow-hidden", visible ? "h-auto pb-3" : "h-0")}>
        {taskList.map(item => (
          <TaskItem {...item} isChild key={item.id} />
        ))}
      </div>
    </div>
  );
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

  if (type === "bind_phone") {
    return <BindPhone image={renderSocialTelegram(image)} {...other} />;
  }
  return <></>;
}

export default function TaskList() {
  const taskList = useTaskStore(state => state.taskList);

  if (!taskList) return;

  return (
    <Background childClass="grid gap-3 py-5">
      {taskList.map(item => {
        if ("taskList" in item) return <GroupItem {...item} key={item.id} />;
        return <TaskItem {...item} key={item.id} />;
      })}
    </Background>
  );
}
