import { darkIcon, lightIcon } from "../assets/icons";

const toggleButton = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme)) {
  document.documentElement.classList.add("dark");
  toggleButton.innerHTML = darkIcon;
} else {
  document.documentElement.classList.remove("dark");
  toggleButton.innerHTML = lightIcon;
}

toggleButton.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const theme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  localStorage.setItem("theme", theme);
  toggleButton.innerHTML = theme === "dark" ? darkIcon : lightIcon;
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.classList.toggle("dark", e.matches);
      toggleButton.innerHTML = e.matches ? darkIcon : lightIcon;
    }
  });
