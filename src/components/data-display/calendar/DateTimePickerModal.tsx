import { useState, useMemo, useEffect } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft } from "lucide-react";
import { useUiConfig } from "../../../ConfigProvider";
import {
  formatDate,
  addMonths,
  subMonths,
  isSameMonth,
  getStartOfMonth,
  getEndOfMonth,
} from "../../../utils/DateUtils";
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
import { Button, IconButton } from "../..";

const TP = "ui.component.calendar";

export const DateTimePickerModal = ({
  isOpen,
  onClose,
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
}: DateTimePickerModalProps) => {
  const theme = useTheme();
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
    () => formatDate(currentMonth, yearMonthFormatStr, locale),
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

  const modalHeader = showDateControls ? (
    <HeaderLayout>
      <IconButton
        variant="ghost"
        size="sm"
        shape="circle"
        icon={<ChevronLeft />}
        onClick={handlePreviousMonth}
      />
      <MonthLabelWrapper>{currentMonthLabel}</MonthLabelWrapper>
      <IconButton
        variant="ghost"
        size="sm"
        shape="circle"
        icon={<ChevronRight />}
        disabled={disableFuture && isSameMonth(currentMonth, new Date())}
        onClick={handleNextMonth}
      />
    </HeaderLayout>
  ) : (
    <HeaderLayout>
      {mode === PickerMode.datetime && (
        <IconButton
          variant="ghost"
          size="sm"
          shape="circle"
          icon={<ArrowLeft />}
          onClick={handleBackToDate}
        />
      )}
      <Calendar size={18} />
      <span>
        {activeDate ? formatDate(activeDate, "yyyy. MM. dd", locale) : "-"}
      </span>
    </HeaderLayout>
  );

  const modalFooter = (
    <FooterLayout>
      <ActionGroup>
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
      </ActionGroup>

      <ActionGroup>
        <Button variant="secondary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button onClick={handleConfirm} disabled={!canConfirm}>
          {t("common.confirm")}
        </Button>
      </ActionGroup>
    </FooterLayout>
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      width={theme.sizes.component.datePickerModalWidth}
      title={modalHeader}
      footer={modalFooter}
      hideCloseButton
    >
      <BodyWrapper>
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
      </BodyWrapper>
    </Modal>
  );
};

// --- Styled Components ---

const HeaderLayout = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const MonthLabelWrapper = styled(S.CurrentMonthLabel)`
  flex: 1;
`;

const FooterLayout = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BodyWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;
