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

export const TooltipProvider = TooltipPrimitive.Provider;

export interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}

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
          collisionPadding={8}
        >
          {content}
          <TooltipArrow />
        </TooltipContent>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
};

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
  line-height: 1.4;
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
