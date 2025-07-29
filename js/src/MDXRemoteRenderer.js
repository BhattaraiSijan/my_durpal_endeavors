import React, { Suspense, useEffect, useState, useMemo, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { evaluate } from '@mdx-js/mdx';
import * as jsxs_runtime from 'react/jsx-runtime';

import {
  VedaUIProvider,
  DevseedUiThemeProvider,
  Chapter,
  ScrollytellingBlock,
  Block,
  Figure,
  Widget,
  MapBlock,
  Caption,
  Prose
} from '@teamimpact/veda-ui';

import { theme } from '../../../veda/js/theme';
import './renderer-styles.css';

const queryClient = new QueryClient();
import mockDatasets from './datasets';

const drupalVedaSettings = {
  mapbox_token: process.env.MDX_EDITOR_MAPBOX_TOKEN,
  api_stac_endpoint: process.env.MDX_EDITOR_API_STAC_ENDPOINT,
  api_raster_endpoint: process.env.MDX_EDITOR_API_RASTER_ENDPOINT,
};

const basicComponents = {
  h1: (props) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
  h2: (props) => <h2 className="text-xl font-bold mt-5 mb-3" {...props} />,
  p: (props) => <p className="mb-4" {...props} />,
  ul: (props) => <ul className="list-disc ml-5 mb-4" {...props} />,
  code: (props) => {
    const { className, children, ...rest } = props;
    const isBlock = (children && typeof children === 'string' && children.includes('\n')) || (className && className.startsWith('language-'));
    if (isBlock) {
      const language = className ? className.replace('language-', '') : '';
      return ( <pre className={`mdx-code-block bg-gray-800 text-white p-4 rounded my-4 overflow-x-auto ${language ? 'language-' + language : ''}`}> <code className={className || ''} {...rest}>{children}</code> </pre> );
    }
    return <code className="bg-gray-200 text-red-700 px-1 py-0.5 rounded" {...rest}>{children}</code>;
  },
};

const MDXRemoteInternalRenderer = ({ content, style = 'default', enableComponents = true }) => {
  const [RenderedMdxModule, setRenderedMdxModule] = useState(null);

  const allComponentsForMdx = useMemo(() => {
    return {
        ...basicComponents,
        ...(enableComponents ? {
            Chapter: Chapter,
            ScrollytellingBlock: (scrollyProps) => {
                const validChildren = React.Children.toArray(scrollyProps.children)
                    .filter(child => React.isValidElement(child) && child.type === Chapter);
                return (
                    <ScrollytellingBlock {...scrollyProps} datasets={mockDatasets} children={validChildren} />
                );
            },
            Block: Block,
            Figure: Figure,
            Widget: Widget,
            Caption: Caption,
            Prose: Prose,
            MapBlock: (props) => {
                const { children, ...rest } = props;
                return <MapBlock {...rest} datasets={mockDatasets} children={children} />;
            },
        } : {})
    };
  }, [enableComponents]);

  useEffect(() => {
    const renderMDX = async () => {
      if (!enableComponents) {
        setRenderedMdxModule(() => () => <div className="prose max-w-none"><p>Custom components disabled.</p><hr/><pre>{content || "No content"}</pre></div>);
        return;
      }
      let contentToEvaluate = content;

      if (!contentToEvaluate) {
        setRenderedMdxModule(() => () => <p className="text-gray-500">No MDX content provided.</p>);
        return;
      }

      if (typeof contentToEvaluate === 'string') {
        contentToEvaluate = contentToEvaluate.replace(/&#x20;/g, ' ');
        contentToEvaluate = contentToEvaluate.replace(/&nbsp;/g, ' ');
        contentToEvaluate = contentToEvaluate.replace(/\u00A0/g, ' ');
        contentToEvaluate = contentToEvaluate.replace(/\\(<)/g, '$1');
        contentToEvaluate = contentToEvaluate.replace(/\\(<\/)/g, '$1');
        contentToEvaluate = contentToEvaluate.replace(/\\(>)/g, '$1');
        contentToEvaluate = contentToEvaluate.replace(/\\(\[)/g, '$1');
        contentToEvaluate = contentToEvaluate.replace(/\\(\])/g, '$1');
      }

      try {
        const evaluatedModule = await evaluate(contentToEvaluate, {
          ...jsxs_runtime,
          Fragment: Fragment,
          useMDXComponents: () => allComponentsForMdx,
        });
        setRenderedMdxModule(() => evaluatedModule.default);
      } catch (err) {
        console.error("MDX Evaluation Error", err);
        setRenderedMdxModule(() => () => (null));
      }
    };
    renderMDX();
  }, [content, allComponentsForMdx, enableComponents]);

  if (!RenderedMdxModule) {
    return <div className="mdx-loading p-4 text-gray-500">Loading MDX...</div>;
  }

  const MDXContentComponent = RenderedMdxModule;

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DevseedUiThemeProvider theme={theme}>
          <VedaUIProvider
            config={{
              envMapboxToken: drupalVedaSettings.mapbox_token,
              envApiStacEndpoint: drupalVedaSettings.api_stac_endpoint,
              envApiRasterEndpoint: drupalVedaSettings.api_raster_endpoint,
              datasets: mockDatasets,
              navigation: {
                LinkComponent: 'a',
                linkProps: { pathAttributeKeyName: 'href' }
              },
              theme: theme,
            }}
          >
            <Suspense fallback={<div className="mdx-rendering-suspense p-4 text-gray-500">Rendering content...</div>}>
              <MDXContentComponent />
            </Suspense>
          </VedaUIProvider>
        </DevseedUiThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

(function ($, Drupal, once) {
  if (!Drupal || !$ || !once) {
    return;
  }
  function getLocalDrupalSetting(keys, defaultValue = null) {
    let current = window.drupalSettings;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    return current;
  }
  Drupal.behaviors.mdxRemoteRenderer = {
    attach: function (context, settings) {
      const rendererSettings = getLocalDrupalSetting(['mdx_editor'], {});
      const placeholders = once('mdx-remote', '.mdx-remote-container', context);
      if (Object.keys(rendererSettings).length === 0 || placeholders.length === 0) {
        return;
      }
      const settingsMap = new Map();
      for (const uniqueId in rendererSettings) {
        if (Object.hasOwnProperty.call(rendererSettings, uniqueId) && uniqueId.startsWith('mdx-remote-')) {
            settingsMap.set(uniqueId, rendererSettings[uniqueId]);
        }
      }
      if (settingsMap.size === 0) {
        return;
      }
      placeholders.forEach((element) => {
        const uniqueId = element.id && settingsMap.has(element.id) ? element.id : Array.from(settingsMap.keys())[0];
        if (uniqueId && settingsMap.has(uniqueId)) {
            const mdxSettings = settingsMap.get(uniqueId);
            const drupalContent = mdxSettings.content;
            const style = mdxSettings.style || 'default';
            const enableComponents = mdxSettings.enable_components === true || String(mdxSettings.enable_components).toLowerCase() === 'true' || mdxSettings.enable_components === 1;
            
            element.innerHTML = '';
            const root = createRoot(element);
            root.render(
                <MDXRemoteInternalRenderer
                    content={drupalContent}
                    style={style}
                    enableComponents={enableComponents}
                />
            );
            settingsMap.delete(uniqueId);
        }
      });
    }
  };
})(jQuery, Drupal, window.once);
