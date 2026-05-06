import React, { useState, useCallback } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import {
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button, type ButtonProps } from "../elements/Button";
import { contentShow, spin } from "../../styles/animation";
import { applyAnimation, flexCenter } from "../../styles/utils";
import { Overlay } from "./Overlay";
import { useUiConfig } from "../../ConfigProvider";

// --- Types ---
export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  variant?: AlertVariant;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => Promise<void> | void;
  isLoading?: boolean;
}

// --- Config ---
const VARIANT_ICONS: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
};

const BUTTON_VARIANT_BY_ALERT_VARIANT: Record<
  AlertVariant,
  ButtonProps["variant"]
> = {
  info: "primary",
  success: "primary",
  warning: "primary",
  danger: "danger",
};

// --- Component ---
export const AlertModal = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "info",
  showCancel = false,
  confirmText,
  cancelText,
  onConfirm,
  isLoading: externalLoading,
}: AlertModalProps) => {
  const { t } = useUiConfig();
  const theme = useTheme();

  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = externalLoading || internalLoading;

  const IconComponent = VARIANT_ICONS[variant];

  const finalConfirmText = confirmText || t("common.confirm");
  const finalCancelText = cancelText || t("common.cancel");

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isLoading && !isOpen) return;
      onOpenChange(isOpen);
    },
    [isLoading, onOpenChange],
  );

  const handleConfirm = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (isLoading) return;

      try {
        setInternalLoading(true);
        if (onConfirm) await onConfirm();
        onOpenChange(false);
      } catch (error) {
        console.error("Alert Action Failed:", error);
      } finally {
        setInternalLoading(false);
      }
    },
    [onConfirm, onOpenChange, isLoading],
  );

  return (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay asChild>
          <Overlay zIndex={theme.zIndices.alert} />
        </AlertDialog.Overlay>

        <Content>
          <Header>
            <IconWrapper $variant={variant}>
              <VariantIcon as={IconComponent} />
            </IconWrapper>
            <Title>{title}</Title>
          </Header>

          {description && (
            <Description asChild>
              <div>{description}</div>
            </Description>
          )}

          <ButtonContainer>
            {showCancel && (
              <AlertDialog.Cancel asChild>
                <Button variant="secondary" isDisabled={isLoading} isFullWidth>
                  {finalCancelText}
                </Button>
              </AlertDialog.Cancel>
            )}

            <AlertDialog.Action asChild>
              <Button
                variant={BUTTON_VARIANT_BY_ALERT_VARIANT[variant]}
                onClick={handleConfirm}
                isDisabled={isLoading}
                isFullWidth
              >
                {isLoading && <LoadingIcon />}
                {finalConfirmText}
              </Button>
            </AlertDialog.Action>
          </ButtonContainer>
        </Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

// --- Styled Components ---
const Content = styled(AlertDialog.Content)`
  background-color: ${({ theme }) => theme.colors.background.modal};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme }) => theme.colors.border.divider};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.sm};

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: ${({ theme }) => theme.sizes.component.modalAlertWidth};

  padding: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndices.alert};
  outline: none;

  ${({ theme }) =>
    applyAnimation(
      theme,
      contentShow,
      theme.transitions.duration.fast,
      theme.transitions.function.spring,
    )}
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.base};
`;

const IconWrapper = styled.div<{ $variant: AlertVariant }>`
  width: ${({ theme }) => theme.sizes.component.alertIcon};
  height: ${({ theme }) => theme.sizes.component.alertIcon};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  ${flexCenter};

  background-color: ${({ theme, $variant }) => theme.colors.statusBg[$variant]};
  color: ${({ theme, $variant }) => theme.colors.status[$variant]};
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.base};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme, $variant }) => theme.colors.statusBg[$variant]};
`;

const VariantIcon = styled.svg`
  width: ${({ theme }) => theme.sizes.icon.lg};
  height: ${({ theme }) => theme.sizes.icon.lg};
`;

const Title = styled(AlertDialog.Title)`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
`;

const Description = styled(AlertDialog.Description)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.6;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.base};
  width: 100%;

  & > button {
    flex: 1;
  }
`;

const LoadingIcon = styled(Loader2)`
  width: ${({ theme }) => theme.sizes.icon.sm};
  height: ${({ theme }) => theme.sizes.icon.sm};
  ${({ theme }) =>
    applyAnimation(
      theme,
      spin,
      theme.transitions.duration.fast,
      theme.transitions.function.linear,
    )}
  animation-iteration-count: infinite;
`;
