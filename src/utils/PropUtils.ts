export interface DisabledStateProps {
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
}

export type TokenMap = Record<string, string | number>;

export const resolveDisabled = ({
  disabled,
  loading,
  readOnly,
}: DisabledStateProps): boolean => Boolean(disabled || loading || readOnly);

/**
 * theme token map에서 전달된 prop 값을 찾아 실제 CSS 값으로 변환합니다.
 *
 * token key가 아닌 CSS 값도 허용해 layout primitive가 확장성을 잃지 않도록 하며,
 * 값이 없을 때는 fallback을 반환합니다.
 */
export const resolveTokenValue = <TValue extends string | number | undefined>(
  tokens: TokenMap,
  value?: TValue,
  fallback?: TValue,
): string | number | undefined => {
  const resolvedValue = value ?? fallback;
  if (resolvedValue === undefined) return undefined;

  return tokens[String(resolvedValue)] ?? resolvedValue;
};
