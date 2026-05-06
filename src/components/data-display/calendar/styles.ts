import styled from "@emotion/styled";
import { type Theme } from "@emotion/react";
import { squareIconSize } from "../../../styles/componentStyles";
import { customScrollbar, transitionBase } from "../../../styles/utils";
import { SelectionMode } from "./types";

type DayButtonStyleProps = {
  $isSelected?: boolean;
  $isRange?: boolean;
  $isRangeStart?: boolean;
  $isRangeEnd?: boolean;
  $isToday?: boolean;
  $isDisabled?: boolean;
  $selectionMode: SelectionMode;
};

const getDayButtonBorder = ({
  theme,
  $isToday,
  $isSelected,
  $isDisabled,
}: DayButtonStyleProps & { theme: Theme }) =>
  `${theme.sizes.component.dividerThin} solid ${
    $isToday && !$isSelected && !$isDisabled
      ? theme.colors.action.primary
      : theme.colors.utility.transparent
  }`;

const getDayButtonBackground = ({
  theme,
  $isSelected,
  $isRange,
  $isDisabled,
}: DayButtonStyleProps & { theme: Theme }) =>
  $isDisabled
    ? theme.colors.utility.transparent
    : $isSelected
      ? theme.colors.action.primary
      : $isRange
        ? theme.colors.statusBg.info
        : theme.colors.utility.transparent;

const getDayButtonColor = ({
  theme,
  $isSelected,
  $isToday,
  $isDisabled,
}: DayButtonStyleProps & { theme: Theme }) =>
  $isDisabled
    ? theme.colors.text.disabled
    : $isSelected
      ? theme.colors.text.inverse
      : $isToday
        ? theme.colors.action.primary
        : theme.colors.text.primary;

const getDayButtonBorderRadius = ({
  theme,
  $isRangeStart,
  $isRangeEnd,
  $isSelected,
  $selectionMode,
}: DayButtonStyleProps & { theme: Theme }) => {
  if ($selectionMode === SelectionMode.single) {
    return theme.borderRadius.round;
  }

  if ($isRangeStart) {
    return `${theme.borderRadius.round} 0 0 ${theme.borderRadius.round}`;
  }

  if ($isRangeEnd) {
    return `0 ${theme.borderRadius.round} ${theme.borderRadius.round} 0`;
  }

  if ($isSelected) {
    return theme.borderRadius.round;
  }

  return "0";
};

const getDayButtonHoverBackground = ({
  theme,
  $isSelected,
  $isRange,
  $isDisabled,
}: DayButtonStyleProps & { theme: Theme }) =>
  !$isDisabled && !$isSelected && !$isRange
    ? theme.colors.background.hover
    : undefined;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const WeekdayText = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const DayButton = styled.button<DayButtonStyleProps>`
  height: ${({ theme }) => theme.sizes.component.calendarDay};
  width: ${({ $selectionMode, theme }) =>
    $selectionMode === SelectionMode.single
      ? theme.sizes.component.calendarDay
      : "100%"};
  margin: ${({ $selectionMode }) =>
    $selectionMode === SelectionMode.single ? "0 auto" : "0"};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  ${({ theme }) => transitionBase(theme)};
  border: ${getDayButtonBorder};
  background-color: ${getDayButtonBackground};
  color: ${getDayButtonColor};
  border-radius: ${getDayButtonBorderRadius};

  &:hover {
    background-color: ${getDayButtonHoverBackground};
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const HeaderIcon = styled.svg`
  ${({ theme }) => squareIconSize(theme, "sm")}
  flex-shrink: 0;
  color: currentColor;
  stroke-width: ${({ theme }) => theme.sizes.component.dividerMedium};
`;

export const CurrentMonthLabel = styled.span`
  min-width: ${({ theme }) => theme.sizes.component.calendarHeaderLabelWidth};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const FooterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const TimeViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const TimeColumnsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: ${({ theme }) => theme.sizes.component.timeWheelHeight};
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

export const TimeSeparator = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: ${({ theme }) => theme.spacing.base};
`;

export const TimeColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const TimeColumnLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const TimeWheelWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${({ theme }) => theme.sizes.component.timeWheelHeight};
`;

export const TimeWheelContainer = styled.div`
  height: ${({ theme }) => theme.sizes.component.timeWheelHeight};
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ${({ theme }) => customScrollbar(theme)};

  &::-webkit-scrollbar {
    display: none;
  }

  position: relative;
  z-index: 1;
`;

export const HighlightBar = styled.div`
  position: absolute;
  top: ${({ theme }) =>
    `calc((${theme.sizes.component.timeWheelHeight} - ${theme.sizes.component.timeWheelItemHeight}) / 2)`};
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.sizes.component.timeWheelItemHeight};
  background-color: ${({ theme }) => theme.colors.background.hover};
  border-top: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.default};
  border-bottom: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.default};
  z-index: 0;
`;

export const TimeWheelSpacer = styled.div`
  height: ${({ theme }) => theme.sizes.component.timeWheelItemHeight};
`;

export const TimeWheelItem = styled.div<{
  $isActive: boolean;
  $isDisabled: boolean;
}>`
  height: ${({ theme }) => theme.sizes.component.timeWheelItemHeight};
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ $isActive, theme, $isDisabled }) =>
    $isDisabled
      ? theme.colors.text.disabled
      : $isActive
        ? theme.colors.action.primary
        : theme.colors.text.secondary};
  font-weight: ${({ $isActive, theme }) =>
    $isActive ? theme.fontWeights.bold : theme.fontWeights.regular};
  ${({ theme }) => transitionBase(theme)};
`;

export const TabContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.input};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.xs};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
`;

export const TabItem = styled.div<{
  $isActive: boolean;
  $isDisabled?: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.sizes.component.dividerMedium};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ $isActive, theme }) =>
    $isActive
      ? theme.colors.background.surface
      : theme.colors.utility.transparent};
  box-shadow: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.effect.shadow.base : "none"};
  ${({ theme }) => transitionBase(theme)};

  &:hover {
    background-color: ${({ $isActive, $isDisabled, theme }) =>
      !$isActive && !$isDisabled ? theme.colors.background.hover : undefined};
  }
`;

export const TabLabel = styled.span<{ $isActive: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xxs};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.action.primary : theme.colors.text.secondary};
`;

export const TabValue = styled.span<{ $isActive: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ $isActive, theme }) =>
    $isActive ? theme.fontWeights.bold : theme.fontWeights.medium};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
`;

export const TabValueDate = styled.small`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

export const EventLine = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xs};
  width: ${({ theme }) => theme.sizes.component.eventLineWidth};
  height: ${({ theme }) => theme.sizes.component.dividerMedium};
  background-color: ${({ theme }) => theme.colors.status.danger};
  border-radius: ${({ theme }) => theme.borderRadius.round};
`;

export const HorizontalSplit = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.sizes.component.dividerMedium};
  background-color: ${({ theme }) => theme.colors.border.divider};
`;
