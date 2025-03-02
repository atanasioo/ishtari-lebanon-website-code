/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  important: true,
  theme: {
    extend: {
      maxHeight: {
        "90%": "90%",
        "245px": "245px",
        "350px": "350px",
        "410px": "410px",
        "450px": "450px",
        "700px": "700px"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      transformOrigin: {
        0: "0%"
      },
      zIndex: {
        "-1": "-1"
      },
      width: {
        488: "48%",
        "86%": "86%",
        5.5: "22px",
        "150px": "150px",
        "284px": "284px",
        "1057px": "1057px",
        unset: "unset"
      },
      height: {
        5.5: "22px",
        22: "85px",
        unset: "unset",
        "90%": "90%",
        "90vh": "90vh",
        "100svh": "100svh",
        "100lvh": "100lvh",
        "100dvh": "100dvh"
      },
      lineHeight: {
        dsnug: "21.56px",
        dtight: "19.6px",
        loose: "1.75",
        lcf: "22.2133px",
        spn: "17.36px",
        pn: "31.36px",
        26: "26.7736px"
        // Add more line heights as needed
      }
    },
    screens: {
      xs: "320px",
      // => @media (min-width: 320px) { ... }
      sm: "640px",
      // => @media (min-width: 640px) { ... },
      mobile: "650px",
      // => @media (min-width: 650px) { ... },

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px"
      // => @media (min-width: 1536px) { ... }
    },
    fontFamily: {
      sans: ["PR", "sans"],
      impact: ["Impact"]
    },
    fontSize: {
      d6: "6px",
      d10: "10px",
      d11: "11px",
      d12: "12px",
      d13: "13px",
      d14: "14px",
      d15: "15px",
      df: "15.4px", // footer parent category
      dcf: "15.8666px", // filter title
      d16: "16px",
      d17: "17px",
      d18: "18px",
      d20: "20.5712px",
      d22: "22px",
      d24: "24px",
      d25: "25px",
      d28: "28px",
      xs: ".75rem",
      sm: ".875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      xll: "1.366rem",
      xxl: "2rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "4xxl": "2.1rem",
      "5xxl": "2.5rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem"
    },
    outlineWidth: {
      0.5: "0.5px"
    },

    colors: {
      white: {
        DEFAULT: "rgb(255 255 255)"
      },
      transparent: {
        DEFAULT: "transparent"
      },
      Orangeflo: {
        DEFAULT: "#FF681F"
      },
      Energyplus: {
        DEFAULT: "#E1E81B"
      },
      greenaalbeit: {
        DEFAULT: "#04A59C"
      },
      dinputBorder: {
        DEFAULT: "#f7f7fa"
      },
      dplaceHolder: {
        DEFAULT: "rgb(228, 230, 237)"
      },
      dlabelColor: {
        DEFAULT: "rgb(126, 133, 155)"
      },
      dbase: {
        DEFAULT: "#bf1b26" //ishtari's red color
      },
      dbase1: {
        DEFAULT: "#e94a4e" //ishtari's red color
      },
      dSecondary: {
        DEFAULT: "3866de"
      },
      dPink: {
        DEFAULT: "#FFCCCB"
      },
      dTransparentWhite1: {
        DEFAULT: "rgba(255,255,255,0.5)"
      },
      dgrey: {
        DEFAULT: "#f7f7fa"
      },
      dgrey1: {
        DEFAULT: "#7e859b"
      },
      dgreyRate: {
        DEFAULT: "#f2f2f2"
      },
      dgreySeller: {
        DEFAULT: "#959cb6"
      },
      dRate: {
        DEFAULT: "#F2994A"
      },
      dblue: {
        DEFAULT: "#3866de"
      },
      dblue1: {
        DEFAULT: "#5079e2"
      },
      dblue2: {
        DEFAULT: "#658ae6"
      },
      dbluedark: {
        DEFAULT: "#2b4cd7"
      },
      dblack: {
        DEFAULT: "#404553"
      },
      dgreen: {
        DEFAULT: "#38ae04"
      },
      dgreen2: {
        DEFAULT: "#90ee90"
      },
      dgreenop: {
        DEFAULT: "#def0d9"
      },
      dmenusep: {
        DEFAULT: "#ce5154"
      },
      dmenusepaalbeit: {
        DEFAULT: "#2e8b57"
      },
      dfooterbg: {
        DEFAULT: "#f6f9fd"
      },
      slate200: {
        DEFAULT: "#f2f3f8"
      },
      dslate: {
        DEFAULT: "#D9DADF"
      },
      borderbottom: {
        DEFAULT: "#ebedf2"
      },
      daside: {
        DEFAULT: "#242939"
      },
      dmenu: {
        DEFAULT: "#646c9a"
      },
      dsuccess: {
        DEFAULT: "#1dc9b7"
      },
      dhotPink: {
        DEFAULT: "#F42C38"
      },
      dtrash: {
        DEFAULT: "#d3dae6"
      },
      dbluegray: {
        DEFAULT: "#646c9a"
      },
      dyellow: {
        DEFAULT: "#ffb822"
      },
      dpink: {
        DEFAULT: "#fd397a"
      },
      dblackk: {
        DEFAULT: "#000000"
      },
      dfacebook: {
        DEFAULT: "#4267B2"
      },
      dpinterest: {
        DEFAULT: "#E60023"
      },
      dtwitter: {
        DEFAULT: "#1DA1F2"
      },
      dwhatsapp: {
        DEFAULT: "#128C7E"
      },
      dTransparentWhite: {
        DEFAULT: "rgba(255,255,255,.8)"
      },
      dTransparentWhite2: {
        DEFAULT: "rgba(255,255,255,.6)"
      },
      dDarkgrey: {
        DEFAULT: "#565656"
      },
      dborderColor: {
        DEFAULT: "#e2e5f1"
      },
      dgreyBlack: {
        DEFAULT: "rgb(65,69,81)"
      },
      dgreyPrev: {
        DEFAULT: "rgb(247, 247, 250)"
      },
      dblackOverlay: {
        DEFAULT: "rgba(0,0,0,0.5)"
      },
      dblackOverlay2: {
        DEFAULT: "rgba(74,74,74,0.3)"
      },
      dblackOverlay3: {
        DEFAULT: "rgba(74,74,74,1)"
      },
      dbeigeRed: {
        DEFAULT: "rgb(252, 244, 244)"
      },
      dsearchGrey: {
        DEFAULT: "#f4f4f4"
      },
      dborderProduct: {
        DEFAULT: "#F0F2F8" //like noon
      },
      dgreyProduct: {
        DEFAULT: "#7E859B" //like noon
      },
      dgreyQtyProduct: {
        DEFAULT: "#B2BBD2" //like noon
      },
      dprimarybg: {
        DEFAULT: "#F8F8F9"
      },
      dgreyZoom: {
        DEFAULT: "#EBECF0"
      },
      darrowZoom: {
        DEFAULT: "#b4b4b4"
      },
      dblueHover: {
        DEFAULT: "#3E72F7"
      },
      dgreyAddress: {
        DEFAULT: "#9BA0AA"
      },
      dborderAddress: {
        DEFAULT: "#DADCE3"
      },
      dgreyAccount: {
        DEFAULT: "rgb(126,133,155)"
      },
      dgreyAccountActive: {
        DEFAULT: "rgb(64,69,83)"
      }
    }
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          width: "100%",
          maxWidth: "1440px",
          padding: "0 0.75rem",
          margin: "auto",
          overfloe: "hidden"
        },
        ".seller-container": {
          width: "100%",
          maxWidth: "1440px",
          padding: "0 0.75rem",
          margin: "auto",
          overfloe: "hidden"
        },
        ".top-245px": {
          top: "245px"
        },
        ".top-182px": {
          top: "182px"
        }
      });
    }
  ]
};
