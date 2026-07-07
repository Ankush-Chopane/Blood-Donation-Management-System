import { createContext } from 'react';

export const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {}
});

export default ThemeContext;
