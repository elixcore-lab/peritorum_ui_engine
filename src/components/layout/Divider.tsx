import React, { forwardRef } from "react";
import styled from "@emotion/styled";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", children, ...props }, ref) => {
    if (children && orientation === "horizontal") {
      return (
        <DividerWithChildren
          ref={ref}
          role="separator"
          aria-orientation={orientation}
          {...props}
        >
          <FlexibleLine />
          <ContentWrapper>{children}</ContentWrapper>
          <FlexibleLine />
        </DividerWithChildren>
      );
    }

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

// --- Styled Components ---

const StyledDivider = styled.div<{ $orientation: "horizontal" | "vertical" }>`
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

const DividerWithChildren = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FlexibleLine = styled.div`
  flex: 1;
  height: ${({ theme }) => theme.sizes.component.dividerThin};
  background-color: ${({ theme }) => theme.colors.border.divider};
`;

const ContentWrapper = styled.div`
  flex-shrink: 0;
`;
