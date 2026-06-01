export interface DisabledStateProps {
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
}

export const resolveDisabled = ({
  disabled,
  loading,
  readOnly,
}: DisabledStateProps): boolean => Boolean(disabled || loading || readOnly);
