import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { MDXEditor, corePlugin, importMarkdownToLexical, listsPlugin, headingsPlugin, quotePlugin, codeBlockPlugin, thematicBreakPlugin, tablePlugin } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './renderer-styles.css';

const MDXRendererComponent = ({ content, style = 'default' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setReadOnly(true);
    }
  }, []);

  return (
    <div className={`mdx-renderer-wrapper mdx-style-${style}`}>
      <MDXEditor
        ref={editorRef}
        markdown={content}
        readOnly={true}
        plugins={[
          corePlugin(),
          listsPlugin(),
          headingsPlugin(),
          quotePlugin(),
          codeBlockPlugin(),
          thematicBreakPlugin(),
          tablePlugin()
        ]}
      />
    </div>
  );
};

(function ($, Drupal, once) {
  Drupal.behaviors.mdxRenderer = {
    attach: function (context, settings) {
      once('mdx-renderer', '.mdx-rendered-content', context).forEach(function (element) {
        const content = element.getAttribute('data-content');
        const style = element.getAttribute('data-style') || 'default';
        
        try {
          const root = createRoot(element);
          root.render(
            <MDXRendererComponent 
              content={content}
              style={style}
            />
          );
        } catch (error) {
          console.error('Error rendering MDX content:', error);
          element.innerHTML = `<div class="mdx-renderer-error">
            <p>Error rendering content.</p>
            <pre>${content}</pre>
          </div>`;
        }
      });
    }
  };
})(jQuery, Drupal, once);

export default MDXRendererComponent;