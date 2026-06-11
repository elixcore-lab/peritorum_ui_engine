import React, { forwardRef, useMemo } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { fadeIn } from "../../styles/animation";
import {
  activeTabUnderline,
  applyAnimation,
  applyTransition,
  customScrollbar,
  disabledState,
  focusRing,
  textEllipsis,
  squareIconSize,
} from "../../styles";
import { resolveDisabled } from "../../utils";

// --- Types ---

export type TabLayoutMode = "fit" | "scroll" | "fixed";

/**
 * Tabs에서 렌더링할 단일 tab의 식별자, 라벨, 아이콘, 콘텐츠를 정의합니다.
 *
 * id는 Radix value로 사용되며, disabled 상태는 `resolveDisabled`를 거쳐 trigger에
 * 전달됩니다.
 */
export interface TabItem {
  id: string;
  label?: string | React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  content: React.ReactNode;
}

/**
 * Tabs root의 제어/비제어 값과 레이아웃 모드를 정의합니다.
 *
 * Radix Tabs 속성을 상속하되, items 기반 렌더링을 보장하기 위해 value 관련 핵심
 * props는 디자인 시스템 API로 재정의합니다.
 */
export interface TabsProps extends Omit<
  TabsPrimitive.TabsProps,
  "defaultValue" | "value" | "onValueChange"
> {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  layoutMode?: TabLayoutMode;
  fixedWidth?: string;
  keepAlive?: boolean;
}

// --- Component ---

/**
 * 화면 안에서 관련 콘텐츠 패널을 전환하는 Radix 기반 Tabs 컴포넌트입니다.
 *
 * fit, scroll, fixed 레이아웃을 지원하고, 비활성 탭의 mount 정책은 keepAlive로
 * 제어합니다.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      defaultValue,
      value,
      onValueChange,
      className,
      layoutMode = "fit",
      fixedWidth,
      keepAlive = true,
      ...props
    },
    ref,
  ) => {
    if (!items.length) return null;

    const initialValue = useMemo(
      () => defaultValue || items[0].id,
      [defaultValue, items],
    );

    return (
      <StyledTabsRoot
        ref={ref}
        className={className}
        defaultValue={value === undefined ? initialValue : undefined}
        value={value}
        onValueChange={onValueChange}
        {...props}
      >
        <StyledTabsList $layoutMode={layoutMode}>
          {items.map((item) => (
            <StyledTabsTrigger
              key={item.id}
              value={item.id}
              disabled={resolveDisabled({ disabled: item.disabled })}
              $layoutMode={layoutMode}
              $fixedWidth={fixedWidth}
              title={typeof item.label === "string" ? item.label : undefined}
            >
              {item.icon && <TabIcon>{item.icon}</TabIcon>}

              {layoutMode === "scroll" ? (
                <span>{item.label}</span>
              ) : (
                <TabLabel>{item.label}</TabLabel>
              )}
            </StyledTabsTrigger>
          ))}
        </StyledTabsList>

        {items.map((item) => (
          <StyledTabsContent
            key={item.id}
            value={item.id}
            forceMount={keepAlive ? true : undefined}
          >
            {item.content}
          </StyledTabsContent>
        ))}
      </StyledTabsRoot>
    );
  },
);

Tabs.displayName = "Tabs";

// --- Styled Components ---

const StyledTabsRoot = styled(TabsPrimitive.Root)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.surface};
  overflow: hidden;
`;

const StyledTabsList = styled(TabsPrimitive.List)<{
  $layoutMode: TabLayoutMode;
}>`
  display: flex;
  width: 100%;
  border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  padding: 0;
  list-style: none;
  background-color: ${({ theme }) => theme.colors.background.surface};

  ${({ $layoutMode, theme }) =>
    $layoutMode === "scroll"
      ? css`
          overflow-x: auto;
          flex-wrap: nowrap;
          scrollbar-width: none;

          &::-webkit-scrollbar {
            width: ${theme.spacing.none};
            height: ${theme.spacing.none};
            background: ${theme.colors.utility.transparent};
          }
        `
      : css`
          overflow-x: hidden;
        `}
`;

const StyledTabsTrigger = styled(TabsPrimitive.Trigger)<{
  $layoutMode: TabLayoutMode;
  $fixedWidth?: string;
}>`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.base};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  background-color: ${({ theme }) => theme.colors.utility.transparent};

  ${({ theme }) =>
    applyTransition(
      theme,
      "background-color, color, box-shadow, transform",
      theme.transitions.duration.normal,
      theme.transitions.function.easeInOut,
    )}

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  ${({ $layoutMode, $fixedWidth, theme }) => {
    switch ($layoutMode) {
      case "fit":
        return css`
          flex: 1;
          min-width: 0;
        `;
      case "fixed":
        return css`
          flex: none;
          width: ${$fixedWidth || theme.sizes.component.tabFixedWidth};
          min-width: 0;
        `;
      default:
        return css`
          flex: none;
          white-space: nowrap;
        `;
    }
  }}

  &:hover:not([data-disabled]) {
    background-color: ${({ theme }) => theme.colors.background.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &[data-state="active"] {
    color: ${({ theme }) => theme.colors.brand.cyan};
    background-color: ${({ theme }) => theme.colors.statusBg.info};
    ${({ theme }) => activeTabUnderline(theme)}
  }

  ${({ theme }) => disabledState(theme)}
`;

const TabLabel = styled.span`
  display: block;
  ${textEllipsis}
`;

const TabIcon = styled.span`
  display: flex;

  & > svg {
    ${({ theme }) => squareIconSize(theme, "sm")}
  }
`;

const StyledTabsContent = styled(TabsPrimitive.Content)`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
  outline: none;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.page};
  ${({ theme }) => customScrollbar(theme)}

  &[data-state="inactive"] {
    display: none;
  }

  &[data-state="active"] {
    ${({ theme }) =>
      applyAnimation(
        theme,
        fadeIn,
        theme.transitions.duration.normal,
        theme.transitions.function.easeInOut,
      )}
  }
`;
