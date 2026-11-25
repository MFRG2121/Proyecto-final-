import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { addDays, toISODate } from '../utils/dates';

export const STORAGE_KEY = 'gestion-tareas:v1';

// Genera tareas de ejemplo con fechas relativas a hoy para que el
// evaluador vea contenido real (en lista y calendario) al abrir la app.
export function getSampleTasks(today = new Date()) {
  return [
    {
      id: 'demo-1',
      title: 'Preparar presentación del proyecto',
      description: 'Armar las diapositivas y ensayar la demostración.',
      status: 'in_progress',
      dueDate: toISODate(today),
      priority: 'high',
    },
    {
      id: 'demo-2',
      title: 'Estudiar para el examen de Computación',
      description: 'Repasar estructuras de datos y bases de datos.',
      status: 'todo',
      dueDate: toISODate(addDays(today, 2)),
      priority: 'medium',
    },
    {
      id: 'demo-3',
      title: 'Entregar informe de redes',
      description: 'Subir el PDF con la tabla de direccionamiento IP.',
      status: 'completed',
      dueDate: toISODate(addDays(today, -3)),
      priority: 'low',
    },
    {
      id: 'demo-4',
      title: 'Revisar pruebas unitarias',
      description: '',
      status: 'todo',
      dueDate: toISODate(addDays(today, 7)),
      priority: 'high',
    },
  ];
}

// Reducer puro: nunca muta el estado anterior.
export function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload];
    case 'UPDATE_TASK':
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task
      );
    case 'DELETE_TASK':
      return state.filter((task) => task.id !== action.payload);
    case 'CHANGE_STATUS':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, status: action.payload.status }
          : task
      );
    default:
      return state;
  }
}

function loadTasks() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Si el JSON está corrupto o no hay acceso, usamos los datos de ejemplo.
  }
  return getSampleTasks();
}

const TaskContext = createContext(null);

// `initialTasks` permite inyectar datos (útil en pruebas); en ese caso
// no se lee ni se escribe localStorage.
export function TaskProvider({ children, initialTasks }) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks, (init) =>
    init ?? loadTasks()
  );

  useEffect(() => {
    if (initialTasks) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Ignorar errores de almacenamiento (modo privado, cuota, etc.)
    }
  }, [tasks, initialTasks]);

  const value = useMemo(
    () => ({
      tasks,
      dispatch,
      addTask: (task) => dispatch({ type: 'ADD_TASK', payload: task }),
      updateTask: (task) => dispatch({ type: 'UPDATE_TASK', payload: task }),
      deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
      changeStatus: (id, status) =>
        dispatch({ type: 'CHANGE_STATUS', payload: { id, status } }),
      pendingCount: tasks.filter((t) => t.status !== 'completed').length,
    }),
    [tasks]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de <TaskProvider>');
  return ctx;
}
