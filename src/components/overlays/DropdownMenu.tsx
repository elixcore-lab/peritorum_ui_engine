import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import styled from "@emotion/styled";
import {
  squareIconSize,
  popoverContentBase,
  popoverItemBase,
} from "../../styles";

const StyledContent = styled(DropdownMenuPrimitive.Content)`
  ${({ theme }) => popoverContentBase(theme)}
  min-width: ${({ theme }) => theme.sizes.component.dropdownMinWidth};
  max-height: var(--radix-dropdown-menu-content-available-height);
`;

const StyledItem = styled(DropdownMenuPrimitive.Item)<{ $danger?: boolean }>`
  ${({ theme }) => popoverItemBase(theme)}

  color: ${({ theme, $danger }) =>
    $danger ? theme.colors.status.danger : theme.colors.text.primary};

  &[data-highlighted] {
    background-color: ${({ theme, $danger }) =>
      $danger ? theme.colors.statusBg.danger : theme.colors.background.hover};
    color: ${({ theme, $danger }) =>
      $danger ? theme.colors.status.danger : theme.colors.text.primary};
  }

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.disabled};
    pointer-events: none;
  }
  & > svg {
    ${({ theme }) => squareIconSize(theme, "sm")}
  }
`;

const StyledSeparator = styled(DropdownMenuPrimitive.Separator)`
  height: ${({ theme }) => theme.sizes.component.dividerThin};
  background-color: ${({ theme }) => theme.colors.border.divider};
  width: 100%;
`;

const StyledLabel = styled(DropdownMenuPrimitive.Label)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.base}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

/**
 * Radix DropdownMenu primitive를 디자인 시스템 스타일로 감싼 compound API입니다.
 *
 * Content, Item, Separator, Label은 theme 토큰과 공통 popover mixin을 사용해
 * 프로젝트 전반의 메뉴 밀도, hover, disabled 표현을 통일합니다.
 */
export const DropdownMenu = {
  Root: DropdownMenuPrimitive.Root,
  Trigger: DropdownMenuPrimitive.Trigger,
  Portal: DropdownMenuPrimitive.Portal,
  Content: StyledContent,
  Item: StyledItem,
  Separator: StyledSeparator,
  Label: StyledLabel,
};
