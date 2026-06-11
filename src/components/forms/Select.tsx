import React, { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import styled from "@emotion/styled";
import { css, useTheme } from "@emotion/react";
import { ChevronDown, Check, XCircle } from "lucide-react";
import { type ControlSize, type FontSize } from "../../styles/types";
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

/**
 * Select에서 렌더링할 단일 옵션 모델입니다.
 */
export interface SelectItemData {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

/**
 * Select 옵션을 그룹으로 묶기 위한 모델입니다.
 */
export interface SelectGroupData {
  groupLabel: string;
  items: SelectItemData[];
}

export type SelectOption = SelectItemData | SelectGroupData;

/**
 * Select의 값, 옵션 목록, 상태, clear action, 크기 토큰을 정의합니다.
 */
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
  fontSize?: FontSize;
  isError?: boolean;
  onChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  onClear?: () => void;
}

const isGroupData = (opt: SelectOption): opt is SelectGroupData => {
  return "groupLabel" in opt;
};

/**
 * Radix Select를 기반으로 한 단일 선택 form control입니다.
 *
 * 그룹 옵션, clear button, loading indicator, icon slot을 지원하며 theme token 기반
 * popover 스타일을 공유합니다.
 */
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
      fontSize,
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
          <ActionIconWrapper $size={size}>
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
            $fontSize={fontSize}
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
                <Spinner
                  size={size === "xs" || size === "sm" ? "xs" : "sm"}
                  color="currentColor"
                />
              ) : (
                <SelectPrimitive.Icon asChild>
                  <ActionIconWrapper $size={size}>
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
            <ActionIconWrapper $size={size}>
              <XCircle />
            </ActionIconWrapper>
          </ClearButton>
        )}
      </SelectWrapper>
    );
  },
);

Select.displayName = "Select";

// ==========================================
// Styled Components
// ==========================================

const wrapperFilter = {
  shouldForwardProp: (prop: string) => !["$fullWidth"].includes(prop),
};
const triggerFilter = {
  shouldForwardProp: (prop: string) =>
    !["$inputSize", "$fontSize", "$isError", "$hasClearBtn"].includes(prop),
};
const iconFilter = {
  shouldForwardProp: (prop: string) => !["$size"].includes(prop),
};

const SelectWrapper = styled("div", wrapperFilter)<{ $fullWidth?: string }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: ${({ $fullWidth }) => $fullWidth || "100%"};
`;

const SelectTrigger = styled(SelectPrimitive.Trigger, triggerFilter)<{
  $inputSize: ControlSize | (string & {});
  $fontSize?: FontSize | (string & {});
  $isError?: boolean;
  $hasClearBtn?: boolean;
}>`
  ${({ theme, $isError }) => formControlBase(theme, $isError)}

  ${({ theme, $inputSize, $fontSize }) =>
    controlSizeBase(theme, $inputSize as ControlSize, $fontSize)}

  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  padding-right: ${({ theme, $inputSize, $hasClearBtn }) => {
    const iconArea =
      theme.sizes.control[$inputSize as keyof typeof theme.sizes.control] ||
      $inputSize;
    return $hasClearBtn ? `calc(${iconArea} * 1.5)` : iconArea;
  }};

  &[data-placeholder] {
    color: ${({ theme }) => theme.colors.text.disabled};
  }

  ${({ theme }) => disabledState(theme)}
`;

const ActionIconWrapper = styled("span", iconFilter)<{
  $size?: ControlSize | (string & {});
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > svg {
    ${({ theme, $size }) =>
      squareIconSize(theme, $size === "xs" || $size === "sm" ? "xs" : "sm")}
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
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.none};

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
  min-width: ${({ theme }) => theme.spacing.none};
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
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const IconSlot = styled.span`
  ${flexCenter}
`;

const ClearButton = styled.button<{ $inputSize: ControlSize | (string & {}) }>`
  ${resetButton}
  ${flexCenter}
  position: absolute;
  top: ${({ theme }) => theme.spacing.none};

  right: ${({ theme, $inputSize }) =>
    theme.sizes.control[$inputSize as keyof typeof theme.sizes.control] ||
    $inputSize};

  width: ${({ theme, $inputSize }) =>
    theme.sizes.control[$inputSize as keyof typeof theme.sizes.control] ||
    $inputSize};
  height: 100%;

  color: ${({ theme }) => theme.colors.text.disabled};
  z-index: 1;

  ${({ theme }) => interactiveTextColor(theme)}
`;
