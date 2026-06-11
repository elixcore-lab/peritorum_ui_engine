import React, { forwardRef } from "react";
import {
  Section,
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
} from "../layout";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {}

const CardRoot = forwardRef<HTMLElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Section ref={ref} {...props}>
      {children}
    </Section>
  ),
);
CardRoot.displayName = "Card";

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, ...props }, ref) => (
    <SectionBody ref={ref} {...props}>
      {children}
    </SectionBody>
  ),
);
CardBody.displayName = "CardBody";

export const Card = Object.assign(CardRoot, {
  Header: SectionHeader,
  TitleGroup: SectionTitleGroup,
  Body: CardBody,
  Footer: SectionFooter,
});
