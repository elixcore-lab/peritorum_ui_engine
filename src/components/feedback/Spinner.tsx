import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { Loader2 } from "lucide-react";
import { spin } from "../../styles/animation";
import { applyAnimation, squareIconSize } from "../../styles/mixins";
import { type IconSize, type ColorVariant } from "../../styles/types";
import { useUiConfig } from "../../ConfigProvider";

/**
 * Spinner가 사용할 크기와 색상 토큰을 정의합니다.
 *
 * 크기와 색상은 디자인 시스템 토큰을 사용하며, 접근성 이름은 `aria-label`로
 * 오버라이드할 수 있습니다.
 */
export interface SpinnerProps extends Omit<
  React.SVGAttributes<SVGSVGElement>,
  "color"
> {
  /** theme icon size 토큰입니다. */
  size?: IconSize;
  /** theme color intent 또는 currentColor입니다. */
  color?: ColorVariant | "currentColor";
}

/**
 * 비동기 로딩 상태를 나타내는 SVG 기반 spinner입니다.
 *
 * 공통 animation mixin과 theme transition token을 사용하며 스크린 리더용 상태
 * 라벨을 기본 제공합니다.
 */
export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "md", color = "brand", className, ...props }, ref) => {
    const { t } = useUiConfig();

    return (
      <StyledSpinner
        ref={ref}
        $size={size}
        $color={color}
        className={className}
        role="status"
        aria-label={props["aria-label"] || t("common.loading")}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

// ==========================================
// Styled Components
// ==========================================

const filterProps = {
  shouldForwardProp: (prop: string) => !["$color", "$size"].includes(prop),
};

const StyledSpinner = styled(Loader2, filterProps)<{
  $color: string;
  $size: SpinnerProps["size"];
}>`
  ${({ theme, $size }) => squareIconSize(theme, $size || "md")}

  color: ${({ theme, $color }) => {
    if ($color === "currentColor" || $color === "inherit") return $color;

    // 브랜드 컬러 폴백 (그라데이션은 텍스트 컬러 속성으로 먹지 않으므로 대표 단색인 cyan 사용)
    if ($color === "brand")
      return theme.colors.brand.cyan || theme.colors.brand.primary;

    if (["success", "danger", "warning", "info"].includes($color)) {
      return theme.colors.status[
        $color as "success" | "danger" | "warning" | "info"
      ];
    }

    return $color;
  }};

  ${({ theme }) =>
    applyAnimation(
      theme,
      spin,
      theme.transitions.duration.slow,
      theme.transitions.function.linear,
    )}
  animation-iteration-count: infinite;
`;
