import { LanguageProvider } from "../src/i18n/LanguageProvider";
import type { Preview } from "@storybook/react-vite";
// @ts-ignore
import { ThemeContextProvider } from "../src/theme/ThemeContext.tsx";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  decorators: (Story) => (
    // @ts-ignore
    <LanguageProvider>
      <ThemeContextProvider>
        {/* @ts-ignore */}
        <Story />
      </ThemeContextProvider>
    </LanguageProvider>
  ),
};

export default preview;
