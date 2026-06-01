// hooks/useVirtualScroll.ts
import { useState, useRef, useMemo, useCallback, useEffect } from "react";

interface UseVirtualScrollProps {
  itemCount: number;
  rowHeight: number;
  overscan: number;
}

export const useVirtualScroll = ({
  itemCount,
  rowHeight,
  overscan,
}: UseVirtualScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // 컨테이너 크기 감지 (ResizeObserver)
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setViewportHeight(entry.contentRect.height);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 가상화 인덱스 및 패딩 계산
  const { startIndex, endIndex, paddingTop, paddingBottom } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const end = Math.min(
      itemCount,
      Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan,
    );

    return {
      startIndex: start,
      endIndex: end,
      paddingTop: start * rowHeight,
      paddingBottom: (itemCount - end) * rowHeight,
    };
  }, [scrollTop, viewportHeight, itemCount, rowHeight, overscan]);

  return {
    containerRef,
    scrollTop,
    viewportHeight,
    startIndex,
    endIndex,
    paddingTop,
    paddingBottom,
    handleScroll,
  };
};
