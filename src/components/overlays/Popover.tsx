import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import styled from "@emotion/styled";
import { popoverContentBase } from "../../styles/mixins";

const PopoverContent = styled(PopoverPrimitive.Content)`
  ${({ theme }) => popoverContentBase(theme)}
  padding: ${({ theme }) => theme.spacing.lg};
  width: auto;

  max-width: ${({ theme }) => theme.sizes.component.modalAlertWidth};
  max-height: calc(100dvh - ${({ theme }) => theme.spacing.xxl});
`;

export const Popover = {
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Portal: PopoverPrimitive.Portal,
  Content: PopoverContent,
  Close: PopoverPrimitive.Close,
  Arrow: styled(PopoverPrimitive.Arrow)`
    fill: ${({ theme }) => theme.colors.background.surface};
  `,
};
