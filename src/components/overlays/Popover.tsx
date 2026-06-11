import React, { forwardRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import styled from "@emotion/styled";
import { popoverContentBase } from "../../styles/mixins";

/**
 * Popover Content가 허용하는 Radix 속성을 정의합니다.
 *
 * 디자인 시스템 스타일을 유지하기 위해 `style` prop은 제외합니다.
 */
export interface PopoverContentProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    "style"
  > {}

/**
 * Popover Arrow가 허용하는 Radix 속성을 정의합니다.
 *
 * Arrow 색상은 surface 토큰에 맞춰 고정되므로 인라인 스타일은 허용하지 않습니다.
 */
export interface PopoverArrowProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>,
    "style"
  > {}

const StyledPopoverContent = styled(PopoverPrimitive.Content)`
  ${({ theme }) => popoverContentBase(theme)}
  padding: ${({ theme }) => theme.spacing.lg};
  width: auto;

  max-width: ${({ theme }) => theme.sizes.component.modalAlertWidth};
  max-height: calc(100dvh - ${({ theme }) => theme.spacing["2xl"]});
`;

const PopoverContent = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>((props, ref) => {
  return <StyledPopoverContent ref={ref} {...props} />;
});
PopoverContent.displayName = "PopoverContent";

const StyledPopoverArrow = styled(PopoverPrimitive.Arrow)`
  fill: ${({ theme }) => theme.colors.background.surface};
`;

const PopoverArrow = forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  PopoverArrowProps
>((props, ref) => {
  return <StyledPopoverArrow ref={ref} {...props} />;
});
PopoverArrow.displayName = "PopoverArrow";

/**
 * Radix Popover primitive를 디자인 시스템 surface 스타일로 묶은 compound API입니다.
 *
 * Content와 Arrow는 inline style prop을 제외하고, Content는 popoverContentBase mixin을
 * 통해 elevation, border, animation, scrollbar 표현을 통일합니다.
 */
export const Popover = {
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Portal: PopoverPrimitive.Portal,
  Content: PopoverContent,
  Close: PopoverPrimitive.Close,
  Arrow: PopoverArrow,
};
