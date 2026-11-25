# Aplicación de Gestión de Tareas

Aplicación web para crear, editar, filtrar y visualizar tareas en una **vista de lista** y en una **vista de calendario mensual**. Los datos se guardan en `localStorage`, por lo que se conservan al recargar la página.

## Stack tecnológico

- **React 18** + **Vite** (herramienta de desarrollo y build)
- **react-router-dom** (enrutamiento: `/` lista, `/calendar` calendario)
- **Chakra UI** (+ Emotion y Framer Motion) para la interfaz
- **Context API + useReducer** para el estado global
- **Jest** + **React Testing Library** para pruebas unitarias

## Ejecución

```bash
npm install     # instala dependencias
npm run dev     # servidor de desarrollo (http://localhost:5173)
npm test        # ejecuta las pruebas unitarias
npm run build   # build de producción (carpeta dist/)
```

Al abrir la app por primera vez se cargan 4 tareas de ejemplo (con fechas relativas a hoy, en distintos estados) para que se vea contenido real de inmediato. Para volver a ese estado inicial, borra la clave `gestion-tareas:v1` del `localStorage` del navegador.

## Funcionalidades

- Crear, editar y eliminar tareas (formulario reutilizable con validación).
- Cambiar el estado directamente desde cada tarjeta: *Por hacer*, *En progreso*, *Completada*.
- Filtrar por estado (*Todas*, *Por hacer*, *En progreso*, *Completadas*) y ordenar por fecha o por título.
- Calendario mensual navegable (*Mes anterior*, *Hoy*, *Mes siguiente*) con las tareas ubicadas en su fecha límite.
- Contador en tiempo real de tareas pendientes en la barra superior.

## Modelo de datos

| Campo | Tipo | Detalle |
|---|---|---|
| `id` | string | Único |
| `title` | string | Requerido, mínimo 3 caracteres |
| `description` | string | Opcional |
| `status` | `"todo"` \| `"in_progress"` \| `"completed"` | Estado |
| `dueDate` | string | Formato `YYYY-MM-DD` |
| `priority` | `"low"` \| `"medium"` \| `"high"` | Prioridad |

## Arquitectura

```
src/
├── context/TaskContext.jsx   # taskReducer, TaskProvider, hook useTasks, persistencia
├── components/               # Navbar, TaskForm, TaskCard (piezas reutilizables)
├── pages/                    # TaskListPage (/), CalendarPage (/calendar)
├── utils/                    # constantes (etiquetas, colores) y utilidades de fechas
├── tests/                    # pruebas unitarias
├── App.jsx                   # rutas
└── main.jsx                  # ChakraProvider > BrowserRouter > TaskProvider > App
```

### Flujo de datos

1. `TaskProvider` crea el estado con `useReducer(taskReducer, ...)`. El estado inicial sale de `localStorage` o, si no existe, de las tareas de ejemplo. Cada cambio se vuelve a guardar en `localStorage`.
2. El reducer maneja cuatro acciones, sin mutar el estado anterior: `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK` y `CHANGE_STATUS`.
3. Los componentes consumen el estado con `useTasks()`, que expone `tasks`, `addTask`, `updateTask`, `deleteTask`, `changeStatus` y `pendingCount`.
4. `Navbar` lee `pendingCount`; `TaskListPage` filtra/ordena `tasks` y renderiza `TaskCard`s y `TaskForm`; `CalendarPage` agrupa `tasks` por `dueDate` y los coloca en la celda del día correspondiente.

## Pruebas unitarias

| Archivo | Qué cubre |
|---|---|
| `taskReducer.test.js` | Las 4 acciones devuelven el estado esperado sin mutar el anterior (estado congelado con `Object.freeze`) |
| `TaskForm.test.jsx` | Mensajes de validación (título corto, fecha faltante), envío correcto al crear y precarga de datos al editar |
| `TaskListPage.test.jsx` | Renderizado inicial, filtrado por estado, crear, editar, eliminar y cambiar estado |
| `CalendarPage.test.jsx` | Tareas en su fecha correcta y navegación entre meses (anterior, siguiente, Hoy) |

`src/tests/testUtils.jsx` provee `renderWithProviders`, que envuelve los componentes con Chakra, Router y un `TaskProvider` con datos controlados (sin tocar `localStorage`).

## Verificación antes de subir a GitHub

```bash
npm test         # todos los tests en verde
npm run build    # sin errores de compilación
```
