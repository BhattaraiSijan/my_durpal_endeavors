import React from 'react';
import { useMdastNodeUpdater } from '@mdxeditor/editor';

const MapBlockInteractiveEditor = ({ mdastNode }) => {
  // Correct: The hook returns a single update function.
  const updateMdastNode = useMdastNodeUpdater();

  // Safeguard against missing attributes on initial render
  const attributes = mdastNode.attributes || [];

  const getAttribute = (name) => {
    const attr = attributes.find(a => a.name === name);
    return attr ? attr.value : '';
  };

  const handleAttributeChange = (e, name) => {
    const otherAttributes = attributes.filter(a => a.name !== name);
    const newAttributes = [...otherAttributes, { type: 'mdxJsxAttribute', name, value: e.target.value }];
    
    // Correct: Call the update function with the new node properties.
    updateMdastNode({ attributes: newAttributes });
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#f9f9f9' }}>
      <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold' }}>Interactive Map Block</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.9rem' }}>Dataset ID:</span>
          <input
            type="text"
            value={getAttribute('datasetId')}
            onChange={(e) => handleAttributeChange(e, 'datasetId')}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.9rem' }}>Layer ID:</span>
          <input
            type="text"
            value={getAttribute('layerId')}
            onChange={(e) => handleAttributeChange(e, 'layerId')}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </label>
      </div>
    </div>
  );
};

export default MapBlockInteractiveEditor;