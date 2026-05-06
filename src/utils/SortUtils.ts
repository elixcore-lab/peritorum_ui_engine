export const SortDirection = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export interface SortConfig {
  id: string;
  direction: SortDirection;
}

/**
 * 범용 다중 정렬 유틸리티
 * @param data 정렬할 원본 배열
 * @param sortConfigs 정렬 규칙 배열 (우선순위 순서)
 */
export const multiSort = <T>(data: T[], sortConfigs: SortConfig[]): T[] => {
  if (!sortConfigs || sortConfigs.length === 0) return data;

  // 원본 배열 불변성 유지를 위해 복사 후 정렬
  return [...data].sort((a, b) => {
    for (const config of sortConfigs) {
      const { id, direction } = config;
      const valA = (a as Record<string, any>)[id];
      const valB = (b as Record<string, any>)[id];

      // 값이 같으면 다음 우선순위 정렬 규칙으로 넘어감
      if (valA === valB) continue;

      const modifier = direction === SortDirection.ASC ? 1 : -1;

      // null 또는 undefined 처리 (항상 뒤로)
      if (valA == null) return 1;
      if (valB == null) return -1;

      // 문자열인 경우 다국어/알파벳 순서 비교
      if (typeof valA === "string" && typeof valB === "string") {
        const comparison = valA.localeCompare(valB);
        if (comparison !== 0) return comparison * modifier;
        continue;
      }

      // 숫자 및 기타 타입 비교
      if (valA < valB) return -1 * modifier;
      if (valA > valB) return 1 * modifier;
    }
    return 0; // 모든 조건이 같으면 순서 유지
  });
};
