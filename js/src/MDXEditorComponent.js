import React, { useEffect, useState, useRef, Fragment } from 'react';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  quotePlugin,
  thematicBreakPlugin,
  tablePlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  jsxPlugin,
  GenericJsxEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle, 
  CreateLink, 
  InsertCodeBlock, 
  InsertTable, 
  ListsToggle,
  BlockTypeSelect,
  InsertThematicBreak,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import InsertMapBlockButton from './components/InsertMapBlockButton';
import MapBlockPreviewInEditor from './components/MapBlockPreviewEditor';
import MapBlockInteractiveEditor from './components/MapBlockInteractiveEditor';
import MapEditor from './MapEditor';

const vedaComponentDescriptors = [
  {
    name: 'MapBlock',
    kind: 'flow',
    props: [
      { name: 'datasetId', type: 'string' }, { name: 'layerId', type: 'string' },
      { name: 'dateTime', type: 'string' }, { name: 'compareDateTime', type: 'string' },
      { name: 'compareLabel', type: 'string' }, { name: 'projectionId', type: 'string' },
      { name: 'projectionCenter', type: 'expression' }, { name: 'projectionParallels', type: 'expression' },
      { name: 'allowProjectionChange', type: 'boolean' }
    ],
    hasChildren: false,
    Editor: MapBlockInteractiveEditor,
  },
  { name: 'Block', kind: 'flow', props: [{ name: 'type', type: 'string' }], hasChildren: true, Editor: GenericJsxEditor },
  { name: 'Figure', kind: 'flow', props: [], hasChildren: true, Editor: GenericJsxEditor },
  { name: 'Widget', kind: 'flow', props: [{ name: 'heading', type: 'string' }], hasChildren: true, Editor: GenericJsxEditor },
  { name: 'Caption', kind: 'flow', props: [ { name: 'attrAuthor', type: 'string' }, { name: 'attrUrl', type: 'string' }, ], hasChildren: true, Editor: GenericJsxEditor },
  { name: 'Prose', kind: 'flow', props: [], hasChildren: true, Editor: GenericJsxEditor },
  { name: 'ScrollytellingBlock', kind: 'flow', props: [], hasChildren: true, Editor: GenericJsxEditor },
  {
    name: 'Chapter',
    kind: 'flow',
    props: [
      { name: 'id', type: 'string' }, { name: 'title', type: 'string' },
      { name: 'center', type: 'expression' }, { name: 'zoom', type: 'number' },
      { name: 'datasetId', type: 'string' }, { name: 'layerId', type: 'string' },
      { name: 'datetime', type: 'string' },
    ],
    hasChildren: true,
    Editor: GenericJsxEditor
  },
];

const MDXEditorComponent = ({ textarea, initialContent }) => {
  const [markdown, setMarkdown] = useState(initialContent || '');
  const editorRef = useRef(null);

  useEffect(() => {
    if (textarea) {
      textarea.value = markdown || '';
      textarea.setAttribute('data-mdx-updated', 'true');
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  }, [markdown, textarea]);

  const handleChange = (content) => {
    const stringContent = content && typeof content === 'string' ? content : '';
    console.log('MDX content changed:', stringContent);
    setMarkdown(stringContent);
  };

  return (
    <div className="mdx-editor-wrapper">
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={handleChange}
        plugins={[
          jsxPlugin({
            jsxComponentDescriptors: vedaComponentDescriptors
          }),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(), 
          toolbarPlugin({
            toolbarContents: () => (
              <Fragment>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <BlockTypeSelect /> 
                <CreateLink />
                <InsertCodeBlock />
                <InsertTable />
                <CodeToggle />
                <InsertThematicBreak />
                <InsertMapBlockButton editorRef={editorRef} />
              </Fragment>
            ),
          }),
          linkDialogPlugin(),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        ]}
      />
    </div>
  );
};

export default MDXEditorComponent;
