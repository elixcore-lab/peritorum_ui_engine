export const SortDirection = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];

export interface SortConfig {
  id: string; // "name" 또는 "user.address.city" 같은 중첩 경로도 가능
  direction: SortDirection;
}

export const getSortDirectionByColumnId = (sortConfigs: SortConfig[]) => {
  const directionByColumnId = new Map<string, SortDirection>();
  for (const { id, direction } of sortConfigs) {
    directionByColumnId.set(id, direction);
  }
  return directionByColumnId;
};

export const getNextSortConfigs = (
  currentConfigs: SortConfig[],
  columnId: string,
  isMultiSort: boolean,
): SortConfig[] => {
  const existingIndex = currentConfigs.findIndex((c) => c.id === columnId);
  if (isMultiSort) {
    if (existingIndex === -1)
      return [
        ...currentConfigs,
        { id: columnId, direction: SortDirection.DESC },
      ];
    const nextConfigs = [...currentConfigs];
    nextConfigs[existingIndex] = {
      ...nextConfigs[existingIndex],
      direction:
        nextConfigs[existingIndex].direction === SortDirection.DESC
          ? SortDirection.ASC
          : SortDirection.DESC,
    };
    return nextConfigs;
  }
  if (existingIndex >= 0 && currentConfigs.length === 1) {
    return currentConfigs[0].direction === SortDirection.DESC
      ? [{ id: columnId, direction: SortDirection.ASC }]
      : [];
  }
  return [{ id: columnId, direction: SortDirection.DESC }];
};

const getValueByPath = (obj: Record<string, any>, path: string): any => {
  return path
    .split(".")
    .reduce((acc, part) => (acc ? acc[part] : undefined), obj);
};

export const multiSort = <T>(data: T[], sortConfigs: SortConfig[]): T[] => {
  if (!sortConfigs || sortConfigs.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const config of sortConfigs) {
      const { id, direction } = config;

      const valA = getValueByPath(a as Record<string, any>, id);
      const valB = getValueByPath(b as Record<string, any>, id);

      if (valA === valB) continue;

      const modifier = direction === SortDirection.ASC ? 1 : -1;

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === "string" && typeof valB === "string") {
        const comparison = valA.localeCompare(valB, undefined, {
          numeric: true,
        });
        if (comparison !== 0) return comparison * modifier;
        continue;
      }

      if (valA < valB) return -1 * modifier;
      if (valA > valB) return 1 * modifier;
    }
    return 0;
  });
};
