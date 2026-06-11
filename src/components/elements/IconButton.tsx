import React, { forwardRef } from "react";
import { Button, type ButtonProps } from "./Button";

/**
 * IconButton이 렌더링할 아이콘과 Button에서 상속받은 action props를 정의합니다.
 *
 * 텍스트 children 대신 `icon`만 받으며, 접근성 이름은 `aria-label`로 제공하는 것을
 * 권장합니다.
 */
export interface IconButtonProps extends Omit<
  ButtonProps,
  "children" | "leftIcon" | "rightIcon" | "isIconOnly" | "fullWidth"
> {
  icon: React.ReactNode;
}

/**
 * 정사각형 아이콘 전용 버튼입니다.
 *
 * 내부적으로 Button의 icon-only 모드를 사용하므로 색상, 크기, disabled, loading 등
 * Button과 동일한 디자인 토큰을 공유합니다.
 */
export const IconButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconButtonProps
>(({ icon, ...props }, ref) => {
  return (
    <Button ref={ref} isIconOnly {...props}>
      {icon}
    </Button>
  );
});

IconButton.displayName = "IconButton";
