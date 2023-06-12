/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important:true,
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      transformOrigin: {
        0: "0%"
      },
      zIndex: {
        "-1": "-1"
      },
      width: {
        488: "48%",
        5.5: "22px",
        "284px" : "284px",
        "unset": "unset",
      },
      height:{
        5.5: "22px",
        "unset": "unset",
        "90%": "90%",
      },
      lineHeight: {
        'dsnug': '21.56px',
        'dtight': '19.6px',
        'loose': '1.75',
        'lcf': "22.2133px",
        'spn': "17.36px",
        "pn": "31.36px"
        // Add more line heights as needed
      },
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
      dcf : "15.8666px" , // filter title 
      d16: "16px",
      d17: "16px",
      d18: "18px",
      d20: "20.5712px",
      d22: "22px",
      d25: "25px",
      d28: "28px",
      xs: ".75rem",
      sm: ".875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      xxl: "2rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem"
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
        DEFAULT: "#bf1b26"    //ishtari's red color
      },
      dSecondary: {
        DEFAULT: "3866de"
      },
      dPink: {
        DEFAULT: "#FFCCCB"
      },
      dgrey: {
        DEFAULT: "#f7f7fa"
      },
      dgreyRate: {
        DEFAULT: "#f2f2f2"
      },
      dRate: {
        DEFAULT: "#F2994A"
      },
      dblue: {
        DEFAULT: "#3866de"
      },
      dbluedark: {
        DEFAULT: "#2b4cd7"
      },
      dblack: {
        DEFAULT: "#404553"
      },
      dgrey1: {
        DEFAULT: "#7e859b"
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
      dDarkgrey: {
        DEFAULT: "#565656"
      },
      dborderColor: {
        DEFAULT: "#e2e5f1"
      },
      dgreyBlack: {
        DEFAULT: "rgb(65,69,81)"
      },
      dgreyPrev:{
        DEFAULT: "rgb(247, 247, 250)"
      },
      dblackOverlay:{
        DEFAULT: "rgba(0,0,0,0.5)"
      },
      dbeigeRed:{
        DEFAULT: "rgb(252, 244, 244)"
      },
      dsearchGrey:{
        DEFAULT: "#f4f4f4"
      },
      dborderProduct:{
        DEFAULT: "#F0F2F8"     //like noon
      }, 
      dgreyProduct:{
        DEFAULT: "#7E859B"     //like noon
      }, 
      dgreyQtyProduct:{
        DEFAULT: "#B2BBD2"     //like noon
      }, 
      dprimarybg:{
        DEFAULT: "#F8F8F9"
      },
      dgreyZoom:{
        DEFAULT: "#EBECF0"
      },
      darrowZoom:{
        DEFAULT: "#b4b4b4"
      },
      dblueHover:{
        DEFAULT: "#3E72F7"
      },
      dgreyAddress:{
        DEFAULT: "#9BA0AA"
      },
    },

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
        }
      });
    },
  ]
}
