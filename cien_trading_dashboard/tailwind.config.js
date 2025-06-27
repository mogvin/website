/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // CIEN brand blue - blue-600
        'primary-50': '#EFF6FF', // Light blue tint - blue-50
        'primary-100': '#DBEAFE', // Lighter blue - blue-100
        'primary-500': '#3B82F6', // Medium blue - blue-500
        'primary-700': '#1D4ED8', // Darker blue - blue-700
        'primary-900': '#1E3A8A', // Darkest blue - blue-900

        // Secondary Colors
        'secondary': '#7C3AED', // Purple accent - violet-600
        'secondary-50': '#F5F3FF', // Light purple tint - violet-50
        'secondary-100': '#EDE9FE', // Lighter purple - violet-100
        'secondary-500': '#8B5CF6', // Medium purple - violet-500
        'secondary-700': '#6D28D9', // Darker purple - violet-700
        'secondary-900': '#4C1D95', // Darkest purple - violet-900

        // Accent Colors
        'accent': '#06B6D4', // Cyan highlight - cyan-500
        'accent-50': '#ECFEFF', // Light cyan tint - cyan-50
        'accent-100': '#CFFAFE', // Lighter cyan - cyan-100
        'accent-400': '#22D3EE', // Medium cyan - cyan-400
        'accent-600': '#0891B2', // Darker cyan - cyan-600
        'accent-900': '#164E63', // Darkest cyan - cyan-900

        // Background Colors
        'background': '#0F172A', // Deep slate background - slate-900
        'background-800': '#1E293B', // Elevated background - slate-800
        'background-700': '#334155', // Lighter background - slate-700

        // Surface Colors
        'surface': '#1E293B', // Elevated surface - slate-800
        'surface-700': '#334155', // Lighter surface - slate-700
        'surface-600': '#475569', // Medium surface - slate-600

        // Text Colors
        'text-primary': '#F8FAFC', // High contrast white - slate-50
        'text-secondary': '#94A3B8', // Muted slate - slate-400
        'text-tertiary': '#64748B', // Subtle text - slate-500
        'text-inverse': '#0F172A', // Dark text on light backgrounds - slate-900

        // Status Colors
        'success': '#10B981', // Professional green - emerald-500
        'success-50': '#ECFDF5', // Light success tint - emerald-50
        'success-100': '#D1FAE5', // Lighter success - emerald-100
        'success-600': '#059669', // Darker success - emerald-600
        'success-900': '#064E3B', // Darkest success - emerald-900

        'warning': '#F59E0B', // Amber warning - amber-500
        'warning-50': '#FFFBEB', // Light warning tint - amber-50
        'warning-100': '#FEF3C7', // Lighter warning - amber-100
        'warning-600': '#D97706', // Darker warning - amber-600
        'warning-900': '#92400E', // Darkest warning - amber-900

        'error': '#EF4444', // Critical red - red-500
        'error-50': '#FEF2F2', // Light error tint - red-50
        'error-100': '#FEE2E2', // Lighter error - red-100
        'error-600': '#DC2626', // Darker error - red-600
        'error-900': '#7F1D1D', // Darkest error - red-900

        // Border Colors
        'border': 'rgba(148, 163, 184, 0.1)', // Subtle border - slate-400 with opacity
        'border-light': 'rgba(148, 163, 184, 0.05)', // Lighter border
        'border-medium': 'rgba(148, 163, 184, 0.2)', // Medium border
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '240': '60rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-ambient': 'pulse-ambient 2s ease-in-out infinite',
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-in': 'slideIn 200ms ease-out',
      },
      keyframes: {
        'pulse-ambient': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slideIn': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        'trading': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '100': '100',
        '200': '200',
        '300': '300',
        '400': '400',
      },
    },
  },
  plugins: [],
}