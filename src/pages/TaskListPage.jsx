import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useTasks } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import { generateId } from '../utils/dates';

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'todo', label: 'Por hacer' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'completed', label: 'Completadas' },
];

export default function TaskListPage() {
  const { tasks, addTask, updateTask, deleteTask, changeStatus } = useTasks();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const visibleTasks = useMemo(() => {
    const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);
    return [...filtered].sort((a, b) =>
      sortBy === 'title'
        ? a.title.localeCompare(b.title, 'es')
        : a.dueDate.localeCompare(b.dueDate)
    );
  }, [tasks, filter, sortBy]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmit = (data) => {
    if (editingTask) {
      updateTask({ id: editingTask.id, ...data });
    } else {
      addTask({ id: generateId(), ...data });
    }
    closeForm();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  return (
    <Box maxW="1100px" mx="auto" p={6}>
      <Flex justify="space-between" align="center" mb={5} wrap="wrap" gap={3}>
        <Heading size="lg">Mis tareas</Heading>
        {!formOpen && (
          <Button colorScheme="teal" onClick={() => setFormOpen(true)}>
            Nueva tarea
          </Button>
        )}
      </Flex>

      {formOpen && (
        <Box mb={6}>
          <Heading size="sm" mb={2}>
            {editingTask ? 'Editar tarea' : 'Datos de la nueva tarea'}
          </Heading>
          <TaskForm
            key={editingTask?.id ?? 'new'}
            task={editingTask}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </Box>
      )}

      <Flex justify="space-between" align="center" mb={5} wrap="wrap" gap={3}>
        <ButtonGroup isAttached variant="outline" size="sm">
          {FILTERS.map(({ value, label }) => (
            <Button
              key={value}
              aria-pressed={filter === value}
              colorScheme={filter === value ? 'teal' : 'gray'}
              variant={filter === value ? 'solid' : 'outline'}
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>

        <Select
          w="220px"
          size="sm"
          aria-label="Ordenar por"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Ordenar por fecha</option>
          <option value="title">Ordenar por título</option>
        </Select>
      </Flex>

      {visibleTasks.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={10}>
          No hay tareas para mostrar.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={deleteTask}
              onChangeStatus={changeStatus}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
