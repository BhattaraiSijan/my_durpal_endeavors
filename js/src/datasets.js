const datasetsForVedaProvider = {
  "lpjeosim-wetlandch4-grid-v1": {
    id: "lpjeosim-wetlandch4-grid-v1",
    data: {
      id: "lpjeosim-wetlandch4-grid-v1",
      name: "Wetland Methane Emissions, LPJ-EOSIM Model (Minimal)",
      description: "Global monthly and daily 0.5 degree resolution estimates of wetland methane emissions from the LPJ-EOSIM model, version 1",
      usage: [], media: {}, taxonomy: [], infoDescription: "Minimal description for LPJ-EOSIM dataset.",
      layers: [
        {
          id: 'ch4-wetlands-emissions-m-ens',
          stacCol: 'lpjeosim-wetlandch4-monthgrid-v1',
          name: '(Monthly) Ensemble Mean Wetland CH₄ Emissions LPJ-EOSIM Model',
          type: 'raster',
          description: 'Monthly CH₄ emissions from wetlands constructed using an ensemble of climate forcing data sources input to the LPJ-EOSIM model (mean of ERA5 and MERRA-2 layers)',
          initialDatetime: 'newest',
          projection: { id: 'equirectangular' },
          zoomExtent: [0, 20],
          sourceParams: { assets: 'ensemble-mean-ch4-wetlands-emissions', colormap_name: 'magma', rescale: [0, 3e-9] },
          compare: { datasetId: 'lpjeosim-wetlandch4-grid-v1', layerId: 'ch4-wetlands-emissions-m-ens', mapLabel: "::js ({ dateFns, datetime, compareDatetime }) => { if (dateFns && datetime && compareDatetime) return `${dateFns.format(datetime, 'LLLraquinone')} VS ${dateFns.format(compareDatetime, 'LLLraquinone')}`; }" },
          legend: { unit: { label: 'kg CH₄/m²/s' }, type: 'gradient', min: 0, max: 3e-9, stops: ["#2c115f", "#721f81", "#b73779", "#f1605d", "#feb078"] },
          analysis: { metrics: ["mean"], sourceParams: { dst_crs: "+proj=cea" } },
          info: { source: "NASA", spatialExtent: "Global", temporalResolution: "Monthly", unit: "kg CH₄/m²/s" },
          params_config: [
            {
              id: 'datetime',
              name: 'Date',
              type: 'datetime',
              domain: [], 
              default: 'newest'
            }
          ],
          sources: []
        }
        // Ensure all layers from lpjeosim that might be used by Scrollytelling are fully defined here
      ]
    }
  },
  "sandbox": {
    id: "sandbox",
    data: {
      id: "sandbox",
      name: "Sandbox Dataset (for MapBlock Preview)",
      description: "Dataset for testing MapBlock previews.",
      usage: [], media: {}, taxonomy: [], infoDescription: "Sandbox dataset.",
      layers: [
        {
          id: 'nightlights-hd-monthly', // Layer used in your initialContent
          stacCol: 'some-dummy-stac-collection-nightlights',
          name: 'HD Nightlights Monthly (Preview)',
          type: 'raster',
          description: 'Monthly HD Nightlights for preview.',
          initialDatetime: '2020-03-01T00:00:00Z',
          projection: { id: 'equirectangular' },
          zoomExtent: [0, 18],
          sourceParams: { assets: 'cog_default', colormap_name: 'viridis', rescale: [0, 100] },
          legend: { unit: { label: 'Radiance' }, type: 'gradient', min: 0, max: 100, stops: ["#000004", "#3B0F70", "#8C2981", "#DE4968", "#FE9F6D", "#FCFDBF"] },
          mapLabel: 'HD Nightlights Preview',
          compare: { datasetId: 'sandbox', layerId: 'nightlights-hd-monthly', mapLabel: "Comparison View" },
          analysis: { metrics: ["mean"], sourceParams: { dst_crs: "+proj=cea" } },
          info: { source: "Mock Data", spatialExtent: "Global", temporalResolution: "Monthly", unit: "nW/cm²/sr" },
          params_config: [
            {
              id: 'datetime',
              name: 'Observation Date',
              type: 'datetime',
              domain: ['2020-01-01T00:00:00Z', '2020-12-31T23:59:59Z'], 
              default: '2020-03-01T00:00:00Z' 
            }
          ],
          sources: []
        },
        {
          id: 'no2-monthly', 
          stacCol: 'no2-monthly-diff',
          name: 'NO₂ Monthly Layer (Preview)',
          type: 'raster',
          description: 'Monthly NO₂ levels for preview.',
          initialDatetime: '2020-01-01T00:00:00Z',
          projection: { id: 'equirectangular' },
          zoomExtent: [0, 20],
          sourceParams: { assets: 'cog_default', colormap_name: 'rdbu_r', rescale: [-8e15, 8e15] },
          legend: { unit: { label: 'NO₂ Level (ppb)' }, type: 'gradient', min: -8e15, max: 8e15, stops: ["#67001F", "#B2182B", "#D6604D", "#F4A582", "#FDDBC7", "#F7F7F7", "#D1E5F0", "#92C5DE", "#4393C3", "#2166AC", "#053061"] },
          mapLabel: 'NO₂ Monthly (Sandbox Preview)',
          compare: { datasetId: 'sandbox', layerId: 'no2-monthly', mapLabel: "Comparison" },
          analysis: { metrics: ["mean"], sourceParams: { dst_crs: "+proj=cea" } },
          info: { source: "Mock Source", spatialExtent: "Global", temporalResolution: "Monthly", unit: "ppb" },
          params_config: [
            {
              id: 'datetime',
              name: 'Observation Date',
              type: 'datetime',
              domain: ['2020-01-01T00:00:00Z', '2020-12-31T23:59:59Z'],
              default: '2020-01-01T00:00:00Z'
            }
          ],
          sources: []
        }
      ]
    }
  }
};

export default datasetsForVedaProvider;
