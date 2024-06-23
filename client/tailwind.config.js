/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite", // Change 3s to your desired duration
      },
      gridTemplateColumns: {
        // Add your custom grid widths here
        sm: "10%, 80%, 10%", // Example custom grid widths
      },
      screens: {
        // xs: "200px",
        xss: "450px",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
