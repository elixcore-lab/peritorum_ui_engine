import { useRef, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "@emotion/react";
import * as S from "./styles";
import { type TimeColumnProps } from "./types";

const DEBOUNCE_DELAY = 150;

export const TimeColumn = ({
  label,
  data,
  value,
  onChange,
  disabledLimit,
}: TimeColumnProps) => {
  const theme = useTheme();
  const itemHeight = Number.parseInt(
    theme.sizes.component.timeWheelItemHeight,
    10,
  );
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrolling = useRef(false);

  const activeIndex = useMemo(() => data.indexOf(value), [data, value]);
  const canSelect = useCallback(
    (item: number) => disabledLimit === undefined || item <= disabledLimit,
    [disabledLimit],
  );

  useEffect(() => {
    const container = ref.current;
    if (!container || isScrolling.current || activeIndex < 0) return;
    container.scrollTop = activeIndex * itemHeight;
  }, [activeIndex, itemHeight]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleScroll = useCallback(() => {
    const container = ref.current;
    if (!container) return;

    isScrolling.current = true;
    const index = Math.round(container.scrollTop / itemHeight);
    const nextValue = data[index];

    if (
      nextValue !== undefined &&
      nextValue !== value &&
      canSelect(nextValue)
    ) {
      onChange(nextValue);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
      if (container && activeIndex >= 0) {
        container.scrollTo({
          top: activeIndex * itemHeight,
          behavior: "smooth",
        });
      }
    }, DEBOUNCE_DELAY);
  }, [activeIndex, canSelect, data, itemHeight, onChange, value]);

  const handleItemClick = useCallback(
    (item: number) => {
      if (canSelect(item)) {
        onChange(item);
      }
    },
    [canSelect, onChange],
  );

  return (
    <S.TimeColumnWrapper>
      <S.TimeColumnLabel>{label}</S.TimeColumnLabel>
      <S.TimeWheelWrapper>
        <S.HighlightBar />
        <S.TimeWheelContainer ref={ref} onScroll={handleScroll}>
          <S.TimeWheelSpacer />
          {data.map((item) => (
            <S.TimeWheelItem
              key={item}
              $isActive={item === value}
              $isDisabled={!canSelect(item)}
              onClick={() => handleItemClick(item)}
            >
              {String(item).padStart(2, "0")}
            </S.TimeWheelItem>
          ))}
          <S.TimeWheelSpacer />
        </S.TimeWheelContainer>
      </S.TimeWheelWrapper>
    </S.TimeColumnWrapper>
  );
};
