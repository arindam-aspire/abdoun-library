import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        "primary-light": "var(--primary-light)",
        accent: "var(--accent)",
        secondary: "var(--secondary)",
        "secondary-light": "var(--secondary-light)",
        "secondary-dark": "var(--secondary-dark)",
        tertiary: "var(--tertiary)",
        "tertiary-dark": "var(--tertiary-dark)",
        "tertiary-light": "var(--tertiary-light)",
        page: "var(--page)",
        "page-ghost":
          "color-mix(in srgb, var(--page) 20%, var(--surface))",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",
        success: "var(--success)",
        danger: "var(--danger)",
        info: "var(--info)",
        "inherit-color": "var(--inherit)",
        "inherit-light": "var(--inherit-light)",
        "card-background": "var(--card-background)",
      },
    },
  },
  plugins: [],
};

export default config;
