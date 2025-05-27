"use client";

import { useEffect, useMemo, useCallback, useRef } from "react";

import { mutate } from "swr";

import { API_LOTTERY_INFO, API_USER_INFO } from "@/hooks/api/constant";
import useRequest, { useAuthStore, useRequestMutation } from "@/hooks/api/useRequest";

import { TaskInfo, Progress, useTaskStore } from "./store";

export function windowOpen(url: string) {
  return window.open(url);
}

export function useHandleTask(url: string, taskId: number, action?: string | null) {
  const handleTask = useRequestMutation<boolean, { taskId: number }>(url, (request, params) =>
    request({ body: params })
  );

  const addTaskIdListener = useTaskStore(state => state.addTaskIdListener);

  const clickRef = useRef(false);

  return useCallback(async () => {
    if (!action || clickRef.current) return;

    windowOpen(action);

    clickRef.current = true;
    addTaskIdListener(taskId, false);

    const res = await handleTask({ taskId });

    clickRef.current = false;

    if (res) addTaskIdListener(taskId, true);
  }, [handleTask, taskId, action]);
}

export function useProgress(ids: (number | null | undefined)[]) {
  const progressList = useTaskStore(state => state.progressList);

  return useMemo(() => {
    if (!progressList) return [];

    return ids.map(id => (id ? progressList.get(id) ?? 1 : 1));
  }, [progressList, ids]);
}

export function useIsLoading(id: number): boolean {
  const taskIdLoadingList = useTaskStore(state => state.taskIdLoadingList);

  return useMemo(() => taskIdLoadingList.includes(id), [taskIdLoadingList, id]);
}

export function useTask() {
  const authorization = useAuthStore(state => state.authorization);

  const { data: task } = useRequest<TaskInfo[]>("/task/task_list");
  const { data: progress } = useRequest<Progress[]>("/task/progress_list");
  const getProgressList = useRequestMutation<Progress[], { taskIds: string }>(
    "/task/progress_list",
    (request, params) => request({ body: params })
  );

  const progressList = useTaskStore(state => state.progressList);
  const taskIdListenerList = useTaskStore(state => state.taskIdListenerList);
  const initTask = useTaskStore(state => state.initTask);
  const initProgress = useTaskStore(state => state.initProgress);
  const updateProgress = useTaskStore(state => state.updateProgress);

  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (task) initTask(task);
  }, [task]);

  useEffect(() => {
    if (progress) initProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!authorization || !progressList || !taskIdListenerList.length) return;
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      (async () => {
        const progressList = await getProgressList({ taskIds: taskIdListenerList.join() });

        if (progressList) {
          const finishedList: number[] = [];

          progressList.forEach(progress => {
            if (progress.finished === 1) finishedList.push(progress.taskId);
          });

          if (finishedList.length > 0) {
            mutate(API_USER_INFO);
            mutate(API_LOTTERY_INFO);
          }

          updateProgress(finishedList);
        }
      })();
    }, 3000);
  }, [authorization, progressList, taskIdListenerList]);
}
