# 📝 Markdown Editor

칸반 보드 태스크 생성 모달 구현을 위해 블록노트(BlockNote) 라이브러리를 활용한 마크다운 에디터입니다.

## 📌 주요 기능

### 🎨 App.tsx

블록노트(BlockNote) 기반의 마크다운 에디터 메인 컴포넌트입니다.

**주요 특징:**

- 💬 한국어 로컬라이제이션 지원
- 🛠️ 커스텀 포맷팅 툴바
  - 제목 스타일
  - 굵게
  - 기울임
  - 취소선
  - 코드
  - 링크
- ⚡ 슬래시(/) 커맨드 메뉴
- 🎯 실시간 마크다운 변환

### 🔄 parseMarkdownToBlocks.ts

마크다운 텍스트를 BlockNote 에디터 포맷으로 변환하는 파서입니다.

**지원하는 마크다운 문법:**

- 📑 제목 (H1-H3)
- 💭 인용구
- 📝 목록
  - 순서 있는 목록
  - 순서 없는 목록
  - 체크리스트
- ✨ 인라인 스타일
  - **굵게**
  - _기울임_
  - ~~취소선~~

## 🛠️ 기술 스택

- React 19
- TypeScript
- Vite
- TailwindCSS
- BlockNote Editor (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`)

### 주요 개발 의존성

````json
{
  "@blocknote/core": "^0.29.1",
  "@blocknote/react": "^0.29.1",
  "@blocknote/shadcn": "^0.29.1",
  "tailwindcss": "^4.1.3",
  "react": "^19.0.0"
}
````

## 📋 요구사항

- Node.js >= 20
- pnpm 9.12.3 이상

## 🚀 시작하기

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트 검사
pnpm lint

# 코드 포맷팅
pnpm format
````
