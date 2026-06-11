import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { applyAnimation, skeletonPulse } from "../../styles";

/**
 * Skeleton placeholder의 크기와 형태를 정의합니다.
 *
 * width/height는 부모 레이아웃에 맞춘 상대값 또는 theme 기반 CSS 변수 값을 사용하고,
 * 외부 간격은 부모 Layout의 gap/padding으로 제어합니다.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Skeleton의 너비입니다. 기본값은 부모 너비를 채웁니다. */
  width?: string;
  /** Skeleton의 높이입니다. 기본값은 부모 높이를 채웁니다. */
  height?: string;
  /** Skeleton의 형태입니다. */
  shape?: "rect" | "circle";
}

/**
 * 콘텐츠 로딩 전 점유 영역을 표현하는 placeholder 컴포넌트입니다.
 *
 * 스크린 리더에서는 숨김 처리되며, 공통 animation token을 사용해 pulse 효과를
 * 제공합니다.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, shape = "rect", ...props }, ref) => {
    return (
      <StyledSkeleton
        ref={ref}
        $width={width}
        $height={height}
        $shape={shape}
        aria-hidden="true"
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) =>
    !["$width", "$height", "$shape"].includes(prop),
};

const StyledSkeleton = styled("div", filterProps)<{
  $width?: string;
  $height?: string;
  $shape: "rect" | "circle";
}>`
  width: ${({ $width }) => $width || "100%"};
  height: ${({ $height }) => $height || "100%"};

  border-radius: ${({ $shape, theme }) =>
    $shape === "circle" ? theme.borderRadius.round : theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.surface.sunken};

  ${({ theme }) =>
    applyAnimation(
      theme,
      skeletonPulse,
      theme.transitions.duration.slow,
      theme.transitions.function.easeInOut,
    )}

  animation-iteration-count: infinite;
`;
