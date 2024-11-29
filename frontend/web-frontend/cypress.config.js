import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',  // This will set the base URL for your tests
    defaultCommandTimeout: 10000,  // Optional: Increase the timeout for commands
    pageLoadTimeout: 10000,       // Optional: Increase the timeout for page loads
  },
});
