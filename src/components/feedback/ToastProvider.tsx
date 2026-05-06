import { useMemo } from "react";
import { Toaster, ToasterProps } from "react-hot-toast";
import { useTheme } from "@emotion/react";

export interface ToastProviderProps extends ToasterProps {}

export const ToastProvider = ({
  position = "bottom-right",
  gutter,
  toastOptions,
  ...props
}: ToastProviderProps) => {
  const theme = useTheme();
  const resolvedGutter = gutter ?? theme.sizes.offset.toastGutter;

  const mergedToastOptions = useMemo(
    () => ({
      // 호스트 앱에서 넘겨준 toastOptions와 우리 엔진의 기본 스타일을 병합
      ...toastOptions,
      style: {
        backgroundColor: theme.colors.background.modal,
        color: theme.colors.text.primary,
        border: `${theme.sizes.component.dividerThin} solid ${theme.colors.border.divider}`,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.colors.effect.shadow.lg,
        fontSize: theme.fontSizes.sm,
        padding: `${theme.spacing.sm} ${theme.spacing.base}`,
        fontWeight: theme.fontWeights.medium,
        ...toastOptions?.style,
      },
      success: {
        ...toastOptions?.success,
        iconTheme: {
          primary: theme.colors.status.success,
          secondary: theme.colors.text.inverse,
          ...toastOptions?.success?.iconTheme,
        },
        style: {
          borderColor: theme.colors.statusBg.success,
          ...toastOptions?.success?.style,
        },
      },
      error: {
        ...toastOptions?.error,
        iconTheme: {
          primary: theme.colors.status.danger,
          secondary: theme.colors.text.inverse,
          ...toastOptions?.error?.iconTheme,
        },
        style: {
          borderColor: theme.colors.statusBg.danger,
          ...toastOptions?.error?.style,
        },
      },
      loading: {
        ...toastOptions?.loading,
        iconTheme: {
          primary: theme.colors.brand.cyan,
          secondary: theme.colors.utility.transparent,
          ...toastOptions?.loading?.iconTheme,
        },
      },
    }),
    [theme, toastOptions],
  );

  return (
    <Toaster
      position={position}
      gutter={resolvedGutter}
      toastOptions={mergedToastOptions}
      {...props}
    />
  );
};

ToastProvider.displayName = "ToastProvider";
