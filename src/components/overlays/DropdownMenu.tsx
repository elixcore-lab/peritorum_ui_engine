import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import styled from "@emotion/styled";
import {
  applyAnimation,
  applyTransition,
  slideDownAndFade,
} from "../../styles";

// --- 합성용 서브 컴포넌트 스타일링 ---

const StyledContent = styled(DropdownMenuPrimitive.Content)`
  min-width: ${({ theme }) => theme.sizes.component.dropdownMinWidth};
  background-color: ${({ theme }) => theme.colors.background.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xs};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.lg};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  z-index: ${({ theme }) => theme.zIndices.popover};

  ${({ theme }) =>
    applyAnimation(
      theme,
      slideDownAndFade,
      theme.transitions.duration.fast,
      theme.transitions.function.easeOut,
    )}
`;

const StyledItem = styled(DropdownMenuPrimitive.Item)<{ $danger?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.status.danger : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  position: relative;
  user-select: none;
  outline: none;
  cursor: pointer;
  ${({ theme }) =>
    applyTransition(
      theme,
      "background-color, color",
      theme.transitions.duration.fast,
      theme.transitions.function.easeOut,
    )}

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.disabled};
    pointer-events: none;
  }

  &[data-highlighted] {
    background-color: ${({ theme, $danger }) =>
      $danger
        ? `${theme.colors.status.danger}1A`
        : theme.colors.background.hover};
    color: ${({ theme, $danger }) =>
      $danger ? theme.colors.status.danger : theme.colors.text.primary};
  }
`;

const StyledSeparator = styled(DropdownMenuPrimitive.Separator)`
  height: ${({ theme }) => theme.sizes.component.dividerThin};
  background-color: ${({ theme }) => theme.colors.border.divider};
  margin: ${({ theme }) => theme.spacing.xs} -${({ theme }) => theme.spacing.xs};
`;

const StyledLabel = styled(DropdownMenuPrimitive.Label)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.base}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

// --- 외부로 노출할 네임스페이스 ---

export const DropdownMenu = {
  Root: DropdownMenuPrimitive.Root,
  Trigger: DropdownMenuPrimitive.Trigger,
  Portal: DropdownMenuPrimitive.Portal,
  Content: StyledContent,
  Item: StyledItem,
  Separator: StyledSeparator,
  Label: StyledLabel,
};
