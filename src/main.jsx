import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TaskProvider } from './context/TaskContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TaskProvider>
          <App />
        </TaskProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
