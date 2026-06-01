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
  formatDate,
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

  const weeks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < days.length; i += 7) {
      chunks.push(days.slice(i, i + 7));
    }
    return chunks;
  }, [days]);

  const eventDates = useMemo(
    () =>
      new Set(
        events.map((event) => formatDate(event.date, "yyyy-MM-dd", locale)),
      ),
    [events, locale],
  );

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  return (
    <S.CalendarGrid role="grid">
      <div role="row" style={{ display: "contents" }}>
        {weekdays.map((weekday, index) => (
          <S.WeekdayText key={`weekday-${index}`} role="columnheader">
            {weekday}
          </S.WeekdayText>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div
          key={`week-${weekIndex}`}
          role="row"
          style={{ display: "contents" }}
        >
          {week.map((day) => {
            const dateStr = formatDate(day, "yyyy-MM-dd", locale);
            const fullDateAria = formatDate(day, "yyyy MMMM d", locale);

            const isRangeStart =
              isRangeMode && startDate != null && isSameDay(day, startDate);
            const isRangeEnd =
              isRangeMode && endDate != null && isSameDay(day, endDate);
            const isSelected =
              isRangeStart ||
              isRangeEnd ||
              (!isRangeMode && startDate != null && isSameDay(day, startDate));
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
                role="gridcell"
                aria-label={fullDateAria}
                aria-selected={isSelected || isInRange}
                aria-current={isToday(day) ? "date" : undefined}
                aria-disabled={isDisabled}
                $selectionMode={selectionMode}
                $isDisabled={isDisabled}
                $isToday={isToday(day)}
                $isSelected={isSelected}
                $isRange={isInRange}
                $isRangeStart={isRangeStart}
                $isRangeEnd={isRangeEnd}
                onClick={isDisabled ? undefined : () => onSelect(day)}
              >
                <span aria-hidden="true">{day.getDate()}</span>
                {eventDates.has(dateStr) && <S.EventLine />}
              </S.DayButton>
            );
          })}
        </div>
      ))}
    </S.CalendarGrid>
  );
};
