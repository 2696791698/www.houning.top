export type ThemeMode = "dark" | "light";

const THEME_COOKIE_KEY = "theme";

export function useThemeMode() {
  // useCookie返回的是一个Ref<T>
  const themeCookie = useCookie<ThemeMode | null>(THEME_COOKIE_KEY, {
    default: () => null
  });

  const theme = useState<ThemeMode>("theme-mode", () => {
    return themeCookie.value === "light" ? "light" : "dark";
  });

  const setTheme = (mode: ThemeMode) => {
    theme.value = mode;
    themeCookie.value = mode;
    
    // 添加/移除 dark class
    if (import.meta.client) {
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
  };

  const initTheme = () => {
    if (import.meta.server) {
      return;
    }

    if (themeCookie.value === "dark" || themeCookie.value === "light") {
      theme.value = themeCookie.value;
      // 初始化时也要设置 class
      if (themeCookie.value === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme.value = prefersDark ? "dark" : "light";
    // 根据系统偏好设置 class
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  };

  return {
    theme,
    initTheme,
    setTheme,
    toggleTheme
  };
}
