import { useEffect, useState, RefObject } from "react";

interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean; // 화면에 한 번 나타나면 옵저버를 해제할지 여부
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
  }: Args = {},
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = elementRef?.current; // DOM 요소 참조
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, observerParams);

    observer.observe(node);
    return () => observer.disconnect();
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen]);

  return entry;
}
