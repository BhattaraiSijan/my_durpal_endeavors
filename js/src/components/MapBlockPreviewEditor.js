import React from 'react';

const getAttributeValue = (mdastNode, attributeName, defaultValue = undefined) => {
  if (!mdastNode?.attributes) return defaultValue;
  
  const attr = mdastNode.attributes.find(a => a.name === attributeName);
  if (!attr) return defaultValue;
  
  // Handle JSX expression attributes
  if (attr.value?.type === 'mdxJsxAttributeValueExpression') {
    try {
      const value = attr.value.value;
      if (typeof value === 'string') {
        // Try to parse arrays/objects
        if (value.startsWith('[') || value.startsWith('{')) {
          return JSON.parse(value.replace(/'/g, '"'));
        }
      }
      return value;
    } catch {
      return attr.value.value;
    }
  }
  
  // Handle boolean strings
  const value = attr.value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
  }
  
  return value;
};

const MapBlockPreviewInEditor = ({ mdastNode }) => {
  // Extract all props
  const props = {
    datasetId: getAttributeValue(mdastNode, 'datasetId'),
    layerId: getAttributeValue(mdastNode, 'layerId'),
    dateTime: getAttributeValue(mdastNode, 'dateTime'),
    compareDateTime: getAttributeValue(mdastNode, 'compareDateTime'),
    compareLabel: getAttributeValue(mdastNode, 'compareLabel', ''),
    projectionId: getAttributeValue(mdastNode, 'projectionId', 'equirectangular'),
    projectionCenter: getAttributeValue(mdastNode, 'projectionCenter'),
    projectionParallels: getAttributeValue(mdastNode, 'projectionParallels'),
    allowProjectionChange: getAttributeValue(mdastNode, 'allowProjectionChange', true)
  };

  // Validation
  if (!props.datasetId || !props.layerId) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '2px dashed #e74c3c', 
        borderRadius: '8px',
        backgroundColor: '#fee',
        margin: '10px 0'
      }}>
        <strong>⚠️ MapBlock Error:</strong> Missing required props
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Required: datasetId="{props.datasetId || '???'}" layerId="{props.layerId || '???'}"
        </div>
      </div>
    );
  }

  // Static preview - NO ACTUAL MAP RENDERING
  return (
    <div style={{
      border: '2px solid #3498db',
      borderRadius: '8px',
      padding: '20px',
      margin: '10px 0',
      backgroundColor: '#f0f8ff',
      position: 'relative',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Map icon placeholder */}
      <div style={{
        fontSize: '48px',
        marginBottom: '15px',
        opacity: 0.6
      }}>
        🗺️
      </div>
      
      {/* Component info */}
      <div style={{
        textAlign: 'center',
        color: '#2c3e50'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>MapBlock Component</h3>
        
        <div style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#555'
        }}>
          <div><strong>Dataset:</strong> {props.datasetId}</div>
          <div><strong>Layer:</strong> {props.layerId}</div>
          {props.dateTime && <div><strong>Date:</strong> {props.dateTime}</div>}
          {props.compareDateTime && <div><strong>Compare Date:</strong> {props.compareDateTime}</div>}
          {props.projectionId !== 'equirectangular' && 
            <div><strong>Projection:</strong> {props.projectionId}</div>
          }
        </div>
      </div>
      
      {/* Preview note */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        fontSize: '12px',
        color: '#999',
        fontStyle: 'italic'
      }}>
        Editor Preview
      </div>
    </div>
  );
};

export default MapBlockPreviewInEditor;