import React from "react";

import { create } from "zustand";

type TaskType =
  | "check"
  | "connect_twitter"
  | "follow_twitter"
  | "share_twitter"
  | "share_youtube"
  | "join_tg_group"
  | "join_dc_group"
  | "like_comment_twitter";

interface TaskSubGroup {
  image: string;
  name: string;
}

export interface TaskInfo {
  id: number;
  type: TaskType;
  group: string; // "daily" | "one-time" | "partners";
  content: React.ReactNode;
  rewardIcon: string;
  rewardAmount: string;

  prevTaskId?: number | null; // 关联开启做任务限制
  image?: string | null; // 预留字段 如果有使用cf资源文件 默认预设一套任务在前端代码内
  action?: string | null;
  subgroup?: TaskSubGroup | null;
  needCheck?: 0 | 1 | null;

  isChild?: boolean;
  disabled?: boolean | null;
}

export interface SubgroupTaskInfo {
  id: number;
  image: string;
  name: string;
  taskList: TaskInfo[];
}

export type FinishedType = 0 | 1 | 2;

export interface Progress {
  taskId: number;
  finished: FinishedType;
}

interface TaskStore {
  taskMap: Map<string, (TaskInfo | SubgroupTaskInfo)[]> | null;
  currentGroup: string | null;
  taskList: (TaskInfo | SubgroupTaskInfo)[] | null;
  progressList: Map<number, FinishedType> | null;
  taskIdLoadingList: number[];
  taskIdListenerList: number[];
}

interface TaskStoreAction {
  initTask: (tasks: TaskInfo[]) => void;
  initProgress: (progress: Progress[]) => void;
  updateProgress: (ids: number[]) => void;
  changeGroup: (group: string) => void;
  addTaskIdListener: (id: number, isLoading: boolean) => void;
}

export const useTaskStore = create<TaskStore & TaskStoreAction>(set => ({
  taskMap: null,
  currentGroup: null,
  taskList: null,
  progressList: null,
  taskIdLoadingList: [],
  taskIdListenerList: [],
  initTask(tasks) {
    const _tasks: Record<string, (TaskInfo | SubgroupTaskInfo)[]> = {};
    const _subgroups: Record<string, TaskInfo[]> = {};

    tasks.forEach(item => {
      if (!_tasks[item.group]) _tasks[item.group] = [];

      if (!item.subgroup) {
        _tasks[item.group].push(item);
        return;
      }

      if (!_subgroups[item.subgroup.name]) {
        _subgroups[item.subgroup.name] = [];
        _tasks[item.group].push({
          ...item.subgroup,
          id: item.id,
          taskList: _subgroups[item.subgroup.name],
        });
      }

      _subgroups[item.subgroup.name].push(item);
    });

    const _taskData = Object.entries(_tasks);
    const current = _taskData[0];

    set({ currentGroup: current[0], taskList: current[1], taskMap: new Map(_taskData) });
  },
  initProgress: progress => {
    const _progress = progress.map(item => [item.taskId, item.finished] as [number, FinishedType]);

    set({ progressList: new Map(_progress) });
  },
  updateProgress: ids =>
    set(state => {
      const progressList = new Map(state.progressList);
      ids.forEach(id => {
        progressList.set(id, 1);
      });

      return {
        progressList,
        taskIdLoadingList: state.taskIdLoadingList.filter(id => !ids.includes(id)),
        taskIdListenerList: state.taskIdListenerList.filter(id => !ids.includes(id)),
      };
    }),
  changeGroup: group =>
    set(state => ({ currentGroup: group, taskList: state.taskMap?.get(group) })),
  addTaskIdListener: (id, isListener) =>
    set(state => ({
      taskIdLoadingList: [...state.taskIdLoadingList, id],
      ...(isListener ? { taskIdListenerList: [...state.taskIdListenerList, id] } : {}),
    })),
  // removeTaskIdListener: id =>
  //   set(state => ({
  //     taskIdLoadingList: state.taskIdLoadingList.filter(taskId => taskId !== id),
  //     taskIdListenerList: state.taskIdListenerList.filter(taskId => taskId !== id),
  //   })),
}));
