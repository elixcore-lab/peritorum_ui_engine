import { type Theme } from "@emotion/react";

// ==========================================
// 1. 테마 기반 동적 타입 (Theme-dependent)
// ==========================================
export type ControlSize = keyof Theme["sizes"]["control"] | (string & {});
export type IconSize = keyof Theme["sizes"]["icon"] | (string & {});
export type FontSize = keyof Theme["fontSizes"] | (string & {});
export type FontWeight = keyof Theme["fontWeights"] | (number & {});
export type Spacing = keyof Theme["spacing"] | (string & {});

// ==========================================
// 2. 의미론적 타입 (Semantic & Intent)
// ==========================================

//  외형(모양)을 결정하는 타입
export type AppearanceVariant =
  | "solid" // 꽉 찬 배경 (기본적인 버튼 등)
  | "subtle" // 연한 배경 (뱃지, 태그 등에 주로 사용)
  | "outline" // 테두리만 있는 상태
  | "ghost"; // 배경과 테두리가 없는 투명 상태

// 색상(의미)만 남긴 컬러 타입
export type ColorVariant =
  | "default" // 기본 상태
  | "primary" // 주요/브랜드 컬러
  | "secondary" // 보조 컬러
  | "success" // 긍정적 상태 (녹색)
  | "danger" // 부정적 상태 (빨간색)
  | "warning" // 경고 상태 (노란색)
  | "info" // 정보 상태 (파란색)
  | "offline"
  | "brand" // 브랜드 고유 컬러
  | (string & {});

export type TextColorIntent =
  | "primary"
  | "secondary"
  | "disabled"
  | "inverse"
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "brand"
  | "inherit"
  | "white"
  | "black"
  | (string & {});

export type TextAlign = "left" | "center" | "right" | "justify";

export type ComponentShape = "square" | "circle";
export type SelectionVariant = "default" | "card";
export type RadioVariant = SelectionVariant | "segmented";
export type SelectionValue = string | number;
