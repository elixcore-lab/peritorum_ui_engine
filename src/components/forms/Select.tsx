import React, { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";
import { ChevronDown, Check, XCircle } from "lucide-react";
import { type ControlSize } from "../../styles/types";
import {
  customScrollbar,
  formControlBase,
  controlSizeBase,
  disabledState,
  flexCenter,
  resetButton,
  squareIconSize,
  textEllipsis,
  interactiveTextColor,
  popoverContentBase,
  popoverItemBase,
} from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";
import { resolveDisabled } from "../../utils";
import { Spinner } from "../feedback/Spinner";

export interface SelectItemData {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface SelectGroupData {
  groupLabel: string;
  items: SelectItemData[];
}

export type SelectOption = SelectItemData | SelectGroupData;

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  clearable?: boolean;
  width?: string;
  icon?: React.ReactNode;
  size?: ControlSize;
  isError?: boolean;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onClear?: () => void;
}

const isGroupData = (opt: SelectOption): opt is SelectGroupData => {
  return "groupLabel" in opt;
};

const filterProps = {
  shouldForwardProp: (prop: string) =>
    !["$inputSize", "$isError", "$fullWidth", "$hasClearBtn"].includes(prop),
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      options,
      placeholder,
      disabled,
      isLoading = false,
      clearable = false,
      width,
      icon,
      size = "md",
      isError = false,
      onChange,
      onOpenChange,
      onClear,
    },
    ref,
  ) => {
    const { t } = useUiConfig();
    const theme = useTheme();
    const resolvedPlaceholder =
      placeholder ?? t("ui.component.select.placeholder");
    const trulyDisabled = resolveDisabled({ disabled, loading: isLoading });

    const hasValue = value !== undefined && value !== "";
    const showClearBtn = clearable && hasValue && !trulyDisabled;

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClear) onClear();
    };

    const renderItem = (item: SelectItemData) => (
      <SelectItem key={item.value} value={item.value}>
        <ItemContentWrapper>
          {item.icon && <IconSlot>{item.icon}</IconSlot>}
          <ItemTextLayout>
            <ItemLabel>{item.label}</ItemLabel>
            {item.description && (
              <ItemDescription>{item.description}</ItemDescription>
            )}
          </ItemTextLayout>
        </ItemContentWrapper>
        <SelectPrimitive.ItemIndicator>
          <ActionIconWrapper>
            <Check />
          </ActionIconWrapper>
        </SelectPrimitive.ItemIndicator>
      </SelectItem>
    );

    return (
      <SelectWrapper $fullWidth={width}>
        <SelectPrimitive.Root
          value={value}
          defaultValue={defaultValue}
          onValueChange={onChange}
          onOpenChange={onOpenChange}
          disabled={trulyDisabled}
        >
          <SelectTrigger
            ref={ref}
            $inputSize={size}
            $isError={isError}
            $hasClearBtn={showClearBtn}
            aria-invalid={isError}
          >
            <ValueContent>
              {icon && <IconSlot>{icon}</IconSlot>}
              <SelectPrimitive.Value placeholder={resolvedPlaceholder} />
            </ValueContent>

            <RightSlot>
              {isLoading ? (
                <Spinner size="sm" color="currentColor" />
              ) : (
                <SelectPrimitive.Icon asChild>
                  <ActionIconWrapper>
                    <ChevronDown />
                  </ActionIconWrapper>
                </SelectPrimitive.Icon>
              )}
            </RightSlot>
          </SelectTrigger>

          <SelectPrimitive.Portal>
            <SelectContent
              position="popper"
              sideOffset={theme.sizes.offset.popover}
            >
              <SelectViewport>
                {options.map((opt, index) =>
                  isGroupData(opt) ? (
                    <SelectGroup key={`group-${index}`}>
                      <SelectGroupLabel>{opt.groupLabel}</SelectGroupLabel>
                      {opt.items.map(renderItem)}
                    </SelectGroup>
                  ) : (
                    renderItem(opt)
                  ),
                )}
              </SelectViewport>
            </SelectContent>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

        {showClearBtn && (
          <ClearButton
            type="button"
            onClick={handleClear}
            aria-label={t("common.clear")}
            $inputSize={size}
          >
            <ActionIconWrapper>
              <XCircle />
            </ActionIconWrapper>
          </ClearButton>
        )}
      </SelectWrapper>
    );
  },
);

Select.displayName = "Select";

const SelectWrapper = styled.div<{ $fullWidth?: string }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $fullWidth }) => $fullWidth || "100%"};
`;

const SelectTrigger = styled(SelectPrimitive.Trigger, filterProps)<{
  $inputSize: ControlSize;
  $isError?: boolean;
  $hasClearBtn?: boolean;
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}
  ${({ theme, $inputSize }) => controlSizeBase(theme, $inputSize)}

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  ${({ theme, $hasClearBtn }) =>
    $hasClearBtn &&
    css`
      padding-right: calc(${theme.spacing.xl} + ${theme.spacing.sm});
    `}

  &[data-placeholder] {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  &[data-disabled] {
    ${({ theme }) => disabledState(theme)}
  }
`;

const ActionIconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > svg {
    ${({ theme }) => squareIconSize(theme, "sm")}
    flex-shrink: 0;
  }
`;

const SelectContent = styled(SelectPrimitive.Content)`
  ${({ theme }) => popoverContentBase(theme)}
  overflow: hidden;
`;

const SelectViewport = styled(SelectPrimitive.Viewport)`
  padding: ${({ theme }) => theme.spacing.xs};
  max-height: ${({ theme }) => theme.sizes.component.selectViewportMaxHeight};
  ${({ theme }) => customScrollbar(theme)}
`;

const SelectGroup = styled(SelectPrimitive.Group)`
  padding: ${({ theme }) => theme.spacing.xs} 0;

  &:not(:last-child) {
    border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
      ${({ theme }) => theme.colors.border.divider};
  }
`;

const SelectGroupLabel = styled(SelectPrimitive.Label)`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.base}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SelectItem = styled(SelectPrimitive.Item)`
  all: unset;
  ${({ theme }) => popoverItemBase(theme)}
`;

const ItemContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  min-width: 0;
`;

const ItemTextLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing["2xs"]};
  overflow: hidden;
`;

const ItemLabel = styled(SelectPrimitive.ItemText)`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  ${textEllipsis}
`;

const ItemDescription = styled.span`
  font-size: ${({ theme }) => theme.fontSizes["2xs"]};
  color: ${({ theme }) => theme.colors.text.secondary};
  ${textEllipsis}
`;

const ValueContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
  flex: 1;
`;

const RightSlot = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const IconSlot = styled.span`
  ${flexCenter}
`;

const ClearButton = styled.button<{ $inputSize: ControlSize }>`
  ${resetButton}
  ${flexCenter}
  position: absolute;

  right: ${({ theme, $inputSize }) =>
    $inputSize === "lg" ? theme.spacing.xl : theme.spacing.lg};

  color: ${({ theme }) => theme.colors.text.disabled};
  z-index: 1;

  ${({ theme }) => interactiveTextColor(theme)}
`;
