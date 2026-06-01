import { useState, useCallback } from "react";

export interface UseBoundedListOptions<T> {
  initialData?: T[];
  /** 최대 유지할 데이터 갯수 (기본값: 1000) */
  maxSize?: number;
  /** 단건 추가 시 배열의 앞에 넣을지(start), 뒤에 넣을지(end) */
  insertAt?: "start" | "end";
}

export function useBoundedList<T>({
  initialData = [],
  maxSize = 1000,
  insertAt = "start",
}: UseBoundedListOptions<T> = {}) {
  const [data, setDataState] = useState<T[]>(initialData);

  // 전체 데이터 덮어쓰기 (크기 초과 시 정책에 맞게 자름)
  const setData = useCallback(
    (newData: T[]) => {
      if (newData.length <= maxSize) {
        setDataState(newData);
        return;
      }

      const sliced =
        insertAt === "start"
          ? newData.slice(0, maxSize) // 최신 데이터가 앞이면 앞을 남김
          : newData.slice(newData.length - maxSize); // 최신 데이터가 뒤면 뒤를 남김

      setDataState(sliced);
    },
    [maxSize, insertAt],
  );

  // 단건 데이터 추가 (크기 초과 시 가장 오래된 데이터 밀어내기)
  const addItem = useCallback(
    (item: T) => {
      setDataState((prev) => {
        const newData =
          insertAt === "start" ? [item, ...prev] : [...prev, item];

        if (newData.length <= maxSize) return newData;

        return insertAt === "start"
          ? newData.slice(0, maxSize)
          : newData.slice(newData.length - maxSize);
      });
    },
    [maxSize, insertAt],
  );

  // 데이터 비우기
  const clear = useCallback(() => {
    setDataState([]);
  }, []);

  return {
    data,
    setData,
    addItem,
    clear,
  };
}
