import { useMemo } from "react";

import { Trans } from "@lingui/macro";
import { twMerge } from "tailwind-merge";

import { BaseTaskIcon, SocialTaskIcon } from "@/components/Icon";

import { useTaskStore } from "./store";

export function TaskTabItem(
  props: {
    active: boolean;
    children: React.ReactNode;
    icon: React.ReactNode;
  } & React.HTMLAttributes<HTMLLIElement>,
) {
  const { active, children, icon, id, ...other } = props;

  return (
    <li
      id={id}
      className={twMerge("flex items-center gap-2", active ? "font-bold" : "opacity-60")}
      {...other}
    >
      {icon}
      {children}
    </li>
  );
}

export default function TaskTab() {
  const task = useTaskStore(state => state.taskMap);
  const currentGroup = useTaskStore(state => state.currentGroup);
  const changeGroup = useTaskStore(state => state.changeGroup);

  const groups = useMemo(() => (task ? Array.from(task.keys()) : null), [task]);

  return (
    <ul className="mb-3 flex items-center gap-5 leading-none">
      {groups &&
        groups.map(item => (
          <TaskTabItem
          
            icon={
              item === "Basic Tasks" ? (
                <BaseTaskIcon className="text-lg" />
              ) : (
                <SocialTaskIcon className="text-lg" />
              )
            }
            active={currentGroup === item}
            onClick={() => changeGroup(item)}
            key={item}
          >
            {item === "Basic Tasks" ? <Trans>Basic Tasks</Trans> : <Trans>Social Tasks</Trans>}
          </TaskTabItem>
        ))}
    </ul>
  );
}
