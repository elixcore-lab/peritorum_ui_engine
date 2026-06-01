import { useState, useEffect, useRef } from "react";

/**
 * 값이 아무리 자주 변경되어도 지정된 시간(limit)에 최대 한 번만 값을 업데이트합니다.
 * 주로 스크롤, 리사이즈, 마우스 이동 등 과도한 이벤트 발생을 제한할 때 사용됩니다.
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeRemaining = limit - (now - lastExecuted.current);

    if (timeRemaining <= 0) {
      // 제한 시간이 지났으면 즉시 업데이트
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      // 아직 제한 시간이 남았다면 남은 시간 후에 업데이트 예약
      const timerId = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, timeRemaining);

      return () => clearTimeout(timerId);
    }
  }, [value, limit]);

  return throttledValue;
}
