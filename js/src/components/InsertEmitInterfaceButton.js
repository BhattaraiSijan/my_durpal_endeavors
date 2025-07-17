import React from 'react';

/**
 * This constant holds the simple JSX tag for the EmitInterface.
 * The MDX editor is configured to recognize this specific tag and render
 * a live preview for it using the EmitInterfacePreviewEditor component.
 * Note that array values like zoomLocation must be wrapped in curly braces {}.
 */
const EmitInterfaceMdx = `<CloudBrowse 
 
/>`;

/**
 * A toolbar button component for the MDXEditor that inserts a pre-configured
 * EmitInterface component into the editor's content.
 */
const InsertEmitInterfaceButton = ({ editorRef }) => {
  const handleInsertEmitInterface = () => {
    if (editorRef.current) {
      // These checks ensure that the editor is fully initialized
      if (typeof editorRef.current.getMarkdown === 'function' && typeof editorRef.current.setMarkdown === 'function') {
        const currentMarkdown = editorRef.current.getMarkdown() || '';
        
        // Append the new component to the end of the document, ensuring there's a newline
        const newContent = currentMarkdown + (currentMarkdown.trim() ? '\n\n' : '') + EmitInterfaceMdx;
        
        console.log("Inserting EMIT Interface content:", EmitInterfaceMdx);
        editorRef.current.setMarkdown(newContent);
        
        // Focus the editor after inserting the content
        if (typeof editorRef.current.focus === 'function') {
          editorRef.current.focus(); 
        }
      } else {
        console.error("getMarkdown or setMarkdown method not found on editorRef.current.");
      }
    } else {
      console.error("Editor ref is not available when button clicked.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleInsertEmitInterface}
      title="Insert EMIT Interface"
      // Basic styling to make the button fit in with the editor toolbar
      style={{
        fontFamily: 'inherit',
        fontSize: '14px',
        padding: '4px 8px',
        marginLeft: '4px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      EMIT
    </button>
  );
};

export default InsertEmitInterfaceButton;
