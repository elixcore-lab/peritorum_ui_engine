import React, { useState, useCallback } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button, type ButtonProps } from "../elements/Button";
import {
  applyAnimation,
  flexCenter,
  floatingSurface,
  squareIconSize,
  contentShow,
} from "../../styles";
import { Overlay } from "./Overlay";
import { useUiConfig } from "../../ConfigProvider";
import { SectionHeader, SectionBody, SectionFooter } from "../layout";

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

const VARIANT_ICONS: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
};

const BUTTON_VARIANT: Record<AlertVariant, ButtonProps["variant"]> = {
  info: "primary",
  success: "primary",
  warning: "warning",
  danger: "danger",
};

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
    <AlertDialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isLoading) onOpenChange(isOpen);
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay asChild>
          <Overlay zIndex={theme.zIndices.alert} />
        </AlertDialog.Overlay>

        <Content>
          <SectionBody>
            <Header>
              <IconWrapper $variant={variant}>
                <VariantIcon as={IconComponent} />
              </IconWrapper>
              <Title>{title}</Title>
              {description && <Description>{description}</Description>}
            </Header>
          </SectionBody>

          <SectionFooter>
            <ButtonContainer>
              {showCancel && (
                <AlertDialog.Cancel asChild>
                  <Button variant="secondary" disabled={isLoading} fullWidth>
                    {cancelText || t("common.cancel")}
                  </Button>
                </AlertDialog.Cancel>
              )}
              <AlertDialog.Action asChild>
                <Button
                  variant={BUTTON_VARIANT[variant]}
                  onClick={handleConfirm}
                  disabled={isLoading}
                  isLoading={isLoading}
                  fullWidth
                >
                  {confirmText || t("common.confirm")}
                </Button>
              </AlertDialog.Action>
            </ButtonContainer>
          </SectionFooter>
        </Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

AlertModal.displayName = "AlertModal";

// --- Styled Components ---
const Content = styled(AlertDialog.Content)`
  ${({ theme }) => floatingSurface(theme)}
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: ${({ theme }) => theme.sizes.component.modalAlertWidth};
  z-index: ${({ theme }) => theme.zIndices.alert};
  outline: none;
  display: flex;
  flex-direction: column;

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
  padding: ${({ theme }) => theme.spacing.lg} 0 0 0;
`;

const IconWrapper = styled.div<{ $variant: AlertVariant }>`
  width: ${({ theme }) => theme.sizes.component.alertIcon};
  height: ${({ theme }) => theme.sizes.component.alertIcon};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  ${flexCenter};
  background-color: ${({ theme, $variant }) => theme.colors.statusBg[$variant]};
  color: ${({ theme, $variant }) => theme.colors.status[$variant]};
  border: ${({ theme }) => theme.sizes.component.dividerThin} solid
    ${({ theme, $variant }) => theme.colors.statusBg[$variant]};
`;

const VariantIcon = styled.svg`
  ${({ theme }) => squareIconSize(theme, "lg")}
`;

const Title = styled(AlertDialog.Title)`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-align: center;
`;

const Description = styled(AlertDialog.Description)`
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
