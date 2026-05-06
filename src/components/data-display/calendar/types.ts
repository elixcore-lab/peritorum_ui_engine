export const PickerMode = {
  date: "date",
  time: "time",
  datetime: "datetime",
} as const;
export type PickerMode = (typeof PickerMode)[keyof typeof PickerMode];

export const SelectionMode = {
  single: "single",
  range: "range",
} as const;
export type SelectionMode = (typeof SelectionMode)[keyof typeof SelectionMode];

export const DateFormat = {
  full: "full",
  short: "short",
  compact: "compact",
} as const;
export type DateFormat = (typeof DateFormat)[keyof typeof DateFormat];

export const WeekdayFormat = {
  full: "full",
  short: "short",
  single: "single",
} as const;
export type WeekdayFormat = (typeof WeekdayFormat)[keyof typeof WeekdayFormat];

export interface CalendarEvent {
  date: string;
}

export type Event = CalendarEvent;

export interface DateTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (start: Date, end?: Date) => void;
  onSelectMonth?: (start: Date, end?: Date) => void;
  mode?: PickerMode;
  selectionMode?: SelectionMode;
  initialStartDate?: Date;
  initialEndDate?: Date;
  events?: CalendarEvent[];
  dateFormat?: DateFormat;
  weekdayFormat?: WeekdayFormat;
  disableFuture?: boolean;
}

export interface TimeColumnProps {
  label: string;
  data: number[];
  value: number;
  onChange: (value: number) => void;
  disabledLimit?: number;
}
