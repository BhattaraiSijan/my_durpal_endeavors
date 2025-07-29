import React, { ReactNode } from 'react';
import DataProvider from '../store/providers/data';
import VedaUIConfigProvider from '../store/providers/veda-ui-config';
import DevseedUIThemeProvider from '../store/providers/theme';
import { DatasetMetadata } from '../types/content';

interface ProviderProps {
  datasets?: DatasetMetadata[];
  children: ReactNode;
}

export default function Providers({ datasets, children }: ProviderProps) {
  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        {datasets ? (
          <DataProvider initialDatasets={datasets}>{children}</DataProvider>
        ) : (
          children
        )}
      </VedaUIConfigProvider>
    </DevseedUIThemeProvider>
  );
}
