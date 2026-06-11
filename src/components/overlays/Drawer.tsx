import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Overlay } from "./Overlay";
import { useUiConfig } from "../../ConfigProvider";
import { slideInRight, slideInLeft } from "../../styles/animation";
import { applyAnimation, visuallyHidden } from "../../styles";
import {
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
  Divider,
} from "../layout";
import { Text } from "../typography/Text";

/**
 * Drawer 컴포넌트의 열림 상태, 배치 방향, 콘텐츠 슬롯을 정의합니다.
 *
 * `width`는 소비자가 필요할 때만 전달하며, 기본값은 theme sizing 토큰을 사용합니다.
 * 설명과 footer는 선택 슬롯으로 제공되어 Dialog 접근성 정보를 함께 구성합니다.
 */
export interface DrawerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    "children" | "style" | "title"
  > {
  children: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  side?: "left" | "right";
  title?: React.ReactNode;
  width?: string;
  onOpenChange: (open: boolean) => void;
}

/**
 * 화면 가장자리에서 슬라이드되는 패널형 오버레이입니다.
 *
 * Radix Dialog의 focus/aria 동작을 유지하면서 레이아웃 primitive와 theme 토큰으로
 * header, body, footer 구성을 표준화합니다.
 */
export const Drawer = ({
  children,
  description,
  footer,
  isOpen,
  side = "right",
  title,
  width,
  onOpenChange,
  onCloseAutoFocus,
  ...contentProps
}: DrawerProps) => {
  const theme = useTheme();
  const { t } = useUiConfig();
  const resolvedWidth = width ?? theme.sizes.component.modalAlertWidth;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Overlay zIndex={theme.zIndices.modal} />
        </Dialog.Overlay>
        <Content
          $side={side}
          $width={resolvedWidth}
          {...contentProps}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event);
            event.preventDefault();
          }}
        >
          <SectionHeader $padding="none">
            <SectionTitleGroup>
              {title ? (
                <Dialog.Title asChild>
                  {typeof title === "string" ? (
                    <Text variant="h2">{title}</Text>
                  ) : (
                    <div>{title}</div>
                  )}
                </Dialog.Title>
              ) : (
                <Dialog.Title asChild>
                  <VisuallyHidden>
                    {t("ui.component.drawer.title")}
                  </VisuallyHidden>
                </Dialog.Title>
              )}

              {description ? (
                <Dialog.Description asChild>
                  <DrawerDescriptionText
                    variant="body2"
                    color="secondary"
                    as="div"
                  >
                    {description}
                  </DrawerDescriptionText>
                </Dialog.Description>
              ) : (
                <Dialog.Description asChild>
                  <VisuallyHidden>
                    {t("ui.component.drawer.description")}
                  </VisuallyHidden>
                </Dialog.Description>
              )}
            </SectionTitleGroup>
          </SectionHeader>
          <Divider />
          <SectionBody $padding="none">{children}</SectionBody>

          {footer ? (
            <>
              <Divider />
              <SectionFooter $padding="none">{footer}</SectionFooter>
            </>
          ) : null}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Drawer.displayName = "Drawer";

const filterProps = {
  shouldForwardProp: (prop: string) => !["$side", "$width"].includes(prop),
};

const Content = styled(Dialog.Content, filterProps)<{
  $side: "left" | "right";
  $width: string;
}>`
  background-color: ${({ theme }) => theme.colors.background.modal};
  ${({ $side, theme }) => `
    border-${$side === "right" ? "left" : "right"}: ${theme.sizes.component.dividerThin} solid ${theme.colors.border.divider};
  `}
  box-shadow: ${({ theme }) => theme.colors.effect.shadow.lg};
  display: flex;
  flex-direction: column;
  max-width: ${({ $width, theme }) =>
    `min(${$width}, calc(100vw - ${theme.spacing.lg}))`};
  padding: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.md};
  outline: none;
  position: fixed;
  top: ${({ theme }) => theme.spacing.none};
  bottom: ${({ theme }) => theme.spacing.none};
  ${({ $side, theme }) => `${$side}: ${theme.spacing.none};`}
  width: ${({ $width }) => $width};
  z-index: ${({ theme }) => theme.zIndices.modal};
  ${({ theme, $side }) =>
    applyAnimation(
      theme,
      $side === "right" ? slideInRight : slideInLeft,
      theme.transitions.duration.fast,
      theme.transitions.function.easeOut,
    )}
`;

const VisuallyHidden = styled.span`
  ${visuallyHidden}
`;

const DrawerDescriptionText = styled(Text)`
  white-space: pre-wrap;
`;
