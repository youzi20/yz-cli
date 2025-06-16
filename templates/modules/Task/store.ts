import { useMemo } from "react";
import { create } from "zustand";

export type TaskType =
  | "check"
  | "connect_twitter"
  | "follow_twitter"
  | "share_twitter"
  | "share_youtube"
  | "join_tg_group"
  | "join_dc_group"
  | "like_comment_twitter";

export interface TaskInfo {
  id: number;
  type: TaskType;
  group: string;
  content: React.ReactNode;
  rewardIcon: string;
  rewardAmount: string;

  prevTaskId?: number | null;
  image?: string | null;
  action?: string | null;
  subgroup?: {
    image: string;
    name: string;
  } | null;
  needCheck?: 0 | 1 | null;

  isChild?: boolean;
  disabled?: boolean | null;
}

export interface TaskSubgroupInfo {
  id: number;
  image: string;
  name: string;
  taskList: TaskInfo[];
}

export type TaskGroupList = Record<string, (TaskInfo | TaskSubgroupInfo)[]>;

export type FinishedType = 0 | 1 | 2;

export interface TaskProgress {
  taskId: number;
  finished: FinishedType;
}

export interface TaskStore {
  tasks: TaskGroupList | null;
  progressList: Map<number, FinishedType> | null;
  taskIdLoadingList: number[];
  taskIdListenerList: number[];
}

export interface TaskStoreAction {
  initTask: (tasks: TaskInfo[]) => void;
  initProgress: (progress: TaskProgress[]) => void;
  updateProgress: (ids: number[]) => void;
  addTaskIdListener: (id: number, isLoading: boolean) => void;
}

export const useTaskStore = create<TaskStore & TaskStoreAction>((set, get) => ({
  tasks: null,
  progressList: null,
  taskIdLoadingList: [],
  taskIdListenerList: [],

  initTask(rawTasks) {
    const grouped: TaskGroupList = {};
    const subgroupMap: Record<string, TaskInfo[]> = {};

    rawTasks.forEach(task => {
      const group = task.group;
      const subgroup = task.subgroup;

      if (!grouped[group]) grouped[group] = [];

      if (!subgroup) {
        grouped[group].push(task);
        return;
      }

      const key = subgroup.name;

      if (!subgroupMap[key]) {
        subgroupMap[key] = [];

        grouped[group].push({
          id: task.id, // 用第一个任务的 ID 作为子组 ID
          image: subgroup.image,
          name: subgroup.name,
          taskList: subgroupMap[key],
        });
      }

      subgroupMap[key].push(task);
    });

    set({ tasks: grouped });
  },

  initProgress(progress) {
    const map = new Map<number, FinishedType>();
    progress.forEach(p => map.set(p.taskId, p.finished));
    set({ progressList: map });
  },

  updateProgress(ids) {
    set(state => {
      const updated = new Map(state.progressList);
      ids.forEach(id => updated.set(id, 1));

      return {
        progressList: updated,
        taskIdLoadingList: state.taskIdLoadingList.filter(id => !ids.includes(id)),
        taskIdListenerList: state.taskIdListenerList.filter(id => !ids.includes(id)),
      };
    });
  },

  addTaskIdListener(id, isListener) {
    set(state => {
      const loadingSet = new Set(state.taskIdLoadingList);
      loadingSet.add(id);

      const listenerSet = new Set(state.taskIdListenerList);
      if (isListener) listenerSet.add(id);

      return {
        taskIdLoadingList: Array.from(loadingSet),
        taskIdListenerList: Array.from(listenerSet),
      };
    });
  },
}));

export function useProgress(ids: (number | null | undefined)[]) {
  const progressList = useTaskStore(state => state.progressList);

  return useMemo(() => {
    if (!progressList) return [];

    return ids.map(id => (id ? (progressList.get(id) ?? 1) : 1));
  }, [progressList, ids]);
}

export function useIsLoading(id: number): boolean {
  const taskIdLoadingList = useTaskStore(state => state.taskIdLoadingList);

  return useMemo(() => taskIdLoadingList.includes(id), [taskIdLoadingList, id]);
}
