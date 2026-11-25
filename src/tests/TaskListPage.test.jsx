import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskListPage from '../pages/TaskListPage';
import { renderWithProviders } from './testUtils';

describe('TaskListPage', () => {
  test('renderiza las tareas iniciales', () => {
    renderWithProviders(<TaskListPage />);
    expect(screen.getByText('Estudiar React')).toBeInTheDocument();
    expect(screen.getByText('Entregar informe')).toBeInTheDocument();
    expect(screen.getByText('Comprar libros')).toBeInTheDocument();
  });

  test('filtra las tareas por estado', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListPage />);

    await user.click(screen.getByRole('button', { name: 'En progreso' }));
    expect(screen.getByText('Entregar informe')).toBeInTheDocument();
    expect(screen.queryByText('Estudiar React')).not.toBeInTheDocument();
    expect(screen.queryByText('Comprar libros')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Todas' }));
    expect(screen.getByText('Estudiar React')).toBeInTheDocument();
  });

  test('crea una tarea nueva desde el formulario', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListPage />);

    await user.click(screen.getByRole('button', { name: /nueva tarea/i }));
    await user.type(screen.getByLabelText(/título/i), 'Tarea creada en test');
    fireEvent.change(screen.getByLabelText(/fecha límite/i), { target: { value: '2025-06-01' } });
    await user.click(screen.getByRole('button', { name: /crear tarea/i }));

    expect(screen.getByText('Tarea creada en test')).toBeInTheDocument();
  });

  test('elimina una tarea', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListPage />);

    await user.click(screen.getByRole('button', { name: 'Eliminar Estudiar React' }));
    expect(screen.queryByText('Estudiar React')).not.toBeInTheDocument();
  });

  test('cambia el estado de una tarea', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListPage />);

    await user.selectOptions(
      screen.getByLabelText('Cambiar estado de Estudiar React'),
      'completed'
    );
    await user.click(screen.getByRole('button', { name: 'Completadas' }));

    expect(screen.getByText('Estudiar React')).toBeInTheDocument();
    expect(screen.getByText('Comprar libros')).toBeInTheDocument();
    expect(screen.queryByText('Entregar informe')).not.toBeInTheDocument();
  });

  test('edita una tarea existente', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListPage />);

    await user.click(screen.getByRole('button', { name: 'Editar Estudiar React' }));
    const title = screen.getByLabelText(/título/i);
    expect(title).toHaveValue('Estudiar React');
    await user.clear(title);
    await user.type(title, 'React avanzado');
    await user.click(screen.getByRole('button', { name: /guardar cambios/i }));

    expect(screen.getByText('React avanzado')).toBeInTheDocument();
    expect(screen.queryByText('Estudiar React')).not.toBeInTheDocument();
  });
});
