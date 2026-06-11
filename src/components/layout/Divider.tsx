import React, { forwardRef } from "react";
import styled from "@emotion/styled";

/**
 * Divider 컴포넌트가 지원하는 방향과 라벨 콘텐츠를 정의합니다.
 *
 * 라벨이 있는 구분선은 수평 방향에서만 렌더링되며, 외부 간격은 부모 Layout의
 * gap 또는 padding으로 제어해야 합니다.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
}

/**
 * 레이아웃 사이의 시각적 구분을 제공하는 테마 기반 구분선입니다.
 *
 * `orientation`에 따라 수평/수직 렌더링을 지원하고, 표준 div 속성과 ref를
 * 그대로 전달할 수 있습니다.
 */
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
