# Plan Pals Web Front End

This project was bootstrapped with [Vite](https://vite.dev/).

## Prerequisites
Before starting, ensure you have Node.js and npm installed on your system. If not, you can download them [here](https://nodejs.org/).

## To Start:
1. In the `web-frontend` directory, run the following commands:
   ### Step 1: Install Dependencies
   ```bash
   npm install
   ```
   This will install all the required dependencies for the project.
   
   ### Step 2: Start the Development Server
   ```bash
   npm run dev
   ```
   This runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

   ### Step 3: Build for Production
   To build the app for production, run:
   ```bash
   npm run build
   ```
   This bundles the app to a static site in the `dist` directory.
   
## Handling CORS Issues
The app may encounter Cross-Origin Resource Sharing (CORS). To resolve this, follow these steps:

### Using Google Chrome:
1. Install the "Allow CORS: Access-Control-Allow-Origin" extension from the Chrome Web Store:
   - [Allow CORS: Access-Control-Allow-Origin Extension](https://chromewebstore.google.com/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)

2. After installing the extension, follow these steps:
   - Click the extension icon and toggle it to "On."
   - Go to the "Open options page."
   - Under the "Allowed Methods" section, add: `PUT, GET, HEAD, POST, DELETE, OPTIONS`
   - Check all the available options on the page to allow the required CORS headers.

3. Refresh your browser and proceed to run the front end using the steps provided above.

### Additional Notes
- If you are using a different browser, consider looking for a similar CORS extension or setting up a proxy server.

## Troubleshooting

- **Dependency Issues**: If you encounter any issues with dependencies, try deleting the `node_modules` folder and `package-lock.json`, then reinstalling:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
