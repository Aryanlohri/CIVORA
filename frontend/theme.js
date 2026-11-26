/**
 * Tailwind Theme Extension for CIVORA SchemeConnect AI
 * Palette: "Milk, Oat, Taupe, Mocha, Charcoal"
 * - Milk:     #FBF7F4
 * - Oat:      #E5DED2
 * - Taupe:    #A39382
 * - Mocha:    #685D54
 * - Charcoal: #232323
 */
export const civoraTheme = {
  colors: {
    bg: '#232323',
    surface: {
      DEFAULT: '#2B2A29',
      hover: '#323130',
    },
    elevated: {
      DEFAULT: '#383634',
      hover: '#403E3C',
    },
    border: {
      DEFAULT: 'rgba(104, 93, 84, 0.45)',
      subtle: 'rgba(251, 247, 244, 0.05)',
      strong: '#685D54',
      accent: 'rgba(163, 147, 130, 0.45)',
    },
    text: {
      DEFAULT: '#FBF7F4',
      2: '#E5DED2',
      muted: '#A39382',
    },
    mocha: '#685D54',
    taupe: '#A39382',
    oat: '#E5DED2',
    milk: '#FBF7F4',
    charcoal: '#232323',
    accent: {
      DEFAULT: '#E5DED2',
      taupe: '#A39382',
      soft: 'rgba(229, 222, 210, 0.12)',
      hover: '#FBF7F4',
      hairline: 'rgba(163, 147, 130, 0.35)',
    },
    sand: {
      DEFAULT: '#E5DED2',
      soft: 'rgba(229, 222, 210, 0.12)',
    },
    success: {
      DEFAULT: '#6FCF97',
      soft: 'rgba(111, 207, 151, 0.12)',
    },
  },
  borderRadius: {
    card: '14px',
    control: '10px',
    tag: '6px',
  },
  fontFamily: {
    sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
  },
  letterSpacing: {
    heading: '-0.02em',
    label: '0.08em',
  },
  boxShadow: {
    'inner-highlight': 'inset 0 1px 0 rgba(251, 247, 244, 0.06)',
    'inner-highlight-hover': 'inset 0 1px 0 rgba(251, 247, 244, 0.10)',
    'selected-soft': '0 0 20px rgba(163, 147, 130, 0.12)',
  },
};

export default civoraTheme;
