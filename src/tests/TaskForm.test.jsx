import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import TaskForm from '../components/TaskForm';

const renderForm = (props) =>
  render(
    <ChakraProvider>
      <TaskForm {...props} />
    </ChakraProvider>
  );

describe('TaskForm', () => {
  test('muestra error si el título tiene menos de 3 caracteres', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText(/título/i), 'ab');
    fireEvent.change(screen.getByLabelText(/fecha límite/i), { target: { value: '2025-03-20' } });
    await user.click(screen.getByRole('button', { name: /crear tarea/i }));

    expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('muestra error si falta la fecha límite', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText(/título/i), 'Tarea válida');
    await user.click(screen.getByRole('button', { name: /crear tarea/i }));

    expect(screen.getByText(/fecha límite es obligatoria/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('envía los datos correctos al crear una tarea', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText(/título/i), '  Nueva tarea  ');
    await user.type(screen.getByLabelText(/descripción/i), 'Detalle');
    fireEvent.change(screen.getByLabelText(/fecha límite/i), { target: { value: '2025-03-20' } });
    await user.selectOptions(screen.getByLabelText(/prioridad/i), 'high');
    await user.click(screen.getByRole('button', { name: /crear tarea/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Nueva tarea',
      description: 'Detalle',
      status: 'todo',
      dueDate: '2025-03-20',
      priority: 'high',
    });
  });

  test('precarga los datos al editar una tarea', () => {
    const task = {
      id: 'x1',
      title: 'Tarea existente',
      description: 'Descripción previa',
      status: 'in_progress',
      dueDate: '2025-05-01',
      priority: 'low',
    };
    renderForm({ task, onSubmit: jest.fn() });

    expect(screen.getByLabelText(/título/i)).toHaveValue('Tarea existente');
    expect(screen.getByLabelText(/descripción/i)).toHaveValue('Descripción previa');
    expect(screen.getByLabelText(/fecha límite/i)).toHaveValue('2025-05-01');
    expect(screen.getByLabelText(/estado/i)).toHaveValue('in_progress');
    expect(screen.getByLabelText(/prioridad/i)).toHaveValue('low');
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
  });
});
