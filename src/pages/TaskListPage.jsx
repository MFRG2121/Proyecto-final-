import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Select,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
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
    <Box bg="#FAF7F2" flex="1" minH="100vh" alignSelf="stretch">
      <Box maxW="1440px" w="full" mx="auto" px={{ base: 4, md: 6 }} pt={5} pb={8}>
        <Flex
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          mb={6}
          pb={4}
          borderBottom="1px solid"
          borderColor="#E6DFD3"
        >
          <Heading size="lg" fontWeight="800" color="#1E2421" letterSpacing="-0.02em">
            Mis tareas
          </Heading>

          <Flex align="center" gap={3} wrap="wrap">
            <HStack spacing={1.5} bg="white" p={1} borderRadius="full" borderWidth="1px" borderColor="#E6DFD3">
              {FILTERS.map(({ value, label }, index) => {
                const active = filter === value;
                return (
                  <Button
                    key={value}
                    size="xs"
                    h="28px"
                    px={3.5}
                    borderRadius="full"
                    aria-pressed={active}
                    variant="ghost"
                    bg={active ? '#1E2421' : 'transparent'}
                    color={active ? 'white' : '#5C635F'}
                    fontWeight={active ? '700' : '500'}
                    position="relative"
                    _hover={{
                      bg: active ? '#1E2421' : '#FAF7F2',
                      color: active ? 'white' : '#1E2421',
                      zIndex: 1,
                      sx: {
                        animation: `${index % 2 === 0 ? 'tiltBounce' : 'tiltBounceAlt'} 0.15s ease forwards`,
                      },
                    }}
                    onClick={() => setFilter(value)}
                  >
                    {label}
                  </Button>
                );
              })}
            </HStack>

            <Select
              w="185px"
              size="sm"
              h="36px"
              borderRadius="full"
              bg="white"
              borderColor="#E6DFD3"
              color="#1E2421"
              fontSize="xs"
              fontWeight="600"
              _hover={{ borderColor: '#D2C8B8' }}
              _focus={{ borderColor: '#E07A5F' }}
              aria-label="Ordenar por"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Ordenar por fecha</option>
              <option value="title">Ordenar por título</option>
            </Select>

            {!formOpen && (
              <Button
                leftIcon={<AddIcon boxSize={2.5} />}
                bg="#E07A5F"
                color="white"
                position="relative"
                _hover={{
                  bg: '#C9654B',
                  zIndex: 1,
                  sx: {
                    animation: 'tiltBounce 0.15s ease forwards',
                  },
                }}
                size="sm"
                px={4}
                h="36px"
                borderRadius="full"
                fontWeight="700"
                onClick={() => setFormOpen(true)}
              >
                Nueva tarea
              </Button>
            )}
          </Flex>
        </Flex>

        {formOpen && (
          <Box mb={6}>
            <Heading size="xs" textTransform="uppercase" letterSpacing="0.06em" color="#5C635F" mb={2.5}>
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

        {visibleTasks.length === 0 ? (
          <Box
            bg="white"
            borderWidth="1px"
            borderColor="#E6DFD3"
            borderTopLeftRadius="2xl"
            borderBottomRightRadius="2xl"
            py={14}
            px={4}
            textAlign="center"
          >
            <Text fontSize="sm" fontWeight="600" color="#5C635F">
              No hay tareas para mostrar.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
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
    </Box>
  );
}