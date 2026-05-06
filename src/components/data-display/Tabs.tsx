import React, { useMemo } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { fadeIn } from "../../styles/animation";
import {
  activeTabUnderline,
  applyAnimation,
  applyTransition,
  customScrollbar,
  focusRing,
  textEllipsis,
} from "../../styles";
import { resolveDisabled } from "../../utils";

// --- Types ---

export type TabLayoutMode = "fit" | "scroll" | "fixed";

export interface TabItem {
  id: string;
  label?: string | React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
  isDisabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
  layoutMode?: TabLayoutMode;
  fixedWidth?: string;
  keepAlive?: boolean;
}
// --- Component ---

export const Tabs = ({
  items,
  defaultValue,
  className,
  layoutMode = "fit",
  fixedWidth,
  keepAlive = true,
}: TabsProps) => {
  if (!items.length) return null;

  const initialValue = useMemo(
    () => defaultValue || items[0].id,
    [defaultValue, items],
  );

  return (
    <StyledTabsRoot className={className} defaultValue={initialValue}>
      <StyledTabsList layoutMode={layoutMode}>
        {items.map((item) => (
          <StyledTabsTrigger
            key={item.id}
            value={item.id}
            disabled={resolveDisabled(item)}
            layoutMode={layoutMode}
            fixedWidth={fixedWidth}
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
};

// --- Styled Components ---

const StyledTabsRoot = styled(TabsPrimitive.Root)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.surface};
  overflow: hidden;
`;

const StyledTabsList = styled(TabsPrimitive.List, {
  shouldForwardProp: (prop) => prop !== "layoutMode",
})<{
  layoutMode: TabLayoutMode;
}>`
  display: flex;
  width: 100%;
  border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: ${({ theme }) => theme.colors.background.surface};

  ${({ layoutMode, theme }) =>
    layoutMode === "scroll"
      ? css`
          overflow-x: auto;
          flex-wrap: nowrap;
          scrollbar-width: none;

          &::-webkit-scrollbar {
            width: 0;
            height: 0;
            background: ${theme.colors.utility.transparent};
          }
        `
      : css`
          overflow-x: hidden;
        `}
`;

const StyledTabsTrigger = styled(TabsPrimitive.Trigger, {
  shouldForwardProp: (prop) => prop !== "layoutMode" && prop !== "fixedWidth",
})<{
  layoutMode: TabLayoutMode;
  fixedWidth?: string;
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

  ${({ layoutMode, fixedWidth, theme }) => {
    switch (layoutMode) {
      case "fit":
        return css`
          flex: 1;
          min-width: 0;
        `;
      case "fixed":
        return css`
          flex: none;
          width: ${fixedWidth || theme.sizes.component.tabFixedWidth};
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

  &[data-disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// 텍스트 말줄임 처리를 위한 내부 span
const TabLabel = styled.span`
  display: block;
  ${textEllipsis}
`;

const TabIcon = styled.span`
  display: flex;
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
