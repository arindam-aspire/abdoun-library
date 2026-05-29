import React from "react";
import type { Preview } from "@storybook/react-vite";
import type { Decorator } from "@storybook/react";

import "./storybook-base.css";
import abdounThemeCss from "./theme_abdoun_web.css?raw";
import mlsThemeCss from "./theme_abdoun_mls_web.css?raw";

const THEME_CSS = {
  abdoun: abdounThemeCss,
  mls: mlsThemeCss,
} as const;

const ThemeSwitcher: Decorator = (Story, context) => {
  const themeName = (context.globals.theme ?? "abdoun") as keyof typeof THEME_CSS;
  const colorMode = context.globals.colorMode ?? "light";

  React.useLayoutEffect(() => {
    let styleTag = document.getElementById("sb-theme-vars");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "sb-theme-vars";
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = THEME_CSS[themeName] ?? THEME_CSS.abdoun;

    const root = document.documentElement;
    root.classList.toggle("dark", colorMode === "dark");
    root.classList.toggle("light", colorMode === "light");
    root.setAttribute(
      "data-app-theme",
      themeName === "mls" ? "abdoun-mls-web" : "abdoun-web",
    );
    root.setAttribute("data-color-scheme", colorMode);
  }, [themeName, colorMode]);

  return (
    <div className="text-text min-h-[120px] p-4">
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [ThemeSwitcher],
  globalTypes: {
    theme: {
      name: "App Theme",
      description: "Switch between Abdoun and MLS brand tokens",
      defaultValue: "abdoun",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "abdoun", title: "Abdoun Website" },
          { value: "mls", title: "MLS Website" },
        ],
        dynamicTitle: true,
      },
    },
    colorMode: {
      name: "Color Mode",
      description: "Light or dark appearance",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
