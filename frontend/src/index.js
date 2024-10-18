import React from 'react'; // Import React
import ReactDOM from 'react-dom/client'; // Import the createRoot function from ReactDOM
import App from './App'; // Import the App component
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing

// Create a root for React to render into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React application
root.render(
  <React.StrictMode>
    {/* Wrap the App component with BrowserRouter to enable routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
