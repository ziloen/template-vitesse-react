import { defineConfig, pluginCreator, preset } from "@ziloen/tailwind-config"

export default defineConfig({
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: preset.theme.colors
    }
  },
  experimental: {
    // Remove unused global css variables, e.g. --tw-translate-x: 0;
    optimizeUniversalDefaults: true,

    // matchVariant: true,
  },

  /**
   * @satisfies {import("tailwindcss/types/config").PluginsConfig}
   */
  plugins: [
    pluginCreator,
  ],
})
