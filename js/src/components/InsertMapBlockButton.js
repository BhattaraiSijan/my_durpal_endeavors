import React from 'react';

const mapBlockFullSnippet = `

<Block type='full'>
  <Figure>
    <Widget heading='Interactive Map Title'>
        <MapBlock
          datasetId='sandbox'
          layerId='no2-monthly' 
          dateTime='2020-01-01T00:00:00Z'
        />
        <Caption attrAuthor="Data Source Name" attrUrl="#">
          A descriptive caption for the map.
        </Caption>
    </Widget>
  </Figure>
  <Prose>
    Additional context, explanation, or narrative about the map can go here.
  </Prose>
</Block>
`;

const InsertMapBlockButton = ({ editorRef }) => {
  const handleInsertMap = () => {
    if (editorRef.current) {
      if (typeof editorRef.current.getMarkdown === 'function' && typeof editorRef.current.setMarkdown === 'function') {
        const currentMarkdown = editorRef.current.getMarkdown() || '';
        const newContent = currentMarkdown + (currentMarkdown.trim() ? '\n\n' : '') + mapBlockFullSnippet;
        
        editorRef.current.setMarkdown(newContent);
        
        if (typeof editorRef.current.focus === 'function') {
          editorRef.current.focus(); 
        }
      } else {
        console.error("InsertMapBlockButton: getMarkdown or setMarkdown method not found on editorRef.current.");
      }
    } else {
      console.error("InsertMapBlockButton: Editor ref is not available when button clicked.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleInsertMap}
      title="Insert Map Structure"
    >
      Insert Map
    </button>
  );
};

export default InsertMapBlockButton;