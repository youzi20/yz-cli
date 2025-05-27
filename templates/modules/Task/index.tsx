import { cx } from "cva";
import { useAuthStore } from "@/hooks/api/useRequest";

import TaskTab from "./TaskTab";
import TaskList from "./TaskList";

export default function Task({className, isTutorial}: {className?: string, isTutorial?: boolean}) {
  const userInfo = useAuthStore(state => state.userInfo);

  return (
    <section id="basicTask" className={cx(userInfo?.basicTaskFinish && "order-1", className, isTutorial && "order-first")}>
      <TaskTab />
      <TaskList />
    </section>
  );
}
