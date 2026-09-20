export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

/**
 * Applies the saved theme before first paint. The root layout injects this into
 * <head> so that a direct load of any route — /ai, /ml, /dl, a week page — starts
 * in the reader's theme instead of flashing light and getting stuck there.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;
