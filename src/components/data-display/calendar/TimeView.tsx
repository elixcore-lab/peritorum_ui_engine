import { useMemo } from "react";
import { useUiConfig } from "../../../ConfigProvider";
import { TimeColumn } from "./TimeColumn";
import { formatDate } from "../../../utils/DateUtils";
import { SelectionMode } from "./types";
import * as S from "./styles";

const TP = "ui.component.calendar";
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES_SECONDS = Array.from({ length: 60 }, (_, i) => i);

/**
 * TimeView가 범위 선택 상태와 시/분/초 변경 콜백을 렌더링하기 위해 필요한 props입니다.
 */
interface TimeViewProps {
  selectionMode: SelectionMode;
  editingTarget: "start" | "end";
  setEditingTarget: (t: "start" | "end") => void;
  startDate?: Date;
  endDate?: Date;
  limits: { h: number; m: number; s: number };
  onTimeChange: (type: "h" | "m" | "s", value: number) => void;
}

/**
 * 선택된 날짜의 시/분/초를 조정하는 time picker 하위 뷰입니다.
 *
 * 범위 모드에서는 시작/종료 탭을 제공하고, 각 wheel column은 TimeColumn으로 분리합니다.
 */
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

  const handleKeyDown = (e: React.KeyboardEvent, target: "start" | "end") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (target === "start") handleStartTabClick();
      else handleEndTabClick();
    }
  };

  const formattedStartDate = useMemo(
    () => (startDate ? formatDate(startDate, "MM-dd", locale) : "-"),
    [startDate, locale],
  );
  const formattedEndDate = useMemo(
    () => (endDate ? formatDate(endDate, "MM-dd", locale) : "-"),
    [endDate, locale],
  );

  const formattedStartTime = useMemo(
    () => (startDate ? formatDate(startDate, "HH:mm:ss", locale) : "--:--:--"),
    [startDate, locale],
  );
  const formattedEndTime = useMemo(
    () => (endDate ? formatDate(endDate, "HH:mm:ss", locale) : "--:--:--"),
    [endDate, locale],
  );

  return (
    <S.TimeViewContainer>
      {selectionMode === SelectionMode.range && (
        <S.TabContainer role="tablist" aria-label={t(`${TP}.label.rangeTabs`)}>
          <S.TabItem
            role="tab"
            aria-selected={isStartActive}
            tabIndex={0}
            $isActive={isStartActive}
            onClick={handleStartTabClick}
            onKeyDown={(e) => handleKeyDown(e, "start")}
          >
            <S.TabLabel $isActive={isStartActive}>
              {t(`${TP}.label.start`)}
            </S.TabLabel>
            <S.TabValue $isActive={isStartActive}>
              <S.TabValueDate>{formattedStartDate}</S.TabValueDate>
              {formattedStartTime}
            </S.TabValue>
          </S.TabItem>

          <S.TabItem
            role="tab"
            aria-selected={!isStartActive}
            aria-disabled={!endDate}
            tabIndex={endDate ? 0 : -1}
            $isActive={!isStartActive}
            $isDisabled={!endDate}
            onClick={handleEndTabClick}
            onKeyDown={(e) => handleKeyDown(e, "end")}
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

        <S.TimeSeparator aria-hidden="true">:</S.TimeSeparator>

        <TimeColumn
          label={t(`${TP}.label.m`)}
          data={MINUTES_SECONDS}
          value={activeDate?.getMinutes() ?? 0}
          disabledLimit={limits.m}
          onChange={(value) => onTimeChange("m", value)}
        />

        <S.TimeSeparator aria-hidden="true">:</S.TimeSeparator>

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
