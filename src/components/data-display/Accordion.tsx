import React, { forwardRef, useState, useMemo, useCallback } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import styled from "@emotion/styled";
import { ChevronDown } from "lucide-react";
import { accordionSlideDown, accordionSlideUp } from "../../styles/animation";
import {
  applyAnimation,
  applyTransition,
  customScrollbar,
  focusRing,
  transitionBase,
} from "../../styles";
import { useUiConfig } from "../../ConfigProvider";
import { resolveDisabled } from "../../utils";

// --- Types ---
export interface AccordionItemData {
  value: string;
  header: React.ReactNode;
  content: React.ReactNode;
  isDisabled?: boolean;
  weight?: number;
  behavior?: "fixed" | "interactive";
  defaultOpen?: boolean;
  fitContent?: boolean;
}

export interface AccordionProps extends Omit<
  AccordionPrimitive.AccordionMultipleProps,
  "type" | "value" | "onValueChange" | "defaultValue"
> {
  items: AccordionItemData[];
}

type AccordionItemBehavior = NonNullable<AccordionItemData["behavior"]>;

const mergeUniqueValues = (first: string[], second: string[]) => {
  const values = new Set<string>();

  for (const value of first) {
    values.add(value);
  }

  for (const value of second) {
    values.add(value);
  }

  return Array.from(values);
};

const getAccordionItemMeta = (items: AccordionItemData[]) => {
  const fixedItemValues: string[] = [];
  const defaultOpenItemValues: string[] = [];
  const itemBehaviorMap = new Map<string, AccordionItemBehavior>();

  for (const item of items) {
    const behavior = item.behavior || "interactive";
    itemBehaviorMap.set(item.value, behavior);

    if (behavior === "fixed") {
      fixedItemValues.push(item.value);
    }

    if (item.defaultOpen) {
      defaultOpenItemValues.push(item.value);
    }
  }

  return {
    fixedItemValues,
    defaultOpenItems: mergeUniqueValues(fixedItemValues, defaultOpenItemValues),
    itemBehaviorMap,
  };
};

// --- Component ---
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, ...rootProps }, ref) => {
    const { t } = useUiConfig();

    const { fixedItemValues, defaultOpenItems, itemBehaviorMap } = useMemo(
      () => getAccordionItemMeta(items),
      [items],
    );

    const [openItems, setOpenItems] = useState<string[]>(
      () => defaultOpenItems,
    );

    const openItemsSet = useMemo(() => new Set(openItems), [openItems]);

    const handleValueChange = useCallback(
      (nextValues: string[]) => {
        const lastAdded = nextValues.find((value) => !openItemsSet.has(value));

        if (!lastAdded) {
          setOpenItems(mergeUniqueValues(nextValues, fixedItemValues));
          return;
        }

        const behavior = itemBehaviorMap.get(lastAdded);

        if (behavior === "fixed") {
          setOpenItems(nextValues);
          return;
        }

        setOpenItems(mergeUniqueValues([lastAdded], fixedItemValues));
      },
      [fixedItemValues, itemBehaviorMap, openItemsSet],
    );

    return (
      <StyledRoot
        ref={ref}
        {...rootProps}
        type="multiple"
        value={openItems}
        onValueChange={handleValueChange}
      >
        {items.map((item) => {
          const isOpen = openItemsSet.has(item.value);
          return (
            <StyledItem
              key={item.value}
              value={item.value}
              disabled={resolveDisabled(item)}
              $weight={item.weight}
              $fitContent={item.fitContent}
            >
              <StyledHeader>
                <StyledTrigger
                  aria-label={t(
                    `ui.component.accordion.action.${
                      isOpen ? "collapse" : "expand"
                    }`,
                  )}
                >
                  {item.header}
                  <StyledChevron
                    className="accordion-chevron"
                    aria-hidden="true"
                    focusable="false"
                  />
                </StyledTrigger>
              </StyledHeader>
              <StyledContent>
                <ContentInner>{item.content}</ContentInner>
              </StyledContent>
            </StyledItem>
          );
        })}
      </StyledRoot>
    );
  },
);

Accordion.displayName = "Accordion";

// --- Styled Components ---
const StyledRoot = styled(AccordionPrimitive.Root)`
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.surface};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.base};
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledItem = styled(AccordionPrimitive.Item, {
  shouldForwardProp: (prop) => prop !== "$weight" && prop !== "$fitContent",
})<{
  $weight?: number;
  $fitContent?: boolean;
}>`
  border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${({ theme }) =>
    applyTransition(
      theme,
      "flex",
      theme.transitions.duration.slow,
      theme.transitions.function.default,
    )}

  &:last-of-type {
    border-bottom: none;
  }

  &[data-state="closed"] {
    flex: 0 0 auto;
  }

  &[data-state="open"] {
    min-height: 0;
    ${({ $fitContent, $weight }) =>
      $fitContent ? `flex: 0 0 auto;` : `flex: ${$weight || 1} 1 0%;`}
  }
`;

const StyledHeader = styled(AccordionPrimitive.Header)`
  all: unset;
  display: flex;
  flex-shrink: 0;
`;

const StyledTrigger = styled(AccordionPrimitive.Trigger)`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;

  ${({ theme }) => transitionBase(theme)}

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  &[data-state="open"] > .accordion-chevron {
    transform: rotate(180deg);
  }

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const StyledChevron = styled(ChevronDown)`
  width: ${({ theme }) => theme.sizes.icon.md};
  height: ${({ theme }) => theme.sizes.icon.md};
  ${({ theme }) =>
    applyTransition(
      theme,
      "transform",
      theme.transitions.duration.normal,
      theme.transitions.function.bounce,
    )}
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StyledContent = styled(AccordionPrimitive.Content)`
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &[data-state="open"] {
    ${({ theme }) =>
      applyAnimation(
        theme,
        accordionSlideDown,
        theme.transitions.duration.slow,
        theme.transitions.function.default,
      )}
  }

  &[data-state="closed"] {
    ${({ theme }) =>
      applyAnimation(
        theme,
        accordionSlideUp,
        theme.transitions.duration.slow,
        theme.transitions.function.easeInOut,
      )}
  }
`;

const ContentInner = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  border-top: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  background-color: ${({ theme }) => theme.colors.background.page};
  padding: ${({ theme }) => theme.spacing.md};
  ${({ theme }) => customScrollbar(theme)}
`;
