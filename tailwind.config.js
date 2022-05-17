module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {

      },
      "fontFamily": {
        "inter": "Inter, system-ui, sans-serif"
      },
      "gridTemplateColumns": {
        "site" : "auto, auto, minmax(2rem,10rem)]"
      },
    },
  },
  plugins: [],
}
