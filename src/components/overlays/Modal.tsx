import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "@emotion/styled";
import { X } from "lucide-react";
import { useTheme } from "@emotion/react";
import {
  applyAnimation,
  visuallyHidden,
  floatingSurface,
} from "../../styles/mixins";
import { useUiConfig } from "../../ConfigProvider";
import { Overlay } from "./Overlay";
import { IconButton } from "../elements/IconButton";
import { Text } from "../typography/Text";
import { Section } from "../layout";
import { contentShow } from "../../styles";

/**
 * Modal 컴포넌트의 열림 상태, 접근성 문구, 콘텐츠 슬롯, 닫힘 정책을 정의합니다.
 *
 * Radix Dialog.Content 속성을 대부분 상속하지만 인라인 스타일 주입을 막기 위해
 * `style`은 제외합니다. 폭은 필요 시 전달하고 기본값은 theme 토큰을 사용합니다.
 */
export interface ModalProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    "children" | "title" | "style"
  > {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  hideCloseButton?: boolean;
  preventOutsideClose?: boolean;
}

/**
 * 앱 전반에서 사용하는 중앙 정렬 Dialog 컴포넌트입니다.
 *
 * header, body, footer 슬롯을 Layout primitive로 구성하고, Overlay와 floatingSurface
 * mixin을 통해 레이어 표현을 일관되게 유지합니다.
 */
export const Modal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width,
  hideCloseButton = false,
  preventOutsideClose = false,
  onPointerDownOutside,
  onEscapeKeyDown,
  ...contentProps
}: ModalProps) => {
  const theme = useTheme();
  const { t } = useUiConfig();
  const maxWidth = width || theme.sizes.component.modalDefaultWidth;

  const handlePointerDownOutside = (
    event: Parameters<
      NonNullable<
        React.ComponentPropsWithoutRef<
          typeof Dialog.Content
        >["onPointerDownOutside"]
      >
    >[0],
  ) => {
    onPointerDownOutside?.(event);
    if (preventOutsideClose) {
      event.preventDefault();
    }
  };

  const handleEscapeKeyDown = (
    event: Parameters<
      NonNullable<
        React.ComponentPropsWithoutRef<
          typeof Dialog.Content
        >["onEscapeKeyDown"]
      >
    >[0],
  ) => {
    onEscapeKeyDown?.(event);
    if (preventOutsideClose) {
      event.preventDefault();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Overlay zIndex={theme.zIndices.modal} />
        </Dialog.Overlay>

        <Content
          $maxWidth={maxWidth}
          {...contentProps}
          onPointerDownOutside={handlePointerDownOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
        >
          {(title || !hideCloseButton) && (
            <Section.Header>
              <Section.TitleGroup>
                {title ? (
                  <Dialog.Title asChild>
                    {typeof title === "string" ? (
                      <Text variant="h2" weight="bold" as="h2">
                        {title}
                      </Text>
                    ) : (
                      <div>{title}</div>
                    )}
                  </Dialog.Title>
                ) : (
                  <Dialog.Title asChild>
                    <VisuallyHidden>
                      {t("ui.component.modal.title")}
                    </VisuallyHidden>
                  </Dialog.Title>
                )}

                {description ? (
                  <Dialog.Description asChild>
                    {typeof description === "string" ? (
                      <Text variant="body2" color="secondary" as="div">
                        {description}
                      </Text>
                    ) : (
                      <div>{description}</div>
                    )}
                  </Dialog.Description>
                ) : (
                  <Dialog.Description asChild>
                    <VisuallyHidden>
                      {t("ui.component.modal.description")}
                    </VisuallyHidden>
                  </Dialog.Description>
                )}
              </Section.TitleGroup>

              {!hideCloseButton && (
                <Dialog.Close asChild>
                  <IconButton
                    variant="ghost"
                    color="default"
                    icon={<X />}
                    aria-label={t("ui.component.modal.close")}
                  />
                </Dialog.Close>
              )}
            </Section.Header>
          )}

          <Section.Body>{children}</Section.Body>

          {footer && <Section.Footer>{footer}</Section.Footer>}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Modal.displayName = "Modal";

const Content = styled(Dialog.Content)<{ $maxWidth: string }>`
  ${({ theme }) => floatingSurface(theme)}

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${({ theme }) => `calc(100vw - ${theme.spacing.xl})`};
  max-width: ${({ $maxWidth }) => $maxWidth};
  max-height: ${({ theme }) => `calc(100dvh - ${theme.spacing.xl})`};
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndices.modal};
  outline: none;

  ${({ theme }) =>
    applyAnimation(
      theme,
      contentShow,
      theme.transitions.duration.fast,
      theme.transitions.function.spring,
    )}
`;

const VisuallyHidden = styled.span`
  ${visuallyHidden}
`;
