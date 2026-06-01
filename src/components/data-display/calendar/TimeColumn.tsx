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
  const isInitialMount = useRef(true);

  const activeIndex = useMemo(() => data.indexOf(value), [data, value]);
  const canSelect = useCallback(
    (item: number) => disabledLimit === undefined || item <= disabledLimit,
    [disabledLimit],
  );

  useEffect(() => {
    const container = ref.current;
    if (!container || isScrolling.current || activeIndex < 0) return;

    container.scrollTo({
      top: activeIndex * itemHeight,
      // 최초 렌더링 시에는 순간이동(auto), 이후 변경 시에는 부드럽게(smooth)
      behavior: isInitialMount.current ? "auto" : "smooth",
    });

    isInitialMount.current = false;
  }, [activeIndex, itemHeight]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
    }, DEBOUNCE_DELAY);
  }, [canSelect, data, itemHeight, onChange, value]);

  const handleItemClick = useCallback(
    (item: number) => {
      if (!canSelect(item)) return;

      isScrolling.current = true;
      onChange(item);

      const targetIndex = data.indexOf(item);
      ref.current?.scrollTo({
        top: targetIndex * itemHeight,
        behavior: "smooth",
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isScrolling.current = false;
      }, DEBOUNCE_DELAY + 300);
    },
    [canSelect, onChange, data, itemHeight],
  );

  return (
    <S.TimeColumnWrapper>
      <S.TimeColumnLabel id={`time-label-${label}`}>{label}</S.TimeColumnLabel>

      <S.TimeWheelWrapper>
        <S.HighlightBar aria-hidden="true" />
        <S.TimeWheelContainer
          ref={ref}
          onScroll={handleScroll}
          role="listbox"
          aria-labelledby={`time-label-${label}`}
        >
          <S.TimeWheelSpacer aria-hidden="true" />

          {data.map((item) => (
            <S.TimeWheelItem
              key={item}
              role="option"
              aria-selected={item === value}
              aria-disabled={!canSelect(item)}
              $isActive={item === value}
              $isDisabled={!canSelect(item)}
              onClick={() => handleItemClick(item)}
            >
              {String(item).padStart(2, "0")}
            </S.TimeWheelItem>
          ))}

          <S.TimeWheelSpacer aria-hidden="true" />
        </S.TimeWheelContainer>
      </S.TimeWheelWrapper>
    </S.TimeColumnWrapper>
  );
};
