// 文件: tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  // 【关键修改】在这里添加 typography 插件
  plugins: [
    require('@tailwindcss/typography'),
  ],
};