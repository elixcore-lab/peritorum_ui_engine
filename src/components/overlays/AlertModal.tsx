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
import { type ColorVariant } from "../../styles/types";
import { Overlay } from "./Overlay";
import { useUiConfig } from "../../ConfigProvider";
import { Section } from "../layout";
import { Text } from "../typography/Text";
import { contentShow } from "../../styles/animation";

export type AlertVariant = "info" | "success" | "warning" | "danger";

/**
 * AlertModal 컴포넌트가 표시할 상태, 문구, 액션 동작을 정의합니다.
 *
 * 확인/취소 문구는 명시하지 않으면 ConfigProvider의 i18n 텍스트를 사용하며,
 * 비동기 확인 동작 중에는 모달 닫힘과 중복 실행을 방지합니다.
 */
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

const BUTTON_COLOR: Record<AlertVariant, ColorVariant> = {
  info: "primary",
  success: "primary",
  warning: "warning",
  danger: "danger",
};

/**
 * 중요한 상태 전환이나 파괴적 액션을 확인하는 디자인 시스템 모달입니다.
 *
 * Radix AlertDialog의 접근성 동작을 유지하면서 theme 기반 아이콘, 버튼 컬러,
 * 로딩 제어를 일관된 API로 제공합니다.
 */
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
      } catch {
        // 확인 액션 실패 시 모달을 유지합니다.
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
          <Section.Body>
            <Header>
              <IconWrapper $variant={variant}>
                <VariantIcon as={IconComponent} />
              </IconWrapper>

              <AlertDialog.Title asChild>
                <Text variant="h3" weight="bold" align="center">
                  {title}
                </Text>
              </AlertDialog.Title>

              {description && (
                <AlertDialog.Description asChild>
                  <AlertDescriptionText
                    variant="body2"
                    color="secondary"
                    align="center"
                  >
                    {description}
                  </AlertDescriptionText>
                </AlertDialog.Description>
              )}
            </Header>
          </Section.Body>

          <Section.Footer>
            <ButtonContainer>
              {showCancel && (
                <AlertDialog.Cancel asChild>
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
          </Section.Footer>
        </Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

AlertModal.displayName = "AlertModal";

const Content = styled(AlertDialog.Content)`
  ${({ theme }) => floatingSurface(theme)}
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ theme }) => `calc(100vw - ${theme.spacing.xl})`};
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
  padding: ${({ theme }) =>
    `${theme.spacing.lg} ${theme.spacing.none} ${theme.spacing.none}`};
`;

const IconWrapper = styled.div<{ $variant: AlertVariant }>`
  width: ${({ theme }) => theme.sizes.component.alertIcon};
  height: ${({ theme }) => theme.sizes.component.alertIcon};
  border-radius: ${({ theme }) => theme.borderRadius.round};
  ${flexCenter};

  ${({ theme, $variant }) => componentColorStyle(theme, "subtle", $variant)}
`;

const VariantIcon = styled.svg`
  ${({ theme }) => squareIconSize(theme, "lg")}
`;

const AlertDescriptionText = styled(Text)`
  white-space: pre-wrap;
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
