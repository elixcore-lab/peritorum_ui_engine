import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { applyAnimation, slideUpAndFade } from "../../styles";

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
  delayDuration = 200,
}: TooltipProps) => {
  const theme = useTheme();

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipContent side={side} sideOffset={theme.sizes.offset.tooltip}>
            {content}
            <TooltipArrow />
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
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

  ${({ theme }) =>
    applyAnimation(
      theme,
      slideUpAndFade,
      theme.transitions.duration.fast,
      theme.transitions.function.easeOut,
    )}
`;

const TooltipArrow = styled(TooltipPrimitive.Arrow)`
  fill: ${({ theme }) => theme.colors.text.primary};
`;
