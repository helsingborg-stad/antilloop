/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xl: "1200px"
      },
      backgroundPosition: {
        "top-right-overflow": "300% 30%"
      },
      backgroundSize: {
        80: "80%"
      },
      boxShadow: {
        material: "0px 8px 32px rgba(0, 0, 0, 0.2)",
        tooltip: "0px 12px 40px 0px rgba(0, 94, 177, 0.16)",
        "material-s": "0px 6px 16px 0px rgba(0, 0, 0, 0.12)",
        "material-l": "0px 12px 48px 0px rgba(0, 0, 0, 0.20)"
      },
      height: {
        18: "4.5rem"
      },
      colors: {
        borderSchool: "#F2F4F6",
        divider: "#C0C8CD",
        secondary: "#E1E2E5",
        whiteTransparent: "rgba(255, 255, 255, 0.8)",
        lime: {
          50: "#F7FFED",
          100: "#DBECDF",
          150: "#CFEDD7",
          200: "#E4FFD6",
          300: "#B6F399",
          700: "#356A21",
          800: "#164100",
          "900-12": "rgba(5,33,0, 0.12)"
        },
        red: {
          200: "#FFDAD6",
          300: "#F87750",
          400: "#CB4B24",
          500: "#BE0A18",
          800: "#410003",
          900: "#723700"
        },
        blue: {
          50: "#F8F9FB",
          70: "#F2F4F6",
          100: "#D5E3FF",
          150: "#CEF0F6",
          200: "#BEE6FA",
          300: "#C1E9FF",
          500: "#005EB1",
          900: "#003060",
          "500-8": "#005EB114",
          "500-12": "#005EB11F",
          "500-16": "#005EB129"
        },
        yellow: {
          300: "#FFF0C9",
          500: "#FFE07F",
          900: "#725C00"
        },
        grey: {
          50: "#F0F1F3",
          100: "#EDEEF0",
          200: "#E7E8EA",
          300: "#70787D",
          400: "#40484C",
          700: "#2E3133",
          800: "#191C1E",
          "700-8": "rgba(25, 28, 30, 0.08)",
          "700-12": "rgba(25, 28, 30, 0.12)",
          "700-34": "rgba(25, 28, 30, 0.34)"
        },
        widget: {
          medium: "#725C00",
          poor: "#B20000"
        }
      },
      borderRadius: {
        20: "20px",
        24: "24px",
        32: "32px",
        36: "36px",
        64: "64px",
        80: "80px",
        100: "100px"
      }
    }
  },
  important: "body",
  plugins: []
};
