import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarPage from '../pages/CalendarPage';
import { MONTH_NAMES } from '../utils/constants';
import { renderWithProviders } from './testUtils';

const renderCalendar = () =>
  renderWithProviders(<CalendarPage initialDate={new Date(2025, 2, 10)} />);

describe('CalendarPage', () => {
  test('muestra el mes inicial y ubica las tareas en su fecha', () => {
    renderCalendar();
    expect(screen.getByTestId('month-title')).toHaveTextContent('Marzo 2025');

    expect(within(screen.getByTestId('day-2025-03-15')).getByText('Estudiar React')).toBeInTheDocument();
    expect(within(screen.getByTestId('day-2025-03-20')).getByText('Entregar informe')).toBeInTheDocument();
    // La tarea de abril no aparece en marzo
    expect(screen.queryByText('Comprar libros')).not.toBeInTheDocument();
  });

  test('navega al mes siguiente y muestra sus tareas', async () => {
    const user = userEvent.setup();
    renderCalendar();

    await user.click(screen.getByRole('button', { name: /mes siguiente/i }));
    expect(screen.getByTestId('month-title')).toHaveTextContent('Abril 2025');
    expect(within(screen.getByTestId('day-2025-04-02')).getByText('Comprar libros')).toBeInTheDocument();
    expect(screen.queryByText('Estudiar React')).not.toBeInTheDocument();
  });

  test('navega al mes anterior', async () => {
    const user = userEvent.setup();
    renderCalendar();

    await user.click(screen.getByRole('button', { name: /mes anterior/i }));
    expect(screen.getByTestId('month-title')).toHaveTextContent('Febrero 2025');
  });

  test('el botón Hoy regresa al mes actual', async () => {
    const user = userEvent.setup();
    renderCalendar();

    await user.click(screen.getByRole('button', { name: /^hoy$/i }));
    const now = new Date();
    expect(screen.getByTestId('month-title')).toHaveTextContent(
      `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`
    );
  });
});
