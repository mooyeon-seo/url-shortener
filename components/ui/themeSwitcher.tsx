"use client";
import { useTheme } from "next-themes";

/**
 * A component that allows the user to switch between light and dark themes. (Custom)
 * @returns {JSX.Element} The theme switcher.
 * @example
 * <ThemeSwitcher />
 */
const ThemeSwitcher = () => {
  const { setTheme } = useTheme();

  return <>
    <button onClick={() => {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    }} className="text-sm md:text-lg hover:-translate-y-0.5 inline dark:hidden">☀️</button>
    <button onClick={
      () => {
        setTheme('light');
        localStorage.setItem('theme', 'light');
      }} className="text-sm md:text-lg hover:-translate-y-0.5 hidden dark:inline" >🌙️</button >
  </>
};

export { ThemeSwitcher };
