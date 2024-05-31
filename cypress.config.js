const { defineConfig } = require("cypress");

// Populate process.env with values from .env file
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    includeShadowDom: true, // Important for interacting with Descope components
    baseUrl: 'https://explorer.descope.com',
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    descope_gold_project_id: process.env.MVP_GOLD_ID,
    descope_management_key: process.env.MANAGEMENT_KEY
  },
});