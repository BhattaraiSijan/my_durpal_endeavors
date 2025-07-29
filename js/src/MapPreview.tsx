'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { transformToVedaData } from './content/utils/data';
import DataProvider from './store/providers/data';
import VedaUIConfigProvider from './store/providers/veda-ui-config';
import DevseedUIThemeProvider from './store/providers/theme';
import type { DatasetWithContent } from './types/content';

// Import MapBlock dynamically to avoid SSR issues
const MapBlock = dynamic(() => import('./lib').then((mod) => mod.MapBlock), {
  ssr: false,
  loading: () => (
    <div className='h-[250px] flex items-center justify-center'>
      Loading map...
    </div>
  ),
});

interface MapPreviewProps {
  allAvailableDatasets?: DatasetWithContent[];
  datasets?: DatasetWithContent[];
  datasetId?: string;
  layerId?: string;
  [key: string]: any;
}

export function ClientMapBlock(props: MapPreviewProps) {
  // Use allAvailableDatasets if datasets is not provided
  const datasetsToUse = props.datasets || props.allAvailableDatasets || [];
  const transformed = transformToVedaData(datasetsToUse as any);
  // // Find the specific dataset that matches the datasetId prop
  // const relevantDataset = React.useMemo(() => {
  //   if (!props.datasetId || datasetsToUse.length === 0) {
  //     return null;
  //   }
    
  //   return datasetsToUse.find(dataset => 
  //     dataset.metadata?.id === props.datasetId
  //   );
  // }, [datasetsToUse, props.datasetId]);

  // Transform only the relevant dataset
  // const transformed = React.useMemo(() => {
  //   if (!relevantDataset) {
  //     console.warn(`Dataset with ID ${props.datasetId} not found in available datasets`);
  //     return {};
  //   }
  //   try {
  //     const result = transformToVedaData([relevantDataset] as any);
  //     console.log('Transform result:', result);
  //     return result;
  //   } catch (error) {
  //     console.error('Error transforming data:', error);
  //     return {};
  //   }
  // }, [relevantDataset, props.datasetId]);

  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        <DataProvider initialDatasets={[datasetsToUse]}>
          <div className='relative w-full h-[250px]'>
            <MapBlock 
              {...props} 
              datasets={transformed}
            />
          </div>
        </DataProvider>
      </VedaUIConfigProvider>
    </DevseedUIThemeProvider>
  );
}

// Make sure ClientMapBlock is the default export for dynamic imports to work correctly
export default ClientMapBlock;