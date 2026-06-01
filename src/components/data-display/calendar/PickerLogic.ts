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
    const preserveTime = (
      targetDay: Date,
      fallbackFunc: (d: Date) => Date,
      existingTime?: Date,
    ) => {
      if (!existingTime) return fallbackFunc(targetDay);
      const next = new Date(targetDay);
      next.setHours(
        existingTime.getHours(),
        existingTime.getMinutes(),
        existingTime.getSeconds(),
      );
      return next;
    };

    if (target === "start" || (current.start && current.end)) {
      return {
        start: preserveTime(day, getStartOfDay, current.start), // 기존 start 시간 유지
        end: undefined,
        nextTarget: "end" as const,
      };
    }

    const start = current.start || getStartOfDay(day);
    const candidateEnd = preserveTime(day, getEndOfDay, current.end); // 기존 end 시간 유지

    if (candidateEnd < start) {
      return {
        start: preserveTime(day, getStartOfDay, current.end),
        end: preserveTime(start, getEndOfDay, current.start),
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
