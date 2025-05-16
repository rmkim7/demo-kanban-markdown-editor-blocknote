import {
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
  PartialBlock,
  StyledText,
} from '@blocknote/core';

export function parseMarkdownToBlocks(
  markdown: string
): PartialBlock<
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema
>[] {
  function parseInlineContent(
    text: string
  ): (string | StyledText<DefaultStyleSchema>)[] {
    const content: (string | StyledText<DefaultStyleSchema>)[] = [];

    // 모든 인라인 스타일 패턴 정의
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, style: 'bold' },
      { regex: /__(.*?)__/g, style: 'bold' },
      { regex: /\*(.*?)\*/g, style: 'italic' },
      { regex: /_(.*?)_/g, style: 'italic' },
      { regex: /~~(.*?)~~/g, style: 'strike' },
      { regex: /~(.*?)~/g, style: 'strike' },
    ];

    // 현재 처리되지 않은 텍스트
    let remainingText = text;

    while (remainingText) {
      // 가장 먼저 나타나는 패턴 찾기
      let earliestMatch = null;
      let earliestPattern = null;
      let earliestIndex = Infinity;

      for (const pattern of patterns) {
        pattern.regex.lastIndex = 0; // 정규식 검색 위치 초기화
        const match = pattern.regex.exec(remainingText);
        if (match && match.index < earliestIndex) {
          earliestMatch = match;
          earliestPattern = pattern;
          earliestIndex = match.index;
        }
      }

      if (earliestMatch && earliestPattern) {
        // 스타일 적용 전의 일반 텍스트 추가
        if (earliestIndex > 0) {
          content.push(remainingText.slice(0, earliestIndex));
        }

        // 스타일이 적용된 텍스트 추가
        const styledText: StyledText<DefaultStyleSchema> = {
          type: 'text',
          text: earliestMatch[1],
          styles: {
            [earliestPattern.style]: true,
          },
        };
        content.push(styledText);

        // 남은 텍스트 업데이트
        remainingText = remainingText.slice(
          earliestIndex + earliestMatch[0].length
        );
      } else {
        // 더 이상 매칭되는 패턴이 없으면 남은 텍스트 추가
        content.push(remainingText);
        break;
      }
    }

    return content;
  }

  const blocks: PartialBlock<
    DefaultBlockSchema,
    DefaultInlineContentSchema,
    DefaultStyleSchema
  >[] = [];
  const lines = markdown.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle empty lines - 줄바꿈
    if (!line.trim()) {
      blocks.push({
        type: 'paragraph',
        content: '',
      });
      continue;
    }

    // Handle headings
    const headingRegex = /^(#{1,3})\s+(.*)$/;
    const headingMatch = line.match(headingRegex);

    if (headingMatch) {
      const [, hashes, content] = headingMatch;
      const level =
        hashes.length === 1
          ? 1
          : hashes.length === 2
            ? 2
            : hashes.length === 3
              ? 3
              : undefined;
      blocks.push({
        type: 'heading',
        content: parseInlineContent(content),
        props: {
          level,
        },
      });
      continue;
    }

    // Handle quotes
    const quoteRegex = /^\s*>+\s?(.*)$/; // >, >>, >>> 등 모두 인식
    const quoteMatch = line.match(quoteRegex);

    if (quoteMatch) {
      const [, content] = quoteMatch;
      blocks.push({
        type: 'quote',
        content: parseInlineContent(content),
      });
      continue;
    }

    // Handle list items
    const listRegex = /^(\s*)([-*+]|\d+\.)\s+(\[(\s|[xX])\]\s*)?(.+)$/;
    const listMatch = line.match(listRegex);

    if (listMatch) {
      const [, , marker, , checkmark, content] = listMatch;
      const isNumbered = /^\d+\.$/.test(marker);
      const isChecklist = !!checkmark;

      if (isChecklist) {
        blocks.push({
          type: 'checkListItem',
          content: parseInlineContent(content.trim()),
          props: {
            checked: /[xX]/.test(checkmark),
          },
        });
      } else if (isNumbered) {
        // start는 1이 아닌 경우만 props에 포함
        const startNum = parseInt(marker);
        blocks.push({
          type: 'numberedListItem',
          content: parseInlineContent(content.trim()),
          props: startNum !== 1 ? { start: startNum } : {},
        });
      } else {
        blocks.push({
          type: 'bulletListItem',
          content: parseInlineContent(content.trim()),
          props: {}, // props는 비워둠
        });
      }
      continue;
    }

    // Handle regular paragraphs
    blocks.push({
      type: 'paragraph',
      content: parseInlineContent(line),
    });
  }

  return blocks;
}

export const markdownContent = `## 📌 어떤 기능인가요?

> 이 기능이 왜 필요한지, 어떤 효과를 기대할 수 있는지 등 추가하려는 기능에 대해 설명해 주세요.

## 🛠 작업 상세 내용

- [ ] 할 일 1
- [ ] 할 일 2
- [ ] 할 일 3

## 🔗 참고할만한 자료 (선택)

> 관련 문서, 링크 등을 첨부해 주세요.

## 🐞 버그 설명

1. **어떤 화면**에서
2. **어떤 동작을 했을 때**
3. **어떤 문제가 발생했는지**
   발견한 버그에 대해 발생 과정과 함께 설명해 주세요.

## 📷 예상 결과 vs 실제 결과

- **예상 결과:** 정상 동작 시 기대했던 결과
- **실제 결과:** 버그 발생 시 나타나는 문제

## 🖥 환경 정보

- 운영체제(OS): (예: Windows 10, macOS Ventura)
- 브라우저 & 버전: (예: Chrome 119, Edge 120)
- 기타 (선택): (예: API 버전, 프레임워크 버전 등)

## 📎 참고 자료 (선택)

> 관련 로그, 콘솔 오류 메시지, 스크린샷 등을 첨부해 주세요.`;
