import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";
import {
  applyAnimation,
  slideUpAndFade,
  slideDownAndFade,
  slideInRight,
  slideInLeft,
} from "../../styles";

/**
 * Tooltip 트리에서 공통 delay와 접근성 컨텍스트를 제공하는 Radix Provider입니다.
 */
export const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip 컴포넌트가 감쌀 트리거, 표시 콘텐츠, 배치 방향을 정의합니다.
 *
 * 트리거는 `asChild`로 렌더링되므로 단일 ReactElement를 전달해야 하며,
 * delayDuration은 Radix TooltipRoot의 지연 시간을 그대로 사용합니다.
 */
export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}

/**
 * 짧은 보조 설명을 hover/focus 시 표시하는 디자인 시스템 Tooltip입니다.
 *
 * 배치별 애니메이션과 surface 색상은 theme/mixin을 사용하고, spacing offset은
 * theme token을 통해 관리합니다.
 */
export const Tooltip = ({
  children,
  content,
  side = "top",
  delayDuration,
}: TooltipProps) => {
  const theme = useTheme();

  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipContent
          side={side}
          sideOffset={theme.sizes.offset.tooltip}
          collisionPadding={theme.sizes.offset.toastGutter}
        >
          {content}
          <TooltipArrow />
        </TooltipContent>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

Tooltip.displayName = "Tooltip";

const tooltipAnimations = {
  top: slideUpAndFade,
  bottom: slideDownAndFade,
  left: slideInLeft,
  right: slideInRight,
};

const TooltipContent = styled(TooltipPrimitive.Content)`
  z-index: ${({ theme }) => theme.zIndices.tooltip};
  background-color: ${({ theme }) => theme.colors.text.primary};
  color: ${({ theme }) => theme.colors.background.surface};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.base};
  max-width: ${({ theme }) => theme.sizes.component.tooltipMaxWidth};
  word-wrap: break-word;
  white-space: pre-wrap;
  text-align: center;

  ${({ theme }) =>
    Object.entries(tooltipAnimations).map(
      ([side, animation]) => css`
        &[data-side="${side}"] {
          ${applyAnimation(
            theme,
            animation,
            theme.transitions.duration.fast,
            theme.transitions.function.easeOut,
          )}
        }
      `,
    )}
`;

const TooltipArrow = styled(TooltipPrimitive.Arrow)`
  fill: ${({ theme }) => theme.colors.text.primary};
`;
