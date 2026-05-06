import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { resolveDisabled } from "../../utils";

export interface LabelProps extends Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "disabled"
> {
  required?: boolean;
  isDisabled?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, isDisabled, ...props }, ref) => {
    const resolvedDisabled = resolveDisabled({ isDisabled });

    return (
      <StyledLabel ref={ref} $isDisabled={resolvedDisabled} {...props}>
        {children}
        {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
      </StyledLabel>
    );
  },
);

Label.displayName = "Label";

const StyledLabel = styled.label<{ $isDisabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $isDisabled }) =>
    $isDisabled ? theme.colors.text.disabled : theme.colors.text.primary};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  user-select: none;
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.status.danger};
`;
