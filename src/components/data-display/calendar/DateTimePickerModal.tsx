import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@emotion/react";
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { useUiConfig } from "../../../ConfigProvider";
import {
  timeToString,
  addMonths,
  subMonths,
  isSameMonth,
  getStartOfMonth,
  getEndOfMonth,
} from "../../../utils/DateUtils";
import { Button } from "../../elements/Button";
import { Modal } from "../../overlays/Modal";
import { PickerStrategy, getFutureLimits } from "./PickerLogic";
import { CalendarView } from "./CalendarView";
import { TimeView } from "./TimeView";
import {
  DateTimePickerModalProps,
  PickerMode,
  SelectionMode,
  DateFormat,
  WeekdayFormat,
} from "./types";
import * as S from "./styles";
import { capitalize } from "../../../utils";

const TP = "ui.component.calendar";

const DateTimePickerInner = (props: DateTimePickerModalProps) => {
  const {
    onConfirm,
    onSelectMonth,
    mode = PickerMode.date,
    selectionMode = SelectionMode.single,
    initialStartDate,
    initialEndDate,
    events = [],
    dateFormat = DateFormat.compact,
    weekdayFormat = WeekdayFormat.short,
    disableFuture = true,
    onClose,
  } = props;

  const { locale, t } = useUiConfig();
  const isRangeMode = selectionMode === SelectionMode.range;
  const initialMonth = useMemo(
    () => initialStartDate || initialEndDate || new Date(),
    [initialStartDate, initialEndDate],
  );

  const [step, setStep] = useState<PickerMode>(
    mode === PickerMode.time ? PickerMode.time : PickerMode.date,
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialStartDate,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [editingTarget, setEditingTarget] = useState<"start" | "end">("start");

  useEffect(() => {
    setCurrentMonth(initialMonth);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialMonth, initialStartDate, initialEndDate]);

  useEffect(() => {
    if (!onSelectMonth) return;
    onSelectMonth(getStartOfMonth(currentMonth), getEndOfMonth(currentMonth));
  }, [currentMonth, onSelectMonth]);

  const weekdays = useMemo(
    () => t(`${TP}.days.${weekdayFormat}`) as string[],
    [t, weekdayFormat],
  );

  const activeDate = useMemo(
    () => (editingTarget === "start" ? startDate : endDate),
    [editingTarget, startDate, endDate],
  );

  const limits = useMemo(
    () => getFutureLimits(activeDate, disableFuture),
    [activeDate, disableFuture],
  );

  const yearMonthFormatStr = useMemo(
    () => t(`${TP}.format.yearMonth${capitalize(dateFormat)}`),
    [t, dateFormat],
  );

  const currentMonthLabel = useMemo(
    () => timeToString(currentMonth, yearMonthFormatStr, locale),
    [currentMonth, yearMonthFormatStr, locale],
  );

  const canConfirm = Boolean(startDate && (!isRangeMode || endDate));
  const showDateControls = step === PickerMode.date;

  const handleDateSelect = (day: Date) => {
    if (!isRangeMode) {
      const { start } = PickerStrategy.single(day, startDate);
      setStartDate(start);
      if (mode === PickerMode.datetime) setStep(PickerMode.time);
      return;
    }

    const { start, end, nextTarget } = PickerStrategy.range(
      day,
      { start: startDate, end: endDate },
      editingTarget,
    );
    setStartDate(start);
    setEndDate(end);
    setEditingTarget(nextTarget);
    if (end && mode === PickerMode.datetime) setStep(PickerMode.time);
  };

  const handleTimeChange = (type: "h" | "m" | "s", value: number) => {
    if (!activeDate) return;

    const nextDate = new Date(activeDate);
    if (type === "h") nextDate.setHours(value);
    else if (type === "m") nextDate.setMinutes(value);
    else nextDate.setSeconds(value);

    const finalDate =
      disableFuture && nextDate > new Date() ? new Date() : nextDate;
    if (editingTarget === "start") setStartDate(finalDate);
    else setEndDate(finalDate);
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (selectionMode === SelectionMode.single) {
      setStartDate(today);
      setEndDate(undefined);
    }
  };

  const handleBackToDate = () => {
    setStep(PickerMode.date);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleEditTime = () => {
    setStep(PickerMode.time);
  };

  const handleConfirm = () => {
    if (!canConfirm || !startDate) return;
    onConfirm(startDate, endDate);
  };

  return (
    <S.ModalContent>
      <S.ModalHeader>
        {step === PickerMode.time && mode === PickerMode.datetime && (
          <Button
            variant="ghost"
            shape="circle"
            size="sm"
            onClick={handleBackToDate}
          >
            <S.HeaderIcon as={ArrowLeft} />
          </Button>
        )}

        {showDateControls ? (
          <>
            <Button
              variant="ghost"
              shape="circle"
              size="sm"
              onClick={handlePreviousMonth}
            >
              <S.HeaderIcon as={ChevronLeft} />
            </Button>

            <S.CurrentMonthLabel>{currentMonthLabel}</S.CurrentMonthLabel>

            <Button
              variant="ghost"
              shape="circle"
              size="sm"
              isDisabled={
                disableFuture && isSameMonth(currentMonth, new Date())
              }
              onClick={handleNextMonth}
            >
              <S.HeaderIcon as={ChevronRight} />
            </Button>
          </>
        ) : (
          <>
            <S.HeaderIcon as={Calendar} />
            <span>
              {activeDate
                ? timeToString(activeDate, "yyyy. MM. dd", locale)
                : "-"}
            </span>
          </>
        )}
      </S.ModalHeader>

      <S.HorizontalSplit />

      <S.ModalBody>
        {showDateControls ? (
          <CalendarView
            currentMonth={currentMonth}
            startDate={startDate}
            endDate={endDate}
            selectionMode={selectionMode}
            disableFuture={disableFuture}
            weekdays={weekdays}
            events={events}
            onSelect={handleDateSelect}
          />
        ) : (
          <TimeView
            selectionMode={selectionMode}
            editingTarget={editingTarget}
            setEditingTarget={setEditingTarget}
            startDate={startDate}
            endDate={endDate}
            limits={limits}
            onTimeChange={handleTimeChange}
          />
        )}
      </S.ModalBody>

      <S.HorizontalSplit />
      <S.ModalFooter>
        <S.FooterGroup>
          {showDateControls && (
            <Button variant="ghost" onClick={handleGoToday}>
              {t(`${TP}.label.today`)}
            </Button>
          )}
          {showDateControls && startDate && mode === PickerMode.datetime && (
            <Button variant="ghost" onClick={handleEditTime}>
              {t(`${TP}.label.editTime`)}
            </Button>
          )}
        </S.FooterGroup>

        <S.FooterGroup>
          <Button variant="secondary" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleConfirm} isDisabled={!canConfirm}>
            {t("common.confirm")}
          </Button>
        </S.FooterGroup>
      </S.ModalFooter>
    </S.ModalContent>
  );
};

export const DateTimePickerModal = (props: DateTimePickerModalProps) => {
  const { isOpen, onClose } = props;
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      width={theme.sizes.component.datePickerModalWidth}
    >
      <DateTimePickerInner {...props} />
    </Modal>
  );
};
