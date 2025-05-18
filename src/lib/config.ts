// Environment configuration for the application
interface Config {
  apiBaseUrl: string;
  defaultModel: string;
  isProduction: boolean;
}

// Default to production environment when deployed
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';

// Configuration based on environment
const config: Config = {
  // Use the deployed Cloud Run URL in production, local server in development
  apiBaseUrl: isProduction 
    ? 'https://priori-backend-[YOUR_CLOUD_RUN_URL].a.run.app/api'  // Replace with your actual Cloud Run URL
    : 'http://localhost:5001/api',
  
  defaultModel: 'llama3.2',
  isProduction
};

export default config;
