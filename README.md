# Peritorum UI Engine (`@peritorum/ui`)

> 엔터프라이즈 B2B/B2C 애플리케이션을 위한 견고하고 확장 가능한 React 디자인 시스템 및 UI 엔진

Peritorum UI Engine은 유연한 테마 시스템, 완벽한 다국어(i18n) 지원, 그리고 웹 접근성(A11y)을 보장하는 고성능 프론트엔드 UI 컴포넌트 라이브러리입니다. **모노레포**(Monorepo) 환경에 최적화되어 있으며, 제품 개발자가 비즈니스 로직에만 집중할 수 있도록 뷰(View)의 모든 복잡성을 캡슐화했습니다.

## 기술 스택 (Tech Stack)

- **Core:** React 19, TypeScript
- **Styling:** Emotion (`@emotion/react`, `@emotion/styled`)
- **A11y & Primitives:** Radix UI
- **Icons:** Lucide React
- **Feedback:** React Hot Toast

## 핵심 철학 (Core Principles)

1. **Zero Magic Numbers (매직 넘버 제로)**
   모든 컴포넌트는 하드코딩된 px이나 색상 헥스코드를 사용하지 않습니다. 오직 사전 정의된 `theme` 토큰(`colors`, `sizes`, `spacing` 등)과 `mixins`만을 사용하여 렌더링되므로, 테마 변경 시 단 하나의 오차도 발생하지 않습니다.

2. **Compound Components (합성 컴포넌트)**
   거대한 Props를 넘기는 방식 대신, `Card.Header`, `Popover.Content` 처럼 직관적인 레고 블록 조립 방식을 채택하여 화면의 유연성을 극대화했습니다.

3. **Built-in i18n & A11y (다국어 및 접근성 내장)**
   자체 `ko`, `en` 다국어 사전을 내장하여 `EmptyState`, `Calendar` 등의 텍스트가 글로벌 환경에 자동 대응합니다. 또한 Radix UI 엔진을 통해 스크린 리더와 완벽한 키보드 네비게이션을 지원합니다.

## 설치 및 기본 세팅 (Installation)

### 1. 패키지 설치

호스트 프로젝트(제품)에서 본 엔진을 설치합니다. (**모노레포** workspace 또는 npm 레지스트리 활용)

```bash
# npm
npm install @peritorum/ui @emotion/react @emotion/styled

# pnpm (workspace)
pnpm add @peritorum/ui --filter <host-app>
```

_(💡 Radix UI, Lucide 등은 엔진 내부에서 알아서 설치되므로 호스트 앱에 추가할 필요가 없습니다.)_

### 2. Provider 설정 (`App.tsx`)

애플리케이션의 최상단을 `ConfigProvider`로 감싸주세요. 전역 스타일, 토스트(Toast) 시스템, 테마, 다국어가 한 번에 주입됩니다.

```tsx
import { ConfigProvider } from "@peritorum/ui";
import { DashboardLayout } from "./layouts/DashboardLayout";

function App() {
  return (
    <ConfigProvider mode="dark" locale="ko">
      <DashboardLayout />
    </ConfigProvider>
  );
}

export default App;
```

## 커스텀 테마 적용 (White-labeling)

프로젝트별로 고유한 브랜드 컬러나 사이즈가 필요하다면, `themeOverride` 속성을 통해 특정 토큰만 선택적으로 덮어씌울 수 있습니다. (Deep Merge 지원)

```tsx
import {
  ConfigProvider,
  type DeepPartial,
  type ThemeType,
} from "@peritorum/ui";

const customTheme: DeepPartial<ThemeType> = {
  colors: {
    brand: {
      primary: "#E11D48", // 로즈 레드 컬러로 브랜드 색상 변경
      cyan: "#E11D48",
    },
  },
  sizes: {
    sidebarWidth: "280px", // 사이드바 너비 조정
  },
};

function App() {
  return (
    <ConfigProvider themeOverride={customTheme} mode="light">
      <MyApplication />
    </ConfigProvider>
  );
}
```

## 가용 컴포넌트 (Components)

UI 엔진은 다음과 같은 6가지 카테고리의 부품을 제공합니다. 개발 시 아래의 컴포넌트만을 조합하여 화면을 구성하세요.

### 1. Layout (레이아웃)

대시보드와 모달의 뼈대를 구성합니다.

- `PageStack`, `PageHeader`, `ResponsiveGrid`, `DataRow`, `InlineActions`, `Divider`
- **Panel System:** `Panel`, `SectionHeader`, `SectionTitleGroup`, `SectionBody`, `SectionFooter`

### 2. Data Display (데이터 표시)

- `Card` (합성 컴포넌트: `Card.Header`, `Card.Body`, `Card.Footer`)
- `Accordion`, `Tabs`, `Avatar`, `Tag`, `Badge`
- `VirtualScrollTable` (대용량 가상 스크롤 테이블)
- `DateTimePickerModal` (단일/범위 달력 및 시간 선택기)
- `EmptyState`

### 3. Forms (입력 폼)

- `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Slider`
- `Select`, `ComboBox`, `MultiSelect`, `Autocomplete` (서버사이드 검색 최적화)
- `FormField`, `Label`

### 4. Overlays (오버레이)

- `Modal`, `Drawer`, `AlertModal`
- `Popover`, `DropdownMenu`, `Tooltip`

### 5. Feedback (상태 및 피드백)

- `Spinner`, `Skeleton`, `ProgressBar`
- `Callout` (인라인 경고 배너)
- `ToastProvider` (전역 토스트 알림)

## 🪝 유용한 커스텀 훅 (Hooks)

프론트엔드 개발의 반복 작업을 줄여주는 유틸리티 훅을 제공합니다.

| **Hook**                      | **설명**                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `useDisclosure`               | Modal, Drawer 등의 열림/닫힘 상태(isOpen, open, close, toggle)를 관리합니다. |
| `useClipboard`                | 클립보드 복사 로직 및 성공/실패 토스트 알림을 자동화합니다.                  |
| `useMediaQuery`               | JS 단에서 화면 크기(반응형) 변화를 감지합니다.                               |
| `useDebounce` / `useThrottle` | 빈번한 이벤트(타이핑, 스크롤 등)의 성능을 최적화합니다.                      |
| `useOnClickOutside`           | 모달이나 팝업 외부 클릭 시 닫히는 이벤트를 처리합니다.                       |

## ⚡ 빌드 최적화 가이드 (Vite)

호스트 프로젝트에서 UI 엔진을 사용할 때, 브라우저 캐싱 효율을 극대화하기 위해 `vite.config.ts`에 아래와 같이 코드 스플리팅(Code Splitting) 설정을 추가하는 것을 권장합니다.

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          state: ["@reduxjs/toolkit", "react-redux"],
          ui: [
            "@emotion/react",
            "@emotion/styled",
            "@peritorum/ui", // 💡 Radix UI 등 엔진 내부 의존성이 이곳으로 안전하게 병합됩니다.
          ],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          network: ["axios"],
        },
      },
    },
  },
});
```
