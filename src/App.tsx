import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';

import { BlockNoteEditor, filterSuggestionItems } from '@blocknote/core';
import { ko } from '@blocknote/core/locales';
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  CreateLinkButton,
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';
import { DefaultReactSuggestionItem } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import { useCallback, useEffect, useState } from 'react';

type SuggestionItem = DefaultReactSuggestionItem & {
  key: (typeof SELECTED_SLASH_MENU_ITEMS)[number];
};

const SELECTED_SLASH_MENU_ITEMS = [
  'heading',
  'heading_2',
  'heading_3',
  'quote',
  'numbered_list',
  'bullet_list',
  'check_list',
  'paragraph',
  'emoji',
  'code_block',
] as const;

const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => {
  const defaultItems = getDefaultReactSlashMenuItems(editor);
  return defaultItems.filter((item) =>
    SELECTED_SLASH_MENU_ITEMS.includes((item as SuggestionItem).key)
  );
};

export function App() {
  const locale = ko;

  const [markdown, setMarkdown] = useState<string>('');

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    dictionary: {
      ...locale, // i18n 한국어 설정
      placeholders: {
        ...locale.placeholders,
        emptyDocument: '내용을 입력하거나 /로 명령을 입력해주세요',
      },
    },
  });

  const onChange = useCallback(async () => {
    // Converts the editor's contents from Block objects to Markdown and store to state.
    const markdownOutput = await editor.blocksToMarkdownLossy(editor.document);
    setMarkdown(markdownOutput);
    // console.log(markdownOutput); // markdown 결과물 확인용
  }, [editor]);

  useEffect(() => {
    // on mount, trigger initial conversion of the initial content to md
    if (editor.document) {
      onChange();
    }
  }, [editor.document, onChange]);

  // Renders the editor instance using a React component.
  return (
    <main className="flex min-h-screen items-center bg-gray-50 p-4">
      <form className="mx-auto w-[90%] md:w-[60%]">
        <article className="h-[calc(100vh-2rem)] w-full min-w-[320px] rounded-lg bg-white p-6 md:h-[660px]">
          <header className="mb-4">
            <div className="mb-2">
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-bold text-neutral-400"
              >
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="제목을 입력해주세요"
                className="w-full rounded-lg bg-neutral-100 p-3 text-base font-bold text-neutral-400"
              />
            </div>
          </header>

          <section className="flex h-[calc(100%-5rem)] flex-col overflow-hidden">
            <label
              id="content-label"
              className="mb-1 block text-sm font-bold text-neutral-400"
            >
              상세 내용
            </label>
            <BlockNoteView
              aria-labelledby="content-label"
              editor={editor}
              formattingToolbar={false}
              slashMenu={false}
              sideMenu={false}
              onChange={onChange}
              className="min-h-0 flex-1 overflow-auto text-sm leading-tight font-medium [&_.bn-editor]:!bg-neutral-100 [&_.bn-editor]:!px-0 [&_.bn-editor]:!text-neutral-400 [&.bn-container]:rounded-lg [&.bn-container]:bg-neutral-100 [&.bn-container]:p-3"
            >
              <FormattingToolbarController
                formattingToolbar={() => (
                  <FormattingToolbar>
                    <BlockTypeSelect key={'blockTypeSelect'} />
                    <BasicTextStyleButton
                      basicTextStyle={'bold'}
                      key={'boldStyleButton'}
                    />
                    <BasicTextStyleButton
                      basicTextStyle={'italic'}
                      key={'italicStyleButton'}
                    />
                    <BasicTextStyleButton
                      basicTextStyle={'strike'}
                      key={'strikeStyleButton'}
                    />
                    {/* Extra button to toggle code styles */}
                    <BasicTextStyleButton
                      key={'codeStyleButton'}
                      basicTextStyle={'code'}
                    />
                    <CreateLinkButton key={'createLinkButton'} />
                  </FormattingToolbar>
                )}
              />
              <SuggestionMenuController
                triggerCharacter={'/'}
                // Replaces the default Slash Menu items with our custom ones.
                getItems={async (query) =>
                  filterSuggestionItems(getCustomSlashMenuItems(editor), query)
                }
              />
            </BlockNoteView>
          </section>
        </article>
      </form>
    </main>
  );
}
