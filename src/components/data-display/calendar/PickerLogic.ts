import {
  getEndOfDay,
  getStartOfDay,
  isSameDay,
} from "../../../utils/DateUtils";

type PickerTarget = "start" | "end";
interface RangeState {
  start?: Date;
  end?: Date;
}

export const PickerStrategy = {
  single: (day: Date, currentStart?: Date) => {
    const next = new Date(day);
    if (currentStart) {
      next.setHours(
        currentStart.getHours(),
        currentStart.getMinutes(),
        currentStart.getSeconds(),
      );
    }
    return { start: next };
  },

  range: (day: Date, current: RangeState, target: PickerTarget) => {
    const selectedDay = getStartOfDay(day);

    if (target === "start" || (current.start && current.end)) {
      return {
        start: selectedDay,
        end: undefined,
        nextTarget: "end" as const,
      };
    }

    const start = current.start ? getStartOfDay(current.start) : selectedDay;
    const candidateEnd = getEndOfDay(day);

    if (candidateEnd < start) {
      return {
        start: selectedDay,
        end: getEndOfDay(start),
        nextTarget: "start" as const,
      };
    }

    return {
      start: current.start!,
      end: candidateEnd,
      nextTarget: "start" as const,
    };
  },
};

export const getFutureLimits = (
  date: Date | undefined,
  disableFuture: boolean,
) => {
  const now = new Date();
  if (!disableFuture || !date || !isSameDay(date, now)) {
    return { h: 23, m: 59, s: 59 };
  }

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const selectedHour = date.getHours();
  const selectedMinute = date.getMinutes();

  return {
    h: currentHour,
    m: selectedHour >= currentHour ? currentMinute : 59,
    s:
      selectedHour > currentHour ||
      (selectedHour === currentHour && selectedMinute >= currentMinute)
        ? currentSecond
        : 59,
  };
};
