import React, { useEffect, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { EmitInterface } from 'test01-emit';
import {CloudBrowse} from 'sanjog-browseui-test';

// const queryClient = new QueryClient();

// const getAttributeValue = (mdastNode, attributeName, defaultValue = undefined) => {
//   if (!mdastNode || !Array.isArray(mdastNode.attributes)) {
//     return defaultValue;
//   }
//   const attr = mdastNode.attributes.find(a => a.name === attributeName);

//   if (!attr) {
//     return defaultValue;
//   }

//   if (attr.value && typeof attr.value === 'object' && attr.value.type === 'mdxJsxAttributeValueExpression') {
//     try {
//       const estree = attr.value.data?.estree;
//       if (estree && estree.body && estree.body.length > 0 && estree.body[0].type === 'ExpressionStatement') {
//         const expression = estree.body[0].expression;
//         if (expression.type === 'Literal') {``
//           return expression.value;
//         } else if (expression.type === 'ArrayExpression' || expression.type === 'ObjectExpression') {
//           const stringifiedValue = attr.value.value;
//           if (typeof stringifiedValue === 'string') {
//             try {
//               const jsonFriendlyString = stringifiedValue.replace(/'/g, '"');
//               return JSON.parse(jsonFriendlyString);
//             } catch (jsonError) {
//               return stringifiedValue;
//             }
//           }
//         }
//       }
//     } catch (e) { /* Fall through */ }
//     return attr.value.value;
//   }
  
//   let value = attr.value;
//   if (typeof value === 'string') {
//     const lcValue = value.toLowerCase().trim();
//     if (lcValue === 'true') return true;
//     if (lcValue === 'false') return false;
//   }
  
//   return value;
// };


const EmitInterfacePreviewEditor = ({ mdastNode }) => {
  // State to prevent rendering until the environment is stable.
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Inject Mapbox CSS
    const mapboxCssId = 'mapbox-gl-css';
    if (!document.getElementById(mapboxCssId)) {
      const link = document.createElement('link');
      link.id = mapboxCssId;
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }

    // This timeout is the crucial step to defeat the race condition.
    // It gives the editor environment time to stabilize before we attempt to render.
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000); 

    return () => {
      clearTimeout(timer);
      const link = document.getElementById(mapboxCssId);
      if (link) {
        link.remove();
      }
    };
  }, []);

  // We only build the props *after* the delay, when we are ready to render.
  // const collectionId = getAttributeValue(mdastNode, 'collectionId');

  // if (!collectionId && isReady) {
  //   return (
  //     <div style={{ padding: '10px', border: '1px dashed orangered', color: 'orangered', backgroundColor: '#fff5e6' }}>
  //       EmitInterface Preview Error: Missing required `collectionId` attribute.
  //     </div>
  //   );
  // }

  // const config = {
  //   mapboxToken: process.env.MDX_EDITOR_EMIT_MAPBOX_TOKEN || "pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA",
  //   geoApifyKey: process.env.MDX_EDITOR_EMIT_GEOAPIFY_KEY || "YOUR_FALLBACK_GEOAPIFY_KEY",
  //   mapboxStyle: "mapbox://styles/covid-nasa",
  //   basemapStyle: "cldu1cb8f00ds01p6gi583w1m",
  //   defaultCollectionId: collectionId,
  //   // Other default values
  //   stacApiUrl: "https://earth.gov/ghgcenter/api/stac/collections/emit-ch4plume-v1/items",
  //   metadataEndpoint: "https://earth.jpl.nasa.gov/emit-mmgis-lb/Missions/EMIT/Layers/coverage/combined_plume_metadata.json",
  //   coverageUrl: "https://earth.jpl.nasa.gov/emit-mmgis/Missions/EMIT/Layers/coverage/coverage_pub.json",
  //   baseStacApiUrl: "https://earth.gov/ghgcenter/api/stac/",
  //   rasterApiUrl: "https://earth.gov/ghgcenter/api/raster",
  //   latlonEndpoint: "https://api.geoapify.com/v1/geocode/reverse",
  //   publicUrl: "",
  //   defaultZoomLocation: [-98.771556, 32.967243],
  //   defaultZoomLevel: 4,
  //   defaultStartDate: "2022-08-22",
  // };

  // const finalProps = {
  //   config,
  //   collectionId,
  //   zoomLocation: getAttributeValue(mdastNode, 'zoomLocation'),
  //   zoomLevel: getAttributeValue(mdastNode, 'zoomLevel'),
  // };

   const browseconfig = {
    cloudWatchUrlBase: "https://api.cors.lol/?url=https://data.ghg.center",
    sourceIMGUrl: "https://api.cors.lol/?url=https://data.ghg.center",
    version: "v3.3.3",
    excluded_prefixes: ["browseui"]
  }

  console.log("1>>>>>>>>>>>>>>>>", browseconfig)
  console.log("2>>>>>>>>>>>>>>>>", CloudBrowse)

  // console.log("EmitInterfacePreviewEditor: Rendering with props:", finalProps);
  return (
    <div style={{
      border: '1px solid #2ECC71', padding: '10px', margin: '5px',
      backgroundColor: '#E8F8F5', position: 'relative', overflow: 'hidden', minHeight: '550px'
    }}>
      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '0.9em', color: '#1E8449', textAlign: 'center' }}>
        EMIT Interface Preview
      </p>
      
      {isReady ? (
        <div className="App">
              <CloudBrowse config={browseconfig}/>
            </div>
      ) : (
        <div style={{textAlign: 'center', paddingTop: '50px', fontStyle: 'italic'}}>
          Preparing preview...
        </div>
      )}
    </div>
  );
};

export default EmitInterfacePreviewEditor;
