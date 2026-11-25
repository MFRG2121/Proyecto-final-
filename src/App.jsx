import { Box } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskListPage from './pages/TaskListPage';
import CalendarPage from './pages/CalendarPage';

export default function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Routes>
        <Route path="/" element={<TaskListPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Box>
  );
}
