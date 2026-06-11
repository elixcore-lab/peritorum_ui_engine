import { useMemo } from "react";
import { Toaster, ToasterProps } from "react-hot-toast";
import { css, Global, useTheme } from "@emotion/react";

type ToastOptions = NonNullable<ToasterProps["toastOptions"]>;
type ToastVariantOptions = NonNullable<ToastOptions["success"]>;
type ToastOptionsWithoutInlineStyle = Omit<
  ToastOptions,
  "error" | "loading" | "style" | "success"
> & {
  success?: Omit<ToastVariantOptions, "style">;
  error?: Omit<ToastVariantOptions, "style">;
  loading?: Omit<ToastVariantOptions, "style">;
};

const TOAST_CLASS_NAME = "peritorum-ui-toast";
const TOAST_SUCCESS_CLASS_NAME = "peritorum-ui-toast-success";
const TOAST_ERROR_CLASS_NAME = "peritorum-ui-toast-error";

const mergeClassNames = (...classNames: Array<string | undefined>) =>
  classNames.filter(Boolean).join(" ");

/**
 * 전역 ToastProvider가 react-hot-toast에 전달할 옵션입니다.
 *
 * 기본 스타일은 Emotion Global class로 제공되며, inline style 유입을 막기 위해
 * toastOptions/style 계열 prop은 제외합니다.
 */
export interface ToastProviderProps
  extends Omit<ToasterProps, "containerStyle" | "toastOptions"> {
  toastOptions?: ToastOptionsWithoutInlineStyle;
}

/**
 * 디자인 시스템 theme을 적용한 전역 toast host입니다.
 *
 * ConfigProvider 내부에서 기본 제공되며, toastOptions는 theme 기반 기본값과
 * 안전하게 병합됩니다.
 */
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
      ...toastOptions,
      className: mergeClassNames(TOAST_CLASS_NAME, toastOptions?.className),
      success: {
        ...toastOptions?.success,
        className: mergeClassNames(
          TOAST_CLASS_NAME,
          TOAST_SUCCESS_CLASS_NAME,
          toastOptions?.success?.className,
        ),
        iconTheme: {
          primary: theme.colors.status.success,
          secondary: theme.colors.text.inverse,
          ...toastOptions?.success?.iconTheme,
        },
      },
      error: {
        ...toastOptions?.error,
        className: mergeClassNames(
          TOAST_CLASS_NAME,
          TOAST_ERROR_CLASS_NAME,
          toastOptions?.error?.className,
        ),
        iconTheme: {
          primary: theme.colors.status.danger,
          secondary: theme.colors.text.inverse,
          ...toastOptions?.error?.iconTheme,
        },
      },
      loading: {
        ...toastOptions?.loading,
        className: mergeClassNames(
          TOAST_CLASS_NAME,
          toastOptions?.loading?.className,
        ),
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
    <>
      <Global
        styles={css`
          .${TOAST_CLASS_NAME} {
            background-color: ${theme.colors.background.modal};
            color: ${theme.colors.text.primary};
            border: ${theme.sizes.component.dividerThin} solid
              ${theme.colors.border.divider};
            border-radius: ${theme.borderRadius.md};
            box-shadow: ${theme.colors.effect.shadow.lg};
            font-size: ${theme.fontSizes.sm};
            font-weight: ${theme.fontWeights.medium};
            padding: ${theme.spacing.sm} ${theme.spacing.base};
          }

          .${TOAST_SUCCESS_CLASS_NAME} {
            border-color: ${theme.colors.statusBg.success};
          }

          .${TOAST_ERROR_CLASS_NAME} {
            border-color: ${theme.colors.statusBg.danger};
          }
        `}
      />
      <Toaster
        position={position}
        gutter={resolvedGutter}
        toastOptions={mergedToastOptions}
        {...props}
      />
    </>
  );
};

ToastProvider.displayName = "ToastProvider";
