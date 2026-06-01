export type DateInput = Date | number | string;

interface LocaleWeekInfo {
  firstDay: number;
  weekend: number[];
  minimalDays: number;
}

interface ExtendedLocale extends Intl.Locale {
  weekInfo?: LocaleWeekInfo;
}

/**
 * 입력을 Date 객체로 안전하게 변환하는 헬퍼 함수
 */
export const toDate = (date: DateInput): Date => {
  const parsedDate = new Date(date);

  // 🚀 방어 로직: 유효하지 않은 날짜 값이 들어오면 현재 시간(또는 null) 반환
  if (isNaN(parsedDate.getTime())) {
    console.warn(`[DateUtils] Invalid date input: ${date}`);
    return new Date(); // 프로젝트 정책에 따라 null을 던질 수도 있습니다.
  }

  return parsedDate;
};

/**
 * 명시적으로 전달받은 locale을 기반으로 주 시작 요일을 반환
 * @param localeStr "en", "ko" 등의 언어 코드 (기본값: "en")
 * @returns {number} 0: 일요일, 1: 월요일, ..., 6: 토요일
 */
export const getLocaleWeekStartsOn = (
  localeStr: string = "en",
): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
  try {
    const locale = new Intl.Locale(localeStr);
    const weekInfo = (locale as ExtendedLocale).weekInfo;

    return ((weekInfo?.firstDay ?? 0) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  } catch {
    return 0; // 에러 발생 시 일요일 시작으로 간주
  }
};

interface WeekOptions {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
}

/**
 * 주어진 날짜의 시작 시간(00:00:00)을 반환
 */
export const getStartOfDay = (date: DateInput): Date => {
  const d = toDate(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * 주어진 날짜의 마지막 시간(23:59:59.999)을 반환
 */
export const getEndOfDay = (date: DateInput): Date => {
  const d = toDate(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * 주어진 날짜가 속한 주의 시작일 계산
 */
export const getStartOfWeek = (
  date: DateInput,
  options?: WeekOptions,
): Date => {
  const weekStartsOn =
    options?.weekStartsOn ?? getLocaleWeekStartsOn(options?.locale);
  const d = getStartOfDay(date);
  const day = d.getDay();
  const diff = (day - weekStartsOn + 7) % 7;

  d.setDate(d.getDate() - diff);
  return d;
};

/**
 * 주어진 날짜가 속한 주의 마지막일 계산
 */
export const getEndOfWeek = (date: DateInput, options?: WeekOptions): Date => {
  const d = getStartOfWeek(date, options);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * 주어진 날짜가 속한 월의 시작일 반환
 */
export const getStartOfMonth = (date: DateInput): Date => {
  const d = toDate(date);
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
};

/**
 * 주어진 날짜가 속한 월의 마지막일 반환
 */
export const getEndOfMonth = (date: DateInput): Date => {
  const d = toDate(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * 월 더하기
 */
export const addMonths = (date: DateInput, amount: number): Date => {
  const d = toDate(date);
  const targetMonth = d.getMonth() + amount;
  const targetDate = d.getDate();

  d.setMonth(targetMonth);

  // 만약 1월 31일 + 1달 = 2월 31일(-> 3월 2일/3일)로 계산되었다면
  // 달이 한 번 더 넘어가 버린 것이므로, 이전 달의 마지막 날로 맞춥니다.
  if (d.getMonth() !== ((targetMonth % 12) + 12) % 12) {
    d.setDate(0);
  }

  return d;
};

/**
 * 월 빼기
 */
export const subMonths = (date: DateInput, amount: number): Date => {
  return addMonths(date, -amount);
};

/**
 * 일 더하기
 */
export const addDays = (date: DateInput, amount: number): Date => {
  const d = toDate(date);
  d.setDate(d.getDate() + amount);
  return d;
};

/**
 * 일 빼기
 */
export const subDays = (date: DateInput, amount: number): Date => {
  return addDays(date, -amount);
};

/**
 * 같은 날인지 확인 (년, 월, 일)
 */
export const isSameDay = (
  d1: DateInput | undefined,
  d2: DateInput | undefined,
): boolean => {
  if (!d1 || !d2) return false;
  const date1 = toDate(d1);
  const date2 = toDate(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * 오늘인지 확인
 */
export const isToday = (date: DateInput): boolean =>
  isSameDay(date, new Date());

/**
 * 같은 달인지 확인 (년, 월)
 */
export const isSameMonth = (d1: DateInput, d2: DateInput): boolean => {
  const date1 = toDate(d1);
  const date2 = toDate(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

/**
 * d1이 d2보다 이전인지 확인
 */
export const isBefore = (date: DateInput, compareDate: DateInput): boolean => {
  return toDate(date).getTime() < toDate(compareDate).getTime();
};

/**
 * d1이 d2보다 이후인지 확인
 */
export const isAfter = (date: DateInput, compareDate: DateInput): boolean => {
  return toDate(date).getTime() > toDate(compareDate).getTime();
};

/**
 * 기간 내의 날짜인지 확인 (start <= date <= end)
 */
export const isWithinInterval = (
  date: DateInput,
  start: DateInput,
  end: DateInput,
): boolean => {
  const time = toDate(date).getTime();
  const startTime = getStartOfDay(start).getTime(); // 시작일의 00:00
  const endTime = toDate(end).setHours(23, 59, 59, 999); // 종료일의 23:59

  return time >= startTime && time <= endTime;
};

/**
 * 두 날짜 사이의 일(Day) 차이 계산
 */
export const diffInDays = (d1: DateInput, d2: DateInput): number => {
  const date1 = getStartOfDay(d1).getTime();
  const date2 = getStartOfDay(d2).getTime();

  const timeDiff = Math.abs(date1 - date2);
  return Math.round(timeDiff / (1000 * 3600 * 24));
};

/**
 * 시작일과 종료일 사이의 모든 날짜 배열 반환
 */
export const eachDayOfInterval = (start: DateInput, end: DateInput): Date[] => {
  const startDate = getStartOfDay(start);
  const endDate = toDate(end);
  endDate.setHours(0, 0, 0, 0); // 비교를 위해 시간 통일

  const days: Date[] = [];
  const currentDay = new Date(startDate);

  while (currentDay <= endDate) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }
  return days;
};

const FORMAT_REGEX = /yyyy|MM|M|dd|d|HH|hh|mm|m|ss|s|SSS|a/g;
/**
 * 날짜 포맷팅 함수 (다국어 AM/PM 완벽 지원)
 * 지원 토큰: yyyy, MM, M, dd, d, HH, hh, mm, m, ss, s, SSS, a
 */
export const formatDate = (
  timestampInput: DateInput | null | undefined,
  formatStr: string,
  locale: string = "en",
): string => {
  if (!timestampInput) return "";

  let date: Date;
  if (typeof timestampInput === "number") {
    // Unix Timestamp 처리 (초 단위인 경우 밀리초로 변환)
    const timestampInMillis =
      timestampInput < 100000000000 ? timestampInput * 1000 : timestampInput;
    date = new Date(timestampInMillis);
  } else {
    date = toDate(timestampInput);
  }

  const yyyy = date.getFullYear();
  const M = date.getMonth() + 1;
  const d = date.getDate();
  const H = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const SSS = date.getMilliseconds();
  const h = H % 12 || 12;

  // 다국어 완벽 대응 AM/PM 추출 (ko: 오전/오후, en: AM/PM)
  let a = H < 12 ? "AM" : "PM";
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      hour12: true,
    }).formatToParts(date);
    const dayPeriod = parts.find((part) => part.type === "dayPeriod");
    if (dayPeriod) {
      a = dayPeriod.value;
    }
  } catch (error) {
    // 만약 브라우저 호환성 에러 발생 시 기본값 유지
  }

  const replacements: { [key: string]: string } = {
    yyyy: String(yyyy),
    MM: String(M).padStart(2, "0"),
    M: String(M),
    dd: String(d).padStart(2, "0"),
    d: String(d),
    HH: String(H).padStart(2, "0"),
    hh: String(h).padStart(2, "0"),
    mm: String(m).padStart(2, "0"),
    m: String(m),
    ss: String(s).padStart(2, "0"),
    s: String(s),
    SSS: String(SSS).padStart(3, "0"),
    a: a,
  };

  return formatStr.replace(FORMAT_REGEX, (match) => replacements[match]);
};

/**
 * 상대적인 시간 포맷팅 (예: "방금 전", "2시간 전")
 * @param locale "en", "ko" 등의 언어 코드 (기본값: "en")
 */
export const getRelativeTimeString = (
  date: DateInput,
  locale: string = "en",
): string => {
  const timeMs = toDate(date).getTime();
  const deltaSeconds = Math.round((Date.now() - timeMs) / 1000);

  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds),
  );
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return rtf.format(-Math.round(deltaSeconds / divisor), units[unitIndex]);
};

// --- 시간 설정 헬퍼 ---

export const setHours = (date: DateInput, hours: number): Date => {
  const d = toDate(date);
  d.setHours(hours);
  return d;
};

export const setMinutes = (date: DateInput, minutes: number): Date => {
  const d = toDate(date);
  d.setMinutes(minutes);
  return d;
};
