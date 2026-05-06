import { useMemo } from "react";
import { useUiConfig } from "../../../ConfigProvider";
import {
  eachDayOfInterval,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  isToday,
  timeToString,
} from "../../../utils/DateUtils";
import { SelectionMode, type CalendarEvent } from "./types";
import * as S from "./styles";

interface CalendarViewProps {
  currentMonth: Date;
  startDate?: Date;
  endDate?: Date;
  selectionMode: SelectionMode;
  disableFuture: boolean;
  weekdays: string[];
  events: CalendarEvent[];
  onSelect: (day: Date) => void;
}

export const CalendarView = ({
  currentMonth,
  startDate,
  endDate,
  selectionMode,
  disableFuture,
  weekdays,
  events,
  onSelect,
}: CalendarViewProps) => {
  const { locale } = useUiConfig();
  const isRangeMode = selectionMode === SelectionMode.range;

  const days = useMemo(() => {
    const start = getStartOfWeek(getStartOfMonth(currentMonth), { locale });
    const end = getEndOfWeek(getEndOfMonth(currentMonth), { locale });
    return eachDayOfInterval(start, end);
  }, [currentMonth, locale]);

  const eventDates = useMemo(
    () =>
      new Set(
        events.map((event) => timeToString(event.date, "yyyy-MM-dd", locale)),
      ),
    [events, locale],
  );

  const todayMidnight = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  return (
    <S.CalendarGrid>
      {weekdays.map((weekday, index) => (
        <S.WeekdayText key={index}>{weekday}</S.WeekdayText>
      ))}

      {days.map((day) => {
        const dateStr = timeToString(day, "yyyy-MM-dd", locale);
        const isRangeStart =
          isRangeMode && startDate != null && isSameDay(day, startDate);
        const isRangeEnd =
          isRangeMode && endDate != null && isSameDay(day, endDate);
        const isSelected = isRangeStart || isRangeEnd;
        const isInRange =
          isRangeMode &&
          startDate != null &&
          endDate != null &&
          isWithinInterval(day, startDate, endDate);
        const isDisabled =
          !isSameMonth(day, currentMonth) ||
          (disableFuture && day > todayMidnight);

        return (
          <S.DayButton
            key={day.toISOString()}
            $selectionMode={selectionMode}
            $isDisabled={isDisabled}
            $isToday={isToday(day)}
            $isSelected={isSelected}
            $isRange={isInRange}
            $isRangeStart={isRangeStart}
            $isRangeEnd={isRangeEnd}
            disabled={isDisabled}
            onClick={isDisabled ? undefined : () => onSelect(day)}
          >
            {day.getDate()}
            {eventDates.has(dateStr) && <S.EventLine />}
          </S.DayButton>
        );
      })}
    </S.CalendarGrid>
  );
};
