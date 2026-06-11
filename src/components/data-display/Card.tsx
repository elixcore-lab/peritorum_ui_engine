import React, { forwardRef } from "react";
import {
  Section,
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
} from "../layout";

/**
 * Card root가 상속하는 section HTML 속성입니다.
 *
 * Card 자체는 spacing을 만들지 않고, 내부 Header/Body/Footer preset의 gap과 padding을
 * 통해 구조화됩니다.
 */
export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "style"> {}

/**
 * Card compound component의 root 영역입니다.
 *
 * layout `Section`을 기반으로 surface, border, shadow를 일관되게 적용합니다.
 */
const CardRoot = forwardRef<HTMLElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Section ref={ref} {...props}>
      {children}
    </Section>
  ),
);
CardRoot.displayName = "Card";

/**
 * Card body가 상속하는 div HTML 속성입니다.
 *
 * 스크롤과 padding 정책은 layout `SectionBody`의 컨벤션을 따릅니다.
 */
export interface CardBodyProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {}

/**
 * Card의 주요 콘텐츠 영역입니다.
 *
 * Header/Footer와 조합해 예측 가능한 패널 구조를 구성합니다.
 */
const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, ...props }, ref) => (
    <SectionBody ref={ref} {...props}>
      {children}
    </SectionBody>
  ),
);
CardBody.displayName = "CardBody";

/**
 * Header, TitleGroup, Body, Footer를 포함하는 compound Card API입니다.
 */
export const Card = Object.assign(CardRoot, {
  Header: SectionHeader,
  TitleGroup: SectionTitleGroup,
  Body: CardBody,
  Footer: SectionFooter,
});
