import React, { forwardRef, useId } from "react";
import styled from "@emotion/styled";
import { Label } from "./Label";
import { Text } from "../typography/Text";
import { fadeIn } from "../../styles/animation";
import { applyAnimation } from "../../styles/mixins";

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

    const childId = children.props.id || generatedId;
    const errorId = `${childId}-error`;
    const descriptionId = `${childId}-description`;

    const hasError =
      error !== undefined && error !== null && error !== false && error !== "";

    const ariaDescribedBy =
      [hasError ? errorId : undefined, description ? descriptionId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    const renderLabel = () => {
      if (!label) return null;
      if (React.isValidElement(label)) {
        return React.cloneElement(
          label as React.ReactElement<{ htmlFor?: string }>,
          {
            htmlFor: childId,
          },
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
          {
            id: descriptionId,
          },
        );
      }
      return (
        <Text id={descriptionId} size="xs" color="secondary">
          {description}
        </Text>
      );
    };

    const renderError = () => {
      // 에러가 존재하지만 단순히 true(불리언)라면 에러 박스는 그리지 않고 input 색상만 바꿈
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

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
