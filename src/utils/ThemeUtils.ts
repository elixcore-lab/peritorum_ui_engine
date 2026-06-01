//  2차원 이상의 깊은 객체도 선택적으로 덮어씌울 수 있게 해주는 타입
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

// 순수 JS 기반의 객체 깊은 병합(Deep Merge) 함수
const isObject = (item: any) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

export const mergeTheme = (base: any, override: any): any => {
  if (!override) return base;

  const result = { ...base };

  for (const key in override) {
    if (isObject(base[key]) && isObject(override[key])) {
      result[key] = mergeTheme(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }

  return result;
};
