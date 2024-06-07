import { defineConfig, pluginCreator, preset } from '@ziloen/tailwind-config'

export default defineConfig({
  content: ['./src/**/*.{ts,tsx,html}'],
  darkMode: ['variant', [`[data-theme="dark"] &`, `:host([data-theme="dark"]) &`],],
  theme: {
    extend: {
      colors: preset.theme.colors,
      screens: {
        "<sm": {
          max: '640px',
        },
        "<md": {
          max: '768px',
        },
        "<lg": {
          max: '1024px',
        },
        "<xl": {
          max: '1280px',
        },
        '<2xl': {
          max: '1536px',
        },
      }
    },
  },
  experimental: {
    // Remove unused global css variables, e.g. --tw-translate-x: 0;
    optimizeUniversalDefaults: true,

    // matchVariant: true,
  },

  /**
   * @satisfies {import("tailwindcss/types/config").PluginsConfig}
   */
  plugins: [pluginCreator],
})
