import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("ai-guardian-theme");

    return savedTheme !== "light";
  });

  const toggleTheme = () => {
    setDarkMode((previousTheme) => !previousTheme);
  };

  useEffect(() => {
    document.body.classList.toggle("light-theme", !darkMode);

    localStorage.setItem(
      "ai-guardian-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}