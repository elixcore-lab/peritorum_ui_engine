import { useState, useEffect } from "react";

/**
 * 값이 변경된 후 일정 시간(delay) 동안 추가 변경이 없을 때만 값을 업데이트합니다.
 * 주로 검색어 입력(API 호출 최적화)에 사용됩니다.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value나 delay가 변경되면 기존 타이머를 취소 (Cleanup)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
