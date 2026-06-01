/**
 * 빈 함수 (No Operation).
 * 컴포넌트의 기본 콜백 prop으로 넘길 때 불필요한 익명 함수 생성을 방지합니다.
 */
export const noop = () => {};

/**
 * 고유 식별자(UUID)를 생성합니다.
 * 최신 브라우저의 crypto API를 우선 사용하고, 지원하지 않을 경우 폴백 로직을 탑재했습니다.
 * 리스트 아이템의 고유 Key를 생성할 때 유용합니다.
 */
export const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Debounce 유틸리티.
 * 연속해서 발생하는 이벤트를 그룹화하여, 지정된 시간(delay)이 지난 후 마지막에 한 번만 실행합니다.
 * (예: 검색어 입력 창 API 호출 최적화)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * Throttle 유틸리티.
 * 지정된 시간(limit) 동안 이벤트가 한 번만 실행되도록 제한합니다.
 * (예: 스크롤 이벤트, 리사이즈 이벤트 최적화)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
