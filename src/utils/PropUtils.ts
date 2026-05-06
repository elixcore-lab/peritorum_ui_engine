export interface DisabledStateProps {
  isDisabled?: boolean;
}

export const resolveDisabled = ({ isDisabled }: DisabledStateProps): boolean =>
  Boolean(isDisabled);
