import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';
import { TaskProvider } from '../context/TaskContext';

export const sampleTasks = [
  {
    id: 't1',
    title: 'Estudiar React',
    description: 'Repasar hooks',
    status: 'todo',
    dueDate: '2025-03-15',
    priority: 'high',
  },
  {
    id: 't2',
    title: 'Entregar informe',
    description: '',
    status: 'in_progress',
    dueDate: '2025-03-20',
    priority: 'medium',
  },
  {
    id: 't3',
    title: 'Comprar libros',
    description: '',
    status: 'completed',
    dueDate: '2025-04-02',
    priority: 'low',
  },
];

export function renderWithProviders(ui, { tasks = sampleTasks, route = '/' } = {}) {
  return render(
    <ChakraProvider>
      <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <TaskProvider initialTasks={tasks}>{ui}</TaskProvider>
      </MemoryRouter>
    </ChakraProvider>
  );
}
