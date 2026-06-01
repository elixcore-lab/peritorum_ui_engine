import { useEffect } from "react";

type EventType = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: { current: T | null },
  handler: (event: EventType) => void,
) {
  useEffect(() => {
    const listener = (event: EventType) => {
      // ref가 없거나, 클릭한 요소가 ref 내부에 있다면 무시
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
