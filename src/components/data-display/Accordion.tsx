import React, { forwardRef, useState, useMemo, useCallback } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { ChevronDown } from "lucide-react";
import { accordionSlideDown, accordionSlideUp } from "../../styles/animation";
import {
  applyAnimation,
  applyTransition,
  customScrollbar,
  focusRing,
  transitionBase,
  disabledState,
  squareIconSize,
  textEllipsis,
} from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";
import { resolveDisabled } from "../../utils";

export interface AccordionItemData {
  value: string;
  header: React.ReactNode;
  content: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightBadge?: React.ReactNode;
  disabled?: boolean;
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
  variant?: "joined" | "separated";
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

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, variant = "joined", ...rootProps }, ref) => {
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
      <AccordionRoot
        ref={ref}
        type="multiple"
        value={openItems}
        onValueChange={handleValueChange}
        $variant={variant}
        {...rootProps}
      >
        {items.map((item) => {
          const isOpen = openItemsSet.has(item.value);
          const trulyDisabled = resolveDisabled({ disabled: item.disabled });

          return (
            <AccordionItem
              key={item.value}
              value={item.value}
              disabled={trulyDisabled}
              $variant={variant}
              $weight={item.weight}
              $fitContent={item.fitContent}
            >
              <AccordionHeader>
                <AccordionTrigger
                  aria-label={t(
                    `ui.component.accordion.action.${
                      isOpen ? "collapse" : "expand"
                    }`,
                  )}
                >
                  <TriggerContent>
                    {item.leftIcon && (
                      <TriggerIcon>{item.leftIcon}</TriggerIcon>
                    )}
                    {item.header}
                  </TriggerContent>

                  <TriggerAccessory>
                    {item.rightBadge && (
                      <BadgeWrapper>{item.rightBadge}</BadgeWrapper>
                    )}
                    <StyledChevron
                      className="accordion-chevron"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </TriggerAccessory>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <ContentInner $variant={variant}>{item.content}</ContentInner>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </AccordionRoot>
    );
  },
);

Accordion.displayName = "Accordion";

const AccordionRoot = styled(AccordionPrimitive.Root)<{
  $variant: NonNullable<AccordionProps["variant"]>;
}>`
  display: flex;
  flex-direction: column;
  height: 100%;

  ${({ theme, $variant }) =>
    $variant === "joined"
      ? css`
          border: ${theme.sizes.component.dividerThin} solid
            ${theme.colors.border.divider};
          border-radius: ${theme.borderRadius.md};
          background-color: ${theme.colors.background.surface};
          box-shadow: ${theme.colors.effect.shadow.base};
          overflow: hidden;
        `
      : css`
          gap: ${theme.spacing.sm};
          background-color: transparent;
        `}
`;

const AccordionItem = styled(AccordionPrimitive.Item, {
  shouldForwardProp: (prop) =>
    prop !== "$weight" && prop !== "$fitContent" && prop !== "$variant",
})<{
  $variant: NonNullable<AccordionProps["variant"]>;
  $weight?: number;
  $fitContent?: boolean;
}>`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${({ theme }) =>
    applyTransition(
      theme,
      "flex, box-shadow",
      theme.transitions.duration.slow,
      theme.transitions.function.default,
    )}

  ${({ theme, $variant }) =>
    $variant === "joined"
      ? css`
          border-bottom: ${theme.sizes.component.dividerThin} solid
            ${theme.colors.border.divider};
          &:last-of-type {
            border-bottom: none;
          }
        `
      : css`
          border: ${theme.sizes.component.dividerThin} solid
            ${theme.colors.border.divider};
          border-radius: ${theme.borderRadius.md};
          background-color: ${theme.colors.background.surface};
          box-shadow: ${theme.colors.effect.shadow.sm};
        `}

  &[data-state="closed"] {
    flex: 0 0 auto;
  }

  &[data-state="open"] {
    min-height: 0;
    ${({ $fitContent, $weight }) =>
      $fitContent ? `flex: 0 0 auto;` : `flex: ${$weight || 1} 1 0%;`}
  }
`;

const AccordionHeader = styled(AccordionPrimitive.Header)`
  all: unset;
  display: flex;
  flex-shrink: 0;
`;

const AccordionTrigger = styled(AccordionPrimitive.Trigger)`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;

  ${({ theme }) => transitionBase(theme)}

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  &[data-state="open"] > div > .accordion-chevron {
    transform: rotate(180deg);
  }

  ${({ theme }) => disabledState(theme)}

  &[data-disabled] {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`;

const TriggerContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  flex: 1;
  min-width: 0;
  ${textEllipsis}
`;

const TriggerIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};

  & > svg {
    ${({ theme }) => squareIconSize(theme, "md")}
  }
`;

const TriggerAccessory = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const BadgeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledChevron = styled(ChevronDown)`
  ${({ theme }) => squareIconSize(theme, "md")}
  color: ${({ theme }) => theme.colors.text.secondary};

  ${({ theme }) =>
    applyTransition(
      theme,
      "transform",
      theme.transitions.duration.normal,
      theme.transitions.function.bounce,
    )}
`;

const AccordionContent = styled(AccordionPrimitive.Content)`
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

const ContentInner = styled.div<{
  $variant: NonNullable<AccordionProps["variant"]>;
}>`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding: ${({ theme }) => theme.spacing.md};

  ${({ theme, $variant }) =>
    $variant === "joined"
      ? css`
          border-top: ${theme.sizes.component.dividerThin} solid
            ${theme.colors.border.divider};
          background-color: ${theme.colors.background.page};
        `
      : css`
          border-top: ${theme.sizes.component.dividerThin} dashed
            ${theme.colors.border.default};
          background-color: transparent;
        `}

  ${({ theme }) => customScrollbar(theme)}
`;
