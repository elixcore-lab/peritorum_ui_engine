import styled from "@emotion/styled";
import { css, type Theme } from "@emotion/react";
import {
  customScrollbar,
  flexCenter,
  transitionBase,
} from "../../../styles/mixins";
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

// --- Calendar Grid Styles ---

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const CalendarGridRow = styled.div`
  display: contents;
`;

export const WeekdayText = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const DayButton = styled.button<DayButtonStyleProps>`
  all: unset;
  box-sizing: border-box;
  position: relative;
  ${flexCenter}

  height: ${({ theme }) => theme.sizes.component.calendarDay};
  width: ${({ $selectionMode, theme }) =>
    $selectionMode === SelectionMode.single
      ? theme.sizes.component.calendarDay
      : "100%"};
  justify-self: ${({ $selectionMode }) =>
    $selectionMode === SelectionMode.single ? "center" : "stretch"};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  ${({ theme }) => transitionBase(theme)};

  /* 기본 상태 */
  background-color: ${({ theme }) => theme.colors.utility.transparent};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.utility.transparent};
  border-radius: ${({ $selectionMode, theme }) =>
    $selectionMode === SelectionMode.single
      ? theme.borderRadius.round
      : theme.spacing.none};

  /* 오늘(Today) 상태 */
  ${({ $isToday, theme }) =>
    $isToday &&
    css`
      border-color: ${theme.colors.action.primary};
      color: ${theme.colors.action.primary};
    `}

  /* 호버 상태 */
  &:hover {
    background-color: ${({ $isDisabled, $isSelected, $isRange, theme }) =>
      !$isDisabled && !$isSelected && !$isRange
        ? theme.colors.background.hover
        : theme.colors.utility.transparent};
  }

  /* 비활성화 상태 */
  ${({ $isDisabled, theme }) =>
    $isDisabled &&
    css`
      color: ${theme.colors.text.disabled};
      border-color: ${theme.colors.utility.transparent};
    `}

  /* 범위(Range) 포함 상태 */
  ${({ $isRange, theme }) =>
    $isRange &&
    css`
      background-color: ${theme.colors.statusBg.info};
    `}

  /* 선택(Selected/RangeStart/RangeEnd) 상태 */
  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      background-color: ${theme.colors.action.primary};
      color: ${theme.colors.text.inverse};
      border-color: ${theme.colors.utility.transparent};
      border-radius: ${theme.borderRadius.round};
    `}

  /* Range 둥근 모서리 처리 */
  ${({ $isRangeStart, theme }) =>
    $isRangeStart &&
    css`
      border-radius: ${theme.borderRadius.round} ${theme.spacing.none}
        ${theme.spacing.none} ${theme.borderRadius.round};
    `}
  ${({ $isRangeEnd, theme }) =>
    $isRangeEnd &&
    css`
      border-radius: ${theme.spacing.none} ${theme.borderRadius.round}
        ${theme.borderRadius.round} ${theme.spacing.none};
    `}
`;

export const EventLine = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xs};
  width: ${({ theme }) => theme.sizes.component.eventLineWidth};
  height: ${({ theme }) => theme.sizes.component.dividerMedium};
  background-color: ${({ theme }) => theme.colors.status.danger};
  border-radius: ${({ theme }) => theme.borderRadius.round};
`;

export const CurrentMonthLabel = styled.span`
  min-width: ${({ theme }) => theme.sizes.component.calendarHeaderLabelWidth};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// --- Time View Styles ---

export const TimeViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
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
  -ms-overflow-style: none;
  scrollbar-width: none;
  ${({ theme }) => customScrollbar(theme)};

  /* 💡 CSS scroll-behavior: smooth 삭제! JS의 scrollTo와 충돌 방지 */

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
  left: ${({ theme }) => theme.spacing.none};
  right: ${({ theme }) => theme.spacing.none};
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

// --- Tab Styles (For Range Selection) ---

export const TabContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.input};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
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
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.none}`};
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
  font-size: ${({ theme }) => theme.fontSizes["2xs"]};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.action.primary : theme.colors.text.secondary};
`;

export const TabValue = styled.span<{ $isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ $isActive, theme }) =>
    $isActive ? theme.fontWeights.bold : theme.fontWeights.medium};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
`;

export const TabValueDate = styled.small`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
