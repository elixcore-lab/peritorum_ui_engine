import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { resolveDisabled } from "../../utils";
import { applyTransition } from "../../styles/mixins";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, disabled, ...props }, ref) => {
    const trulyDisabled = resolveDisabled({ disabled });

    return (
      <StyledLabel
        ref={ref}
        data-disabled={trulyDisabled ? "" : undefined}
        {...props}
      >
        {children}
        {required && <RequiredMark aria-hidden="true">*</RequiredMark>}
      </StyledLabel>
    );
  },
);

Label.displayName = "Label";

const StyledLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  user-select: none;

  ${({ theme }) => applyTransition(theme, "color")}

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.status.danger};
`;
