import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { TaskProvider } from './context/TaskContext';

const theme = extendTheme({
  fonts: {
    heading: "'DynaPuff', system-ui",
    body: "'DynaPuff', system-ui",
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TaskProvider>
          <App />
        </TaskProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);