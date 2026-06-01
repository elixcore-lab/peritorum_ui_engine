import React, { forwardRef } from "react";
import {
  Panel,
  SectionHeader,
  SectionTitleGroup,
  SectionBody,
  SectionFooter,
} from "../layout";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {}

const CardRoot = forwardRef<HTMLElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Panel ref={ref} $noPadding {...props}>
      {children}
    </Panel>
  ),
);
CardRoot.displayName = "Card";

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, ...props }, ref) => (
    <SectionBody ref={ref} $transparent {...props}>
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
