"use client";

import { useEffect, useMemo, useCallback, useRef } from "react";

import { FetcherType, useAuthStore, useRequest } from "yz-swr-fetch";

import { usePublicFetcher, useAuthFetcher } from "@/hooks/api/useFetcher";

import { TaskInfo, TaskProgress, useTaskStore } from "./store";

export function windowOpen(url: string) {
  return window.open(url);
}

function useProgressList() {
  const fetcher = useAuthFetcher<TaskProgress[]>();

  return useCallback(
    (params: { taskIds: string }) => fetcher("/task/progress_list", { body: params }),
    [fetcher],
  );
}

export function useHandleTask(url: string, taskId: number, action?: string | null) {
  const fetcher = useAuthFetcher<boolean>();

  const addTaskIdListener = useTaskStore(state => state.addTaskIdListener);

  const clickRef = useRef(false);

  return useCallback(async () => {
    if (!action || clickRef.current) return;

    windowOpen(action);

    clickRef.current = true;
    addTaskIdListener(taskId, false);

    const res = await fetcher(url, { body: { taskId } });

    clickRef.current = false;

    if (res) addTaskIdListener(taskId, true);
  }, [fetcher, taskId, action]);
}

export function useTask() {
  const authorization = useAuthStore(state => state.authorization);

  const { data: rawTasks } = useRequest<TaskInfo[]>("/task/task_list", {
    type: FetcherType.PUBLIC,
  });
  const { data: rawProgress } = useRequest<TaskProgress[]>("/task/progress_list");

  const getProgressList = useProgressList();

  const progressList = useTaskStore(state => state.progressList);
  const taskIdListenerList = useTaskStore(state => state.taskIdListenerList);
  const initTask = useTaskStore(state => state.initTask);
  const initProgress = useTaskStore(state => state.initProgress);
  const updateProgress = useTaskStore(state => state.updateProgress);

  const timer = useRef<NodeJS.Timeout>();

  // 初始化任务数据
  useEffect(() => {
    if (rawTasks) initTask(rawTasks);
  }, [rawTasks]);

  // 初始化进度数据
  useEffect(() => {
    if (rawProgress) initProgress(rawProgress);
  }, [rawProgress]);

  useEffect(() => {
    if (!authorization || !progressList || !taskIdListenerList.length) return;

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      (async () => {
        const res = await getProgressList({ taskIds: taskIdListenerList.join() });
        if (!res) return;

        const finishedList: number[] = [];

        res.forEach(progress => {
          if (progress.finished === 1) finishedList.push(progress.taskId);
        });

        if (finishedList.length > 0) {
          // mutate(API_USER_INFO);
          // mutate(API_LOTTERY_INFO);
        }

        updateProgress(finishedList);
      })();
    }, 3000);
  }, [authorization, progressList, taskIdListenerList]);
}
