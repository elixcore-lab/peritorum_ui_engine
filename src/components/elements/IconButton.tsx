import React, { forwardRef } from "react";
import { Button, type ButtonProps } from "./Button";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "children" | "leftIcon" | "rightIcon" | "isIconOnly" | "fullWidth"
> {
  icon: React.ReactNode;
}

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
