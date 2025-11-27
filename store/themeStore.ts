

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "light",

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        set({ theme: newTheme });

        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(newTheme);
        }
      },

      setTheme: (theme) => {
        set({ theme });

        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(theme);
        }
      },
    }),
    {
      name: "theme-storage",
    }
  )
);








// "use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type Theme = "light" | "dark";

// interface ThemeStore {
//   theme: Theme;
//   toggleTheme: () => void;
//   setTheme: (theme: Theme) => void;
// }

// export const useThemeStore = create<ThemeStore>()(
//   persist(
//     (set, get) => ({
//       theme: "light",

//       toggleTheme: () => {
//         const newTheme = get().theme === "light" ? "dark" : "light";
//         set({ theme: newTheme });

//         // Apply theme to <html>
//         if (typeof document !== "undefined") {
//           document.documentElement.classList.toggle("dark", newTheme === "dark");
//         }
//       },

//       setTheme: (theme) => {
//         set({ theme });

//         if (typeof document !== "undefined") {
//           document.documentElement.classList.toggle("dark", theme === "dark");
//         }
//       },
//     }),
//     {
//       name: "theme-storage",
//     }
//   )
// );













