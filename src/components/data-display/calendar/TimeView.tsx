import { useMemo } from "react";
import { useUiConfig } from "../../../ConfigProvider";
import { TimeColumn } from "./TimeColumn";
import { timeToString } from "../../../utils/DateUtils";
import { SelectionMode } from "./types";
import * as S from "./styles";

const TP = "ui.component.calendar";
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES_SECONDS = Array.from({ length: 60 }, (_, i) => i);

interface TimeViewProps {
  selectionMode: SelectionMode;
  editingTarget: "start" | "end";
  setEditingTarget: (t: "start" | "end") => void;
  startDate?: Date;
  endDate?: Date;
  limits: { h: number; m: number; s: number };
  onTimeChange: (type: "h" | "m" | "s", value: number) => void;
}

export const TimeView = ({
  selectionMode,
  editingTarget,
  setEditingTarget,
  startDate,
  endDate,
  limits,
  onTimeChange,
}: TimeViewProps) => {
  const { locale, t } = useUiConfig();
  const activeDate = useMemo(
    () => (editingTarget === "start" ? startDate : endDate),
    [editingTarget, startDate, endDate],
  );
  const isStartActive = editingTarget === "start";

  const handleStartTabClick = () => {
    setEditingTarget("start");
  };

  const handleEndTabClick = () => {
    if (endDate) {
      setEditingTarget("end");
    }
  };

  const formattedStartDate = useMemo(
    () => (startDate ? timeToString(startDate, "MM-dd", locale) : "-"),
    [startDate, locale],
  );
  const formattedEndDate = useMemo(
    () => (endDate ? timeToString(endDate, "MM-dd", locale) : "-"),
    [endDate, locale],
  );

  const formattedStartTime = useMemo(
    () =>
      startDate ? timeToString(startDate, "HH:mm:ss", locale) : "--:--:--",
    [startDate, locale],
  );
  const formattedEndTime = useMemo(
    () => (endDate ? timeToString(endDate, "HH:mm:ss", locale) : "--:--:--"),
    [endDate, locale],
  );

  return (
    <S.TimeViewContainer>
      {selectionMode === SelectionMode.range && (
        <S.TabContainer>
          <S.TabItem $isActive={isStartActive} onClick={handleStartTabClick}>
            <S.TabLabel $isActive={isStartActive}>
              {t(`${TP}.label.start`)}
            </S.TabLabel>
            <S.TabValue $isActive={isStartActive}>
              <S.TabValueDate>{formattedStartDate}</S.TabValueDate>
              {formattedStartTime}
            </S.TabValue>
          </S.TabItem>

          <S.TabItem
            $isActive={!isStartActive}
            $isDisabled={!endDate}
            onClick={handleEndTabClick}
          >
            <S.TabLabel $isActive={!isStartActive}>
              {t(`${TP}.label.end`)}
            </S.TabLabel>
            <S.TabValue $isActive={!isStartActive}>
              <S.TabValueDate>{formattedEndDate}</S.TabValueDate>
              {formattedEndTime}
            </S.TabValue>
          </S.TabItem>
        </S.TabContainer>
      )}

      <S.TimeColumnsWrapper>
        <TimeColumn
          label={t(`${TP}.label.h`)}
          data={HOURS}
          value={activeDate?.getHours() ?? 0}
          disabledLimit={limits.h}
          onChange={(value) => onTimeChange("h", value)}
        />
        <S.TimeSeparator>:</S.TimeSeparator>
        <TimeColumn
          label={t(`${TP}.label.m`)}
          data={MINUTES_SECONDS}
          value={activeDate?.getMinutes() ?? 0}
          disabledLimit={limits.m}
          onChange={(value) => onTimeChange("m", value)}
        />
        <S.TimeSeparator>:</S.TimeSeparator>
        <TimeColumn
          label={t(`${TP}.label.s`)}
          data={MINUTES_SECONDS}
          value={activeDate?.getSeconds() ?? 0}
          disabledLimit={limits.s}
          onChange={(value) => onTimeChange("s", value)}
        />
      </S.TimeColumnsWrapper>
    </S.TimeViewContainer>
  );
};
