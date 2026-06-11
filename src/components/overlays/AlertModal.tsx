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
import { Button } from "../elements/Button";
import {
  applyAnimation,
  flexCenter,
  floatingSurface,
  squareIconSize,
  componentColorStyle,
} from "../../styles/mixins";
import { type ComponentColor } from "../../styles/types";
import { Overlay } from "./Overlay";
import { useUiConfig } from "../../ConfigProvider";
import { SectionBody, SectionFooter } from "../layout";
import { Text } from "../typography/Text";
import { contentShow } from "../../styles/animation";

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

// 💡 버튼의 "색상(Color)"을 매핑하도록 변경 (형태는 모두 solid로 고정)
const BUTTON_COLOR: Record<AlertVariant, ComponentColor> = {
  info: "primary",
  success: "primary", // 또는 "success" (기획에 따라 선택)
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

              {/* 💡 직접 스타일링 대신 우리가 만든 Text 컴포넌트 활용 */}
              <AlertDialog.Title asChild>
                <Text variant="h3" weight="bold" align="center">
                  {title}
                </Text>
              </AlertDialog.Title>

              {description && (
                <AlertDialog.Description asChild>
                  <Text
                    variant="body2"
                    color="secondary"
                    align="center"
                    style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                  >
                    {description}
                  </Text>
                </AlertDialog.Description>
              )}
            </Header>
          </SectionBody>

          <SectionFooter>
            <ButtonContainer>
              {showCancel && (
                <AlertDialog.Cancel asChild>
                  {/* 💡 취소 버튼: 형태(outline)와 색상(default) 분리 적용 */}
                  <Button
                    variant="outline"
                    color="default"
                    disabled={isLoading}
                    fullWidth
                  >
                    {cancelText || t("common.cancel")}
                  </Button>
                </AlertDialog.Cancel>
              )}
              <AlertDialog.Action asChild>
                {/* 💡 확인 버튼: 꽉 찬 형태(solid)와 상태 색상 적용 */}
                <Button
                  variant="solid"
                  color={BUTTON_COLOR[variant]}
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

// ==========================================
// Styled Components
// ==========================================

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

  /* 💡 하드코딩된 statusBg, status 색상을 마스터 믹스인으로 완벽하게 교체! */
  ${({ theme, $variant }) => componentColorStyle(theme, "subtle", $variant)}
`;

const VariantIcon = styled.svg`
  ${({ theme }) => squareIconSize(theme, "lg")}
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
