/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // Azul marinho muito escuro
        foreground: "#f8fafc", // Branco acinzentado para textos
        card: "#1e293b",       // Cinza azulado para a sidebar e cards
        primary: "#3b82f6",    // Azul para botões de ação
        accent: "#10b981",     // Verde (cor de mesa de sinuca) para detalhes
      },
    },
  },
  plugins: [],
};