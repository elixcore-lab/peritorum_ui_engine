import React, { forwardRef } from "react";
import styled from "@emotion/styled";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = "horizontal", ...props }, ref) => {
    return (
      <StyledDivider
        ref={ref}
        $orientation={orientation}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  },
);
Divider.displayName = "Divider";

const StyledDivider = styled.hr<{ $orientation: "horizontal" | "vertical" }>`
  border: none;
  background-color: ${({ theme }) => theme.colors.border.divider};
  flex-shrink: 0;
  margin: 0;

  ${({ $orientation, theme }) =>
    $orientation === "horizontal"
      ? `
        width: 100%;
        height: ${theme.sizes.component.dividerThin};
      `
      : `
        height: 100%;
        width: ${theme.sizes.component.dividerThin};
        align-self: stretch;
      `}
`;
