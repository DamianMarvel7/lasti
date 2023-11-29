// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from "@chakra-ui/react";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ChakraProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ChakraProvider>
);

reportWebVitals();

