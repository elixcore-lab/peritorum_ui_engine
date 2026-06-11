/**
 * 값을 특정 범위(min, max) 내로 제한하는 함수
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * "1-3, 5" 형태의 문자열을 파싱하여 중복을 제거하고 정렬된 배열([1, 2, 3, 5])로 반환
 */
export const parseRangeString = (input: string): number[] => {
  if (!input) return [];

  const results = new Set<number>();

  const parts = input.split(",");

  parts.forEach((part) => {
    const trimmed = part.trim();

    // 사용자가 "1, , 3" 처럼 입력했을 때 빈 문자열이 0으로 변환되는 버그 차단
    if (!trimmed) return;

    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);

      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
          results.add(i);
        }
      }
    } else {
      const num = Number(trimmed);
      if (!isNaN(num)) {
        results.add(num);
      }
    }
  });

  return Array.from(results).sort((a, b) => a - b);
};

/**
 * 숫자에 1,000 단위 콤마(,)를 찍어주는 함수 (Intl API 활용)
 */
export const formatNumber = (
  num: number | string,
  locale: string = "ko-KR",
): string => {
  const parsed = Number(num);
  if (isNaN(parsed)) return "0";
  return new Intl.NumberFormat(locale).format(parsed);
};

/**
 * 바이트(Byte) 크기를 사람이 읽기 쉬운 단위(KB, MB, GB 등)로 변환
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * 최소값(min)과 최대값(max) 사이의 랜덤 정수를 반환 (max 포함)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
