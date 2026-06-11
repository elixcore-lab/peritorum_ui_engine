import React, { forwardRef, useId } from "react";
import styled from "@emotion/styled";
import { Label } from "./Label";
import { Text } from "../typography/Text";
import { fadeIn, applyAnimation, flexColumn } from "../../styles";

export interface FormFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: boolean | React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  children: React.ReactElement<{
    id?: string;
    isError?: boolean;
    disabled?: boolean;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }>;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      label,
      description,
      error,
      required,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();

    if (!React.isValidElement(children)) {
      console.warn("FormField: children must be a valid React Element.");
      return <>{children}</>;
    }

    const childId = children.props.id || generatedId;
    const errorId = `${childId}-error`;
    const descriptionId = `${childId}-description`;

    const hasError =
      error !== undefined && error !== null && error !== false && error !== "";

    // 에러와 설명을 모두 읽어주도록 조합
    const ariaDescribedBy =
      [hasError ? errorId : undefined, description ? descriptionId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    const renderLabel = () => {
      if (!label) return null;
      if (React.isValidElement(label)) {
        return React.cloneElement(
          label as React.ReactElement<{ htmlFor?: string }>,
          { htmlFor: childId },
        );
      }
      return (
        <Label htmlFor={childId} required={required} disabled={disabled}>
          {label}
        </Label>
      );
    };

    const renderDescription = () => {
      if (!description) return null;
      if (React.isValidElement(description)) {
        return React.cloneElement(
          description as React.ReactElement<{ id?: string }>,
          { id: descriptionId },
        );
      }
      return (
        <Text id={descriptionId} size="xs" color="secondary">
          {description}
        </Text>
      );
    };

    const renderError = () => {
      // 단순히 에러 상태(boolean)만 넘긴 경우 텍스트 영역 렌더링 생략
      if (!hasError || error === true) return null;

      if (React.isValidElement(error)) {
        return React.cloneElement(
          error as React.ReactElement<{ id?: string; role?: string }>,
          {
            id: errorId,
            role: "alert",
          },
        );
      }
      return (
        <AnimatedErrorText
          id={errorId}
          role="alert"
          size="xs"
          color="danger"
          weight="medium"
        >
          {error}
        </AnimatedErrorText>
      );
    };

    return (
      <FieldWrapper ref={ref} className={className} {...props}>
        {(label || description) && (
          <HeaderWrapper>
            {renderLabel()}
            {renderDescription()}
          </HeaderWrapper>
        )}

        <ControlWrapper>
          {React.cloneElement(children, {
            id: childId,
            isError:
              children.props.isError !== undefined
                ? children.props.isError
                : hasError,
            disabled:
              children.props.disabled !== undefined
                ? children.props.disabled
                : disabled,
            "aria-invalid": hasError,
            "aria-describedby": ariaDescribedBy,
          })}
        </ControlWrapper>

        {renderError()}
      </FieldWrapper>
    );
  },
);

FormField.displayName = "FormField";

// ==========================================
// Styled Components
// ==========================================

const FieldWrapper = styled.div`
  ${flexColumn} /* 💡 mixins 재활용 */
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const HeaderWrapper = styled.div`
  ${flexColumn} /* 💡 mixins 재활용 */
  gap: ${({ theme }) => theme.spacing["2xs"]};
`;

const ControlWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const AnimatedErrorText = styled(Text)`
  ${({ theme }) =>
    applyAnimation(
      theme,
      fadeIn,
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}
`;
