const pkg = require("./package");

module.exports = {
  ssr: true,

  /*
   ** Headers of the page
   */
  head: {
    title: "Applicant Challenge",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      //{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },

  /*
   ** Global CSS
   */
  css: [
    "~/assets/style/app.styl",
    "~/assets/css/main.css",
    "~/assets/css/material-design-icons.css",
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["@/plugins/vuetify"],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    "@nuxtjs/axios",
    "vue-toastification/nuxt",
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: "/api",
  },
  toast: {
    timeout: 2000,
    closeOnClick: true,
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
  /*
  env: {
    baseUrl: process.env.FLEXKIT_BASE_URL || 'http://localhost:4000'
  },
  */
  server: {
    port: 4000,
    host: "0.0.0.0",
    timing: false,
  },
};
