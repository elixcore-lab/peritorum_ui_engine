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

/**
 * CalendarView가 월 단위 날짜 grid를 렌더링하기 위해 필요한 상태와 이벤트를 정의합니다.
 *
 * 날짜 선택, 범위 선택, 이벤트 표시, 미래 날짜 비활성화 정책은 상위 picker가 주입합니다.
 */
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

/**
 * 현재 월의 날짜 grid를 렌더링하는 calendar 하위 뷰입니다.
 *
 * 날짜 계산은 DateUtils를 사용하고, row layout은 styled wrapper로 분리해 inline style을
 * 사용하지 않습니다.
 */
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
      <S.CalendarGridRow role="row">
        {weekdays.map((weekday, index) => (
          <S.WeekdayText key={`weekday-${index}`} role="columnheader">
            {weekday}
          </S.WeekdayText>
        ))}
      </S.CalendarGridRow>

      {weeks.map((week, weekIndex) => (
        <S.CalendarGridRow key={`week-${weekIndex}`} role="row">
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
        </S.CalendarGridRow>
      ))}
    </S.CalendarGrid>
  );
};
