import React from 'react';
import {
  VedaUIProvider,
  DevseedUiThemeProvider,
  MapBlock,
} from '@teamimpact/veda-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import datasetsForVedaProvider from '../datasets.js'; 
import { theme } from '../../../../veda/js/theme';   

const queryClient = new QueryClient();

const getAttributeValue = (mdastNode, attributeName, defaultValue = undefined) => {
  if (!mdastNode || !Array.isArray(mdastNode.attributes)) {
    return defaultValue;
  }
  const attr = mdastNode.attributes.find(a => a.name === attributeName);

  if (!attr) {
    return defaultValue;
  }

  if (attr.value && typeof attr.value === 'object' && attr.value.type === 'mdxJsxAttributeValueExpression') {
    try {
      const estree = attr.value.data?.estree;
      if (estree && estree.body && estree.body.length > 0 && estree.body[0].type === 'ExpressionStatement') {
        const expression = estree.body[0].expression;
        if (expression.type === 'Literal') {
          return expression.value; 
        } else if (expression.type === 'ArrayExpression' || expression.type === 'ObjectExpression') {
          const stringifiedValue = attr.value.value; 
          if (typeof stringifiedValue === 'string') {
            try {
              const jsonFriendlyString = stringifiedValue.replace(/'/g, '"');
              return JSON.parse(jsonFriendlyString);
            } catch (jsonError) {
              return stringifiedValue; 
            }
          }
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


const MapBlockPreviewInEditor = ({ mdastNode }) => {
  const datasetId = getAttributeValue(mdastNode, 'datasetId');
  const layerId = getAttributeValue(mdastNode, 'layerId');
  const dateTime = getAttributeValue(mdastNode, 'dateTime');
  const compareDateTime = getAttributeValue(mdastNode, 'compareDateTime');
  const compareLabel = getAttributeValue(mdastNode, 'compareLabel', '');
  const projectionId = getAttributeValue(mdastNode, 'projectionId', 'equirectangular');
  const projectionCenter = getAttributeValue(mdastNode, 'projectionCenter'); 
  const projectionParallels = getAttributeValue(mdastNode, 'projectionParallels'); 
  const allowProjectionChange = getAttributeValue(mdastNode, 'allowProjectionChange', true); 

  if (!datasetId || !layerId) {
    return (
      <div style={{ padding: '10px', border: '1px dashed orangered', color: 'orangered', backgroundColor: '#fff5e6' }}>
        MapBlock Preview Error: Missing `datasetId` or `layerId`.
        <pre>{JSON.stringify(mdastNode?.attributes, null, 2)}</pre>
      </div>
    );
  }

  const mapboxToken = process.env.MDX_EDITOR_MAPBOX_TOKEN || "YOUR_FALLBACK_MAPBOX_TOKEN_HERE";
  const apiStacEndpoint = process.env.MDX_EDITOR_API_STAC_ENDPOINT || "https://openveda.cloud/api/stac";
  const apiRasterEndpoint = process.env.MDX_EDITOR_API_RASTER_ENDPOINT || "https://openveda.cloud/api/raster";

  const mapBlockFinalProps = { datasetId, layerId };
  if (dateTime !== undefined) mapBlockFinalProps.dateTime = dateTime;
  if (compareDateTime !== undefined) mapBlockFinalProps.compareDateTime = compareDateTime;
  if (compareLabel !== undefined && compareLabel !== '') mapBlockFinalProps.compareLabel = compareLabel;
  if (projectionId !== undefined) mapBlockFinalProps.projectionId = projectionId;
  if (projectionCenter !== undefined) mapBlockFinalProps.projectionCenter = projectionCenter;
  if (projectionParallels !== undefined) mapBlockFinalProps.projectionParallels = projectionParallels;
  if (typeof allowProjectionChange === 'boolean') {
    mapBlockFinalProps.allowProjectionChange = allowProjectionChange;
  } else if (allowProjectionChange !== undefined) { 
    mapBlockFinalProps.allowProjectionChange = String(allowProjectionChange).toLowerCase() === 'true';
  }

  // Add datasets directly as a prop to MapBlock
  mapBlockFinalProps.datasets = datasetsForVedaProvider;

  console.log("MapBlockPreviewInEditor: Final props being passed to Veda MapBlock (with direct datasets prop):", JSON.stringify(mapBlockFinalProps, null, 2));

  return (
    <div style={{
      border: '1px solid #4A90E2', padding: '10px', margin: '5px',
      backgroundColor: '#E9F5FF', minHeight: '400px', position: 'relative', overflow: 'hidden'
    }}>
      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '0.9em', color: '#2C3E50', textAlign: 'center' }}>
        Map Preview (Dataset: {datasetId}, Layer: {layerId})
      </p>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DevseedUiThemeProvider theme={theme}>
            <VedaUIProvider
              config={{
                envMapboxToken: mapboxToken,
                envApiStacEndpoint: apiStacEndpoint,
                envApiRasterEndpoint: apiRasterEndpoint,
                datasets: datasetsForVedaProvider, // Still provide to VedaUIProvider for other potential context consumers
                navigation: { LinkComponent: 'a', linkProps: { pathAttributeKeyName: 'href' } },
                theme: theme,
              }}
            >
              {/* Pass datasetsForVedaProvider directly to MapBlock as well */}
              <MapBlock {...mapBlockFinalProps} />
            </VedaUIProvider>
          </DevseedUiThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
      <div style={{fontSize: '0.8em', marginTop: '10px', color: '#777', textAlign: 'center', borderTop: '1px solid #ddd', paddingTop: '5px'}}>
        (Live preview.)
      </div>
    </div>
  );
};

export default MapBlockPreviewInEditor;
