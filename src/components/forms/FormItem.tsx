import React, { useId } from "react";
import styled from "@emotion/styled";
import { Label } from "./Label";
import { fadeIn } from "../../styles/animation";
import { applyAnimation } from "../../styles";

export interface FormItemProps {
  label?: string;
  required?: boolean;
  error?: string | boolean;
  helpText?: string;
  children: React.ReactElement<any>;
  className?: string;
}

export const FormItem = ({
  label,
  required,
  error,
  helpText,
  children,
  className,
}: FormItemProps) => {
  const generatedId = useId();

  const childId = children.props.id || generatedId;
  const errorId = `${childId}-error`;
  const helpId = `${childId}-help`;

  const hasError = !!error;
  const isErrorString = typeof error === "string" && error.length > 0;

  // React.cloneElement도 에러 없이 통과합니다.
  const clonedChild = React.cloneElement(children, {
    id: childId,
    isError:
      children.props.isError !== undefined ? children.props.isError : hasError,
    "aria-invalid": hasError,
    "aria-describedby": isErrorString ? errorId : helpText ? helpId : undefined,
  });

  return (
    <Wrapper className={className}>
      {label && (
        <Label
          htmlFor={childId}
          required={required}
          isDisabled={children.props.isDisabled}
        >
          {label}
        </Label>
      )}

      {clonedChild}

      {isErrorString && (
        <ErrorText id={errorId} role="alert">
          {error}
        </ErrorText>
      )}
      {!hasError && helpText && <HelpText id={helpId}>{helpText}</HelpText>}
    </Wrapper>
  );
};

// ... (아래 스타일드 컴포넌트는 이전과 동일하게 유지) ...
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.status.danger};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  ${({ theme }) =>
    applyAnimation(
      theme,
      fadeIn,
      theme.transitions.duration.fast,
      theme.transitions.function.easeInOut,
    )}
`;

const HelpText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
