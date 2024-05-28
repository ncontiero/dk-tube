import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  // prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: "Inter, sans-serif",
      },
      screens: {
        xs: "590px",
        mdlg: "880px",
      },
    },
  },
  plugins: [],
};

export default config;
