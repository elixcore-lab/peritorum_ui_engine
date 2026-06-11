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
      $danger
        ? `${theme.colors.status.danger}1A`
        : theme.colors.background.hover};
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
  margin: ${({ theme }) => theme.spacing.xs} -${({ theme }) => theme.spacing.xs};
`;

const StyledLabel = styled(DropdownMenuPrimitive.Label)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.base}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const DropdownMenu = {
  Root: DropdownMenuPrimitive.Root,
  Trigger: DropdownMenuPrimitive.Trigger,
  Portal: DropdownMenuPrimitive.Portal,
  Content: StyledContent,
  Item: StyledItem,
  Separator: StyledSeparator,
  Label: StyledLabel,
};
