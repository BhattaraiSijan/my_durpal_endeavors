import { createUITheme } from '@devseed-ui/theme-provider';

export const theme = createUITheme({
  color: {
    base: '#443F3F',
    surface: '#FFFFFF',
    primary: '#CF3F02',
    secondary: '#E2C044',
    danger: '#A71D31',
    success: '#2E7D32',
    info: '#1976D2',
    warning: '#ED6C02',
    link: '#2276ac',
    base50: '#F8F8F8',
    base100: '#F0F0F0',
    base200: '#E0E0E0',
    base300: '#C0C0C0',
    base400: '#A0A0A0',
    base500: '#808080',
    base600: '#606060',
    base700: '#404040',
    base800: '#202020',
    base900: '#000000',
    base100a: 'rgba(68, 63, 63, 0.1)',
    base200a: 'rgba(68, 63, 63, 0.2)',
    base300a: 'rgba(68, 63, 63, 0.3)',
    base400a: 'rgba(68, 63, 63, 0.4)',
    base500a: 'rgba(68, 63, 63, 0.5)',
    base600a: 'rgba(68, 63, 63, 0.6)',
    base700a: 'rgba(68, 63, 63, 0.7)',
    base800a: 'rgba(68, 63, 63, 0.8)',
    base900a: 'rgba(68, 63, 63, 0.9)'
  },
  type: {
    base: {
      family: '"Public Sans",sans-serif',
      size: '1rem',
      lineHeight: '1.5',
      weight: '400',
      leadSize: '1.25rem',
      extrabold: '800',
      line: 'inherit',
      sizeIncrement: {
        small: '0rem',
        medium: '0rem',
        large: '0.25rem',
        xlarge: '0.25rem'
      }
    },
    heading: {
      family: '"Public Sans",sans-serif',
      size: '1.5rem',
      lineHeight: '1.2',
      weight: '700',
      settings: '"wdth" 100, "wght" 700'
    },
    overline: {
      family: '"Public Sans",sans-serif',
      size: '0.875rem',
      lineHeight: '1.5',
      weight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  },
  layout: {
    space: '1rem',
    border: '1px',
    min: '320px',
    max: '1280px',
    glspMultiplier: {
      xsmall: 1,
      small: 1,
      medium: 1.5,
      large: 2,
      xlarge: 2
    }
  },
  shape: {
    rounded: '0.25rem',
    ellipsoid: '320rem'
  },
  boxShadow: {
    inset: 'inset 0px 0px 3px 0px rgba(68,63,63,0.04)',
    input: '0 -1px 1px 0 rgba(68,63,63,0.08), 0 2px 6px 0 rgba(68,63,63,0.16)',
    elevationA: '0 0 4px 0 rgba(68,63,63,0.08), 0 2px 2px 0 rgba(68,63,63,0.08)',
    elevationB: '0 0 4px 0 rgba(68,63,63,0.08), 0 4px 4px 0 rgba(68,63,63,0.08)',
    elevationC: '0 0 4px 0 rgba(68,63,63,0.08), 0 8px 12px 0 rgba(68,63,63,0.08)'
  },
  button: {
    type: {
      primary: {
        background: 'var(--veda-color-primary)',
        color: '#FFFFFF',
        hover: {
          background: 'var(--veda-color-primary-dark)'
        }
      },
      secondary: {
        background: 'var(--veda-color-secondary)',
        color: '#FFFFFF',
        hover: {
          background: 'var(--veda-color-secondary-dark)'
        }
      }
    },
    shape: {
      rounded: '0.25rem',
      padding: '0.5rem 1rem'
    }
  },
  mediaRanges: {
    xsmall: ['0px', '480px'],
    small: ['481px', '768px'],
    medium: ['769px', '1024px'],
    large: ['1025px', '1440px'],
    xlarge: ['1441px', '1920px']
  },
  zIndices: {
    hide: -1,
    docked: 10,
    sticky: 900,
    dropdown: 1550,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
});