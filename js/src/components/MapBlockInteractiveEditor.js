import React, { useState, useCallback, useEffect } from 'react';
import {
  VedaUIProvider,
  DevseedUiThemeProvider,
  MapBlock,
} from '@teamimpact/veda-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useMdastNodeUpdater } from '@mdxeditor/editor';

import datasetsForVedaProvider from '../datasets.js';
import { theme } from '../theme.js';

const queryClient = new QueryClient();

const getAttributeValue = (mdastNode, attributeName, defaultValue = undefined) => {
  if (!mdastNode || !Array.isArray(mdastNode.attributes)) {
    return defaultValue;
  }
  const attr = mdastNode.attributes.find(a => a.name === attributeName);
  if (!attr) return defaultValue;

  if (attr.value && typeof attr.value === 'object' && attr.value.type === 'mdxJsxAttributeValueExpression') {
    try {
      const estree = attr.value.data?.estree;
      if (estree && estree.body && estree.body.length > 0 && estree.body[0].type === 'ExpressionStatement') {
        const expression = estree.body[0].expression;
        if (expression.type === 'Literal') {
          return expression.value;
        }
        if ((expression.type === 'ArrayExpression' || expression.type === 'ObjectExpression') && typeof attr.value.value === 'string') {
          return attr.value.value;
        }
      }
    } catch (e) { /* Fall through */ }
    return attr.value.value; 
  }

  let value = attr.value;
  if (typeof value === 'string') {
    const lcValue = value.toLowerCase().trim();
    if (lcValue === 'true') return true;
    if (lcValue === 'false') return false;
  }
  return value;
};

const createAttributeAstNode = (name, value) => {
  if (typeof value === 'boolean') {
    return { type: 'mdxJsxAttribute', name, value: { type: 'mdxJsxAttributeValueExpression', value: value ? 'true' : 'false' } };
  }
  if (typeof value === 'number') {
    return { type: 'mdxJsxAttribute', name, value: { type: 'mdxJsxAttributeValueExpression', value: String(value) } };
  }
  if (typeof value === 'string' && (value.trim().startsWith('[') && value.trim().endsWith(']')) || (value.trim().startsWith('{') && value.trim().endsWith('}'))) {
    return { type: 'mdxJsxAttribute', name, value: { type: 'mdxJsxAttributeValueExpression', value: value } };
  }
  return { type: 'mdxJsxAttribute', name, value: String(value) };
};

const MapBlockInteractiveEditor = ({ mdastNode }) => {
  const updateMdastNode = useMdastNodeUpdater();

  const [formState, setFormState] = useState({
    datasetId: 'sandbox',
    layerId: 'no2-monthly',
    dateTime: '',
  });

  const [previewProps, setPreviewProps] = useState({});
  const [isPreviewValid, setIsPreviewValid] = useState(false);

  useEffect(() => {
    const newFormState = {
      datasetId: getAttributeValue(mdastNode, 'datasetId', 'sandbox'),
      layerId: getAttributeValue(mdastNode, 'layerId', 'no2-monthly'),
      dateTime: getAttributeValue(mdastNode, 'dateTime', ''),
    };
    setFormState(newFormState);
    updatePreview(newFormState);
  }, [mdastNode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const updatePreview = useCallback((currentFormValues) => {
    const {
        datasetId, layerId, dateTime, compareDateTime, compareLabel,
        projectionId, projectionCenterStr, projectionParallelsStr, allowProjectionChange
    } = currentFormValues;

    const currentDataset = datasetsForVedaProvider[datasetId];
    const currentLayer = currentDataset?.data?.layers.find(l => l.id === layerId);

    if (currentDataset && currentLayer) {
      setIsPreviewValid(true);
      const newPreviewProps = { datasetId, layerId };
      if (dateTime) newPreviewProps.dateTime = dateTime;
      if (compareDateTime) newPreviewProps.compareDateTime = compareDateTime;
      if (compareLabel) newPreviewProps.compareLabel = compareLabel;
      if (projectionId) newPreviewProps.projectionId = projectionId;
      
      let parsedCenter, parsedParallels;
      if (projectionCenterStr) {
        try { parsedCenter = JSON.parse(projectionCenterStr); } catch (e) { /* Keep undefined or pass string if MapBlock can handle */ }
      }
      if (projectionParallelsStr) {
        try { parsedParallels = JSON.parse(projectionParallelsStr); } catch (e) { /* Keep undefined or pass string */ }
      }
      if (parsedCenter !== undefined) newPreviewProps.projectionCenter = parsedCenter;
      if (parsedParallels !== undefined) newPreviewProps.projectionParallels = parsedParallels;
      
      newPreviewProps.allowProjectionChange = allowProjectionChange;
      newPreviewProps.datasets = datasetsForVedaProvider;
      setPreviewProps(newPreviewProps);
    } else {
      setIsPreviewValid(false);
      setPreviewProps({ datasetId, layerId });
    }
  }, []);

  const handleCommitChanges = useCallback(() => {
    const newAttributes = [];
    if (formState.datasetId) newAttributes.push(createAttributeAstNode('datasetId', formState.datasetId));
    if (formState.layerId) newAttributes.push(createAttributeAstNode('layerId', formState.layerId));
    if (formState.dateTime) newAttributes.push(createAttributeAstNode('dateTime', formState.dateTime));
    updateMdastNode({ attributes: newAttributes });
    updatePreview(formState);
  }, [formState, updateMdastNode, updatePreview]);
  
  const mapboxToken = process.env.MDX_EDITOR_MAPBOX_TOKEN || "YOUR_FALLBACK_MAPBOX_TOKEN_HERE";
  const apiStacEndpoint = process.env.MDX_EDITOR_API_STAC_ENDPOINT || "https://openveda.cloud/api/stac";
  const apiRasterEndpoint = process.env.MDX_EDITOR_API_RASTER_ENDPOINT || "https://openveda.cloud/api/raster";

  const commonInputProps = (name) => ({
    name: name,
    onBlur: handleCommitChanges,
    style: {width: '100%', padding: '6px', boxSizing: 'border-box', marginBottom: '2px'}
  });
  const labelStyle = {display: 'block', marginBottom: '2px', fontSize: '0.85em', fontWeight: '500'};

  return (
    <div style={{ border: '2px solid #28a745', padding: '15px', margin: '5px', backgroundColor: '#f0fff0' }}>
      <h4 style={{ marginTop: 0, marginBottom: '12px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>Edit MapBlock Properties</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px 18px', marginBottom: '20px' }}>
        <div><label style={labelStyle} htmlFor="datasetId">Dataset ID:</label><input type="text" id="datasetId" {...commonInputProps('datasetId')} value={formState.datasetId} onChange={handleInputChange} /></div>
        <div><label style={labelStyle} htmlFor="layerId">Layer ID:</label><input type="text" id="layerId" {...commonInputProps('layerId')} value={formState.layerId} onChange={handleInputChange} /></div>
        <div><label style={labelStyle} htmlFor="dateTime">Date/Time:</label><input type="text" id="dateTime" {...commonInputProps('dateTime')} value={formState.dateTime} onChange={handleInputChange} placeholder="YYYY-MM-DDTHH:mm:ssZ" /></div>
      </div>

      <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '15px' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '0.9em', color: '#2C3E50', textAlign: 'center' }}>
          Live Map Preview
        </p>
        <div style={{ minHeight: '350px', position: 'relative', border: '1px solid lightgrey' }}>
          {isPreviewValid && previewProps.datasetId && previewProps.layerId ? (
            <QueryClientProvider client={queryClient}>
                <DevseedUiThemeProvider theme={theme}>
                  <VedaUIProvider
                    config={{
                      envMapboxToken: mapboxToken,
                      envApiStacEndpoint: apiStacEndpoint,
                      envApiRasterEndpoint: apiRasterEndpoint,
                      datasets: datasetsForVedaProvider,
                      navigation: { LinkComponent: 'a', linkProps: { pathAttributeKeyName: 'href' } },
                      theme: theme,
                    }}
                  >
                    {(previewProps.datasetId && previewProps.layerId) && <MapBlock {...previewProps} />}
                  </VedaUIProvider>
                </DevseedUiThemeProvider>
            </QueryClientProvider>
          ) : (
            <p style={{textAlign: 'center', color: 'grey', padding: '20px'}}>
              Preview unavailable: Ensure Dataset ID ('{previewProps.datasetId || formState.datasetId || 'empty'}') and Layer ID ('{previewProps.layerId || formState.layerId || 'empty'}') are valid.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapBlockInteractiveEditor;